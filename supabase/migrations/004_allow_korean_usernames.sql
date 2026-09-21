-- Allow Hangul syllables in player callsigns while retaining the existing
-- 3–20 character limit and ASCII numbers/underscores.
alter table public.profiles
  drop constraint if exists profiles_username_check;

alter table public.profiles
  add constraint profiles_username_check
  check (
    (username ~ '^[a-z0-9_]+$' and length(username) between 3 and 20)
    or (username ~ '^[a-z0-9_가-힣]+$' and username ~ '[가-힣]' and length(username) between 2 and 20)
  );

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
  if not (
    (requested_username ~ '^[a-z0-9_]+$' and length(requested_username) between 3 and 20)
    or (requested_username ~ '^[a-z0-9_가-힣]+$' and requested_username ~ '[가-힣]' and length(requested_username) between 2 and 20)
  ) then
    requested_username := 'pilot_' || replace(substr(new.id::text, 1, 8), '-', '');
  end if;

  insert into public.profiles (user_id, username, is_guest)
  values (new.id, requested_username, coalesce(new.is_anonymous, false))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

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
  if not (
    (normalized ~ '^[a-z0-9_]+$' and length(normalized) between 3 and 20)
    or (normalized ~ '^[a-z0-9_가-힣]+$' and normalized ~ '[가-힣]' and length(normalized) between 2 and 20)
  ) then raise exception 'Invalid callsign'; end if;

  update public.profiles
  set username = normalized
  where user_id = pilot_id and is_guest = true;
  if not found then raise exception 'Guest profile was not found'; end if;
  return normalized;
exception
  when unique_violation then raise exception 'That callsign is already in use';
end;
$$;

revoke all on function public.set_voidline_guest_username(text) from public;
grant execute on function public.set_voidline_guest_username(text) to authenticated;
