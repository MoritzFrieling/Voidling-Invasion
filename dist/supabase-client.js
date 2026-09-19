// Supabase Auth and cloud persistence adapter; the game can run without it.
(() => {
  'use strict';

  const SUPABASE_URL = 'https://vwmqichhpmikufwqofpn.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_IRxQOVAj6ICYn2ix574fUA_E6_T69KB';
  const GAME_ID = 'voidline-invasion';
  const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

  let client = null;
  let pilot = null;
  let initialized = false;
  const listeners = new Set();

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase();
  }

  function validateUsername(value) {
    const username = normalizeUsername(value);
    if (!USERNAME_PATTERN.test(username)) {
      throw new Error('Use 3–20 letters, numbers, or underscores.');
    }
    return username;
  }

  function validatePassword(value) {
    const password = String(value || '');
    if (password.length < 8 || password.length > 72) {
      throw new Error('Password must contain 8–72 characters.');
    }
    return password;
  }

  // Supabase Auth requires an email-shaped identifier for password accounts.
  // This address is internal only: players enter and see usernames, never email.
  function accountIdentifier(username) {
    return `${normalizeUsername(username)}@pilots.voidline.game`;
  }

  function friendlyError(error) {
    const message = String(error?.message || error || 'The pilot network did not respond.');
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials')) return new Error('Username or password is incorrect.');
    if (lower.includes('already registered') || lower.includes('already exists') || lower.includes('already in use') || lower.includes('duplicate key')) return new Error('That callsign is already in use.');
    if (lower.includes('anonymous sign-ins are disabled')) return new Error('Guest access must be enabled in the Supabase Auth settings.');
    if (lower.includes('email not confirmed')) return new Error('Confirm the administrator user in Supabase Auth before signing in.');
    if (lower.includes('set_voidline_guest_username') && lower.includes('could not find the function')) {
      return new Error('Guest callsign editing needs migration 003. Run supabase/migrations/003_remove_account_upgrades.sql in the Supabase SQL Editor.');
    }
    if (lower.includes('relation') || lower.includes('schema cache') || lower.includes('could not find the function')) {
      return new Error('The Supabase database setup is not installed yet. Run supabase/migrations/001_voidline_cloud.sql in the SQL Editor.');
    }
    if (lower.includes('failed to fetch') || lower.includes('networkerror')) return new Error('The cloud service is unreachable. Check your connection and try again.');
    return new Error(message);
  }

  function notify() {
    for (const listener of listeners) listener(pilot);
  }

  async function fetchPilot(user) {
    if (!user) return null;
    const { data, error } = await client
      .from('profiles')
      .select('username, is_guest, is_admin')
      .eq('user_id', user.id)
      .single();
    if (error) throw friendlyError(error);
    return {
      id: user.id,
      username: data.username,
      isGuest: Boolean(data.is_guest),
      isAdmin: Boolean(data.is_admin),
    };
  }

  async function setPilotFromSession(session, shouldNotify = true) {
    pilot = session?.user ? await fetchPilot(session.user) : null;
    if (shouldNotify) notify();
    return pilot;
  }

  async function init() {
    if (initialized) return pilot;
    if (!window.supabase?.createClient) throw new Error('The Supabase client library could not be loaded.');
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'voidline-pilot-session',
      },
    });
    initialized = true;

    const { data, error } = await client.auth.getSession();
    if (error) throw friendlyError(error);
    await setPilotFromSession(data.session, false);

    client.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_OUT') return;
      pilot = session?.user ? pilot : null;
      notify();
    });
    return pilot;
  }

  function requireClient() {
    if (!client) throw new Error('The pilot network is still connecting.');
  }

  async function playAsGuest(usernameValue) {
    requireClient();
    const username = validateUsername(usernameValue);
    const { data, error } = await client.auth.signInAnonymously({
      options: { data: { username, display_name: username } },
    });
    if (error) throw friendlyError(error);
    return setPilotFromSession(data.session);
  }

  async function updateGuestUsername(usernameValue) {
    requireClient();
    if (!pilot?.isGuest) throw new Error('Only guest callsigns can be changed.');
    const username = validateUsername(usernameValue);
    const { data, error } = await client.rpc('set_voidline_guest_username', { p_username: username });
    if (error) throw friendlyError(error);
    pilot = { ...pilot, username: data || username };
    notify();
    return pilot;
  }

  async function signInAdmin(usernameValue, passwordValue) {
    requireClient();
    const username = validateUsername(usernameValue);
    const password = validatePassword(passwordValue);
    const { data, error } = await client.auth.signInWithPassword({
      email: accountIdentifier(username),
      password,
    });
    if (error) throw friendlyError(error);
    const signedInPilot = await setPilotFromSession(data.session);
    if (signedInPilot?.isAdmin) return signedInPilot;
    await signOut();
    throw new Error('This account does not have administrator access.');
  }

  async function signOut() {
    requireClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw friendlyError(error);
    pilot = null;
    notify();
  }

  async function loadProgress() {
    requireClient();
    if (!pilot) return null;
    const { data, error } = await client
      .from('game_saves')
      .select('campaign, high_score, updated_at')
      .eq('user_id', pilot.id)
      .eq('game_id', GAME_ID)
      .maybeSingle();
    if (error) throw friendlyError(error);
    return data;
  }

  async function saveProgress(campaign, highScore) {
    requireClient();
    if (!pilot) return;
    const { error } = await client.from('game_saves').upsert({
      user_id: pilot.id,
      game_id: GAME_ID,
      campaign,
      high_score: Math.max(0, Math.floor(Number(highScore) || 0)),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,game_id' });
    if (error) throw friendlyError(error);
  }

  async function submitScore(result) {
    requireClient();
    if (!pilot || pilot.isAdmin) return;
    const { error } = await client.rpc('submit_voidline_score', {
      p_score: Math.max(0, Math.floor(Number(result.score) || 0)),
      p_level: Math.max(1, Math.floor(Number(result.level) || 1)),
      p_stage: Math.max(0, Math.floor(Number(result.stage) || 0)),
      p_kills: Math.max(0, Math.floor(Number(result.kills) || 0)),
    });
    if (error) throw friendlyError(error);
  }

  async function getLeaderboard(limit = 12) {
    requireClient();
    const { data, error } = await client.rpc('get_voidline_leaderboard', {
      p_limit: Math.max(1, Math.min(50, Math.floor(limit))),
    });
    if (error) throw friendlyError(error);
    return data || [];
  }

  window.VoidlineCloud = {
    init,
    onChange(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getPilot() { return pilot; },
    normalizeUsername,
    playAsGuest,
    updateGuestUsername,
    signInAdmin,
    signOut,
    loadProgress,
    saveProgress,
    submitScore,
    getLeaderboard,
  };
})();
