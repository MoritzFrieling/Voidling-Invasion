-- Voidline Invasion cloud saves, pilot profiles, and leaderboard.
-- Safe to run in the Supabase SQL Editor. No secret keys are stored here.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,20}$'),
  is_guest boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));

create table if not exists public.game_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null check (game_id ~ '^[a-z0-9-]{3,50}$'),
  campaign jsonb not null default '{}'::jsonb,
  high_score integer not null default 0 check (high_score >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create table if not exists public.leaderboard_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null check (game_id ~ '^[a-z0-9-]{3,50}$'),
  best_score integer not null check (best_score >= 0),
  level_reached integer not null default 1 check (level_reached >= 1),
  stage_reached integer not null default 0 check (stage_reached >= 0),
  kills integer not null default 0 check (kills >= 0),
  achieved_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create table if not exists public.account_upgrades (
  token uuid primary key,
  from_user uuid not null unique references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '10 minutes')
);

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.leaderboard_scores enable row level security;
alter table public.account_upgrades enable row level security;

drop policy if exists "pilots can read their profile" on public.profiles;
create policy "pilots can read their profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "pilots can read their save" on public.game_saves;
create policy "pilots can read their save"
  on public.game_saves for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "pilots can create their save" on public.game_saves;
create policy "pilots can create their save"
  on public.game_saves for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "pilots can update their save" on public.game_saves;
create policy "pilots can update their save"
  on public.game_saves for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Profiles are created from trusted Auth data, not directly by the browser.
create or replace function public.handle_voidline_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
begin
  requested_username := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  if requested_username !~ '^[a-z0-9_]{3,20}$' then
    requested_username := 'pilot_' || replace(substr(new.id::text, 1, 8), '-', '');
  end if;

  insert into public.profiles (user_id, username, is_guest)
  values (new.id, requested_username, coalesce(new.is_anonymous, false))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_voidline_auth_user_created on auth.users;
create trigger on_voidline_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_voidline_auth_user();

