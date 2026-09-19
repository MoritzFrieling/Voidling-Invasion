-- Voidline Invasion cloud saves, pilot profiles, and leaderboard.
-- Safe to run in the Supabase SQL Editor. No secret keys are stored here.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,20}$'),
  is_guest boolean not null default true,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists is_admin boolean not null default false;

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

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.leaderboard_scores enable row level security;

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
  with check (
    (select auth.uid()) = user_id
    and (high_score = 0 or not exists (
      select 1 from public.profiles where user_id = (select auth.uid()) and is_admin
    ))
  );

drop policy if exists "pilots can update their save" on public.game_saves;
create policy "pilots can update their save"
  on public.game_saves for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (high_score = 0 or not exists (
      select 1 from public.profiles where user_id = (select auth.uid()) and is_admin
    ))
  );

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

create or replace function public.set_voidline_guest_username(p_username text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  pilot_id uuid := auth.uid();
  normalized text := lower(trim(coalesce(p_username, '')));
begin
  if pilot_id is null or not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Anonymous pilot required';
  end if;
  if normalized !~ '^[a-z0-9_]{3,20}$' then raise exception 'Invalid callsign'; end if;

  update public.profiles
  set username = normalized
  where user_id = pilot_id and is_guest = true;
  if not found then raise exception 'Guest profile was not found'; end if;
  return normalized;
exception
  when unique_violation then raise exception 'That callsign is already in use';
end;
$$;

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
  if exists (select 1 from public.profiles where user_id = pilot_id and is_admin) then return; end if;
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

revoke all on public.profiles from anon, authenticated;
revoke all on public.game_saves from anon, authenticated;
revoke all on public.leaderboard_scores from anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert, update on public.game_saves to authenticated;

revoke all on function public.submit_voidline_score(integer, integer, integer, integer) from public;
revoke all on function public.get_voidline_leaderboard(integer) from public;
revoke all on function public.set_voidline_guest_username(text) from public;

grant execute on function public.submit_voidline_score(integer, integer, integer, integer) to authenticated;
grant execute on function public.get_voidline_leaderboard(integer) to anon, authenticated;
grant execute on function public.set_voidline_guest_username(text) to authenticated;
