-- Remove the retired guest-to-password-account upgrade flow.
drop function if exists public.prepare_voidline_account_upgrade(uuid);
drop function if exists public.claim_voidline_account_upgrade(uuid);
drop table if exists public.account_upgrades;

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

revoke all on function public.set_voidline_guest_username(text) from public;
grant execute on function public.set_voidline_guest_username(text) to authenticated;