-- Store only a pilot's best run. The browser cannot modify leaderboard rows directly.
create or replace function public.submit_voidline_score(
  p_score integer,
  p_level integer,
  p_stage integer,
  p_kills integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  pilot_id uuid := auth.uid();
begin
  if pilot_id is null then raise exception 'Authentication required'; end if;
  if p_score < 0 or p_score > 50000000 then raise exception 'Invalid score'; end if;
  if p_level < 1 or p_level > 20 then raise exception 'Invalid level'; end if;
  if p_stage < 0 or p_stage > 100 then raise exception 'Invalid stage'; end if;
  if p_kills < 0 or p_kills > 100000 then raise exception 'Invalid kill count'; end if;

  insert into public.leaderboard_scores
    (user_id, game_id, best_score, level_reached, stage_reached, kills, achieved_at)
  values
    (pilot_id, 'voidline-invasion', p_score, p_level, p_stage, p_kills, now())
  on conflict (user_id, game_id) do update
    set best_score = excluded.best_score,
        level_reached = excluded.level_reached,
        stage_reached = excluded.stage_reached,
        kills = excluded.kills,
        achieved_at = excluded.achieved_at
    where excluded.best_score > public.leaderboard_scores.best_score;
end;
$$;

create or replace function public.get_voidline_leaderboard(p_limit integer default 12)
returns table (
  rank bigint,
  username text,
  is_guest boolean,
  score integer,
  level_reached integer,
  stage_reached integer,
  kills integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    row_number() over (order by scores.best_score desc, scores.achieved_at asc) as rank,
    profiles.username,
    profiles.is_guest,
    scores.best_score as score,
    scores.level_reached,
    scores.stage_reached,
    scores.kills
  from public.leaderboard_scores as scores
  join public.profiles as profiles on profiles.user_id = scores.user_id
  where scores.game_id = 'voidline-invasion'
  order by scores.best_score desc, scores.achieved_at asc
  limit greatest(1, least(coalesce(p_limit, 12), 50));
$$;

-- A short-lived handoff lets an anonymous guest create a password account while
-- retaining cloud saves, leaderboard ownership, and the same public username.
create or replace function public.prepare_voidline_account_upgrade(p_token uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  pilot_id uuid := auth.uid();
  anonymous boolean := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
begin
  if pilot_id is null or not anonymous then raise exception 'Anonymous pilot required'; end if;
  delete from public.account_upgrades where expires_at < now();
  insert into public.account_upgrades (token, from_user, expires_at)
  values (p_token, pilot_id, now() + interval '10 minutes')
  on conflict (from_user) do update
    set token = excluded.token, expires_at = excluded.expires_at;
end;
$$;

create or replace function public.claim_voidline_account_upgrade(p_token uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_user uuid := auth.uid();
  old_user uuid;
  old_username text;
  anonymous boolean := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
begin
  if new_user is null or anonymous then raise exception 'Permanent account required'; end if;

  select upgrades.from_user into old_user
  from public.account_upgrades as upgrades
  where upgrades.token = p_token and upgrades.expires_at >= now()
  for update;
  if old_user is null then raise exception 'Upgrade token is invalid or expired'; end if;

  select profiles.username into old_username
  from public.profiles as profiles
  where profiles.user_id = old_user;
  if old_username is null then raise exception 'Guest profile was not found'; end if;

  insert into public.game_saves (user_id, game_id, campaign, high_score, updated_at)
  select new_user, saves.game_id, saves.campaign, saves.high_score, now()
  from public.game_saves as saves where saves.user_id = old_user
  on conflict (user_id, game_id) do update
    set campaign = excluded.campaign,
        high_score = greatest(public.game_saves.high_score, excluded.high_score),
        updated_at = now();

  insert into public.leaderboard_scores
    (user_id, game_id, best_score, level_reached, stage_reached, kills, achieved_at)
  select new_user, scores.game_id, scores.best_score, scores.level_reached,
         scores.stage_reached, scores.kills, scores.achieved_at
  from public.leaderboard_scores as scores where scores.user_id = old_user
  on conflict (user_id, game_id) do update
    set best_score = greatest(public.leaderboard_scores.best_score, excluded.best_score),
        level_reached = case when excluded.best_score > public.leaderboard_scores.best_score then excluded.level_reached else public.leaderboard_scores.level_reached end,
        stage_reached = case when excluded.best_score > public.leaderboard_scores.best_score then excluded.stage_reached else public.leaderboard_scores.stage_reached end,
        kills = case when excluded.best_score > public.leaderboard_scores.best_score then excluded.kills else public.leaderboard_scores.kills end,
        achieved_at = least(public.leaderboard_scores.achieved_at, excluded.achieved_at);

  delete from public.leaderboard_scores where user_id = old_user;
  delete from public.game_saves where user_id = old_user;
  delete from public.profiles where user_id = old_user;
  update public.profiles set username = old_username, is_guest = false where user_id = new_user;
  delete from public.account_upgrades where token = p_token;
end;
$$;

revoke all on public.profiles from anon, authenticated;
revoke all on public.game_saves from anon, authenticated;
revoke all on public.leaderboard_scores from anon, authenticated;
revoke all on public.account_upgrades from anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert, update on public.game_saves to authenticated;

revoke all on function public.submit_voidline_score(integer, integer, integer, integer) from public;
revoke all on function public.get_voidline_leaderboard(integer) from public;
revoke all on function public.prepare_voidline_account_upgrade(uuid) from public;
revoke all on function public.claim_voidline_account_upgrade(uuid) from public;

grant execute on function public.submit_voidline_score(integer, integer, integer, integer) to authenticated;
grant execute on function public.get_voidline_leaderboard(integer) to anon, authenticated;
grant execute on function public.prepare_voidline_account_upgrade(uuid) to authenticated;
grant execute on function public.claim_voidline_account_upgrade(uuid) to authenticated;

