-- Create admin@pilots.voidline.game in Authentication > Users, then run this migration.
-- The password stays in Supabase Auth and is never stored in this repository.

alter table public.profiles add column if not exists is_admin boolean not null default false;

update public.profiles
set username = 'admin', is_guest = false, is_admin = true
where user_id in (
  select id from auth.users where lower(email) = 'admin@pilots.voidline.game'
);

-- An admin account is a test/operator account, not a leaderboard pilot.
delete from public.leaderboard_scores
where user_id in (select user_id from public.profiles where is_admin);

update public.game_saves
set high_score = 0
where user_id in (select user_id from public.profiles where is_admin);

-- Keep the admin exclusion enforced for projects that already ran migration 001.
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

create or replace function public.prevent_voidline_admin_score()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.profiles where user_id = new.user_id and is_admin) then
    raise exception 'Admin pilots cannot submit leaderboard scores';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_voidline_admin_score on public.leaderboard_scores;
create trigger prevent_voidline_admin_score
  before insert or update on public.leaderboard_scores
  for each row execute procedure public.prevent_voidline_admin_score();
