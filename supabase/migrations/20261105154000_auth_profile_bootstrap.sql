create or replace function public.ensure_my_profile()
returns public.user_role
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_role public.user_role;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (id, full_name)
  select id, raw_user_meta_data ->> 'full_name'
  from auth.users
  where id = v_user_id
  on conflict (id) do nothing;

  select role into v_role
  from public.profiles
  where id = v_user_id;

  if v_role is null then
    raise exception 'Profile could not be initialized';
  end if;

  return v_role;
end;
$$;

revoke all on function public.ensure_my_profile() from public, anon;
grant execute on function public.ensure_my_profile() to authenticated;

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
