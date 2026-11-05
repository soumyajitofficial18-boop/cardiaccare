create or replace view public.doctor_directory as
select
  d.id as doctor_id,
  d.hospital_id,
  p.full_name as doctor_name,
  d.specialization,
  d.bio,
  d.fee_online,
  d.fee_offline,
  h.name as hospital_name,
  h.address as hospital_address,
  h.city as hospital_city,
  h.phone as hospital_phone
from public.doctors d
left join public.profiles p on p.id = d.profile_id
left join public.hospitals h on h.id = d.hospital_id
where d.is_approved is true;

grant select on public.doctor_directory to anon, authenticated;

alter table public.doctors enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.slots enable row level security;
alter table public.labs enable row level security;
alter table public.lab_tests enable row level security;
alter table public.lab_bookings enable row level security;

drop policy if exists "Anyone can read hospitals" on public.hospitals;
create policy "Anyone can read hospitals"
on public.hospitals for select to anon, authenticated
using (true);

drop policy if exists "Patients can read approved doctors" on public.doctors;
create policy "Patients can read approved doctors"
on public.doctors for select to authenticated
using (is_approved is true or profile_id = (select auth.uid()));

drop policy if exists "Patients can read future available slots" on public.slots;
create policy "Patients can read future available slots"
on public.slots for select to authenticated
using (
  (is_booked is false and start_at > now())
  or exists (
    select 1
    from public.appointments a
    where a.slot_id = slots.id
      and a.patient_id = (select auth.uid())
  )
);

drop policy if exists "Anyone can read labs" on public.labs;
create policy "Anyone can read labs"
on public.labs for select to anon, authenticated
using (true);

drop policy if exists "Anyone can read lab tests" on public.lab_tests;
create policy "Anyone can read lab tests"
on public.lab_tests for select to anon, authenticated
using (true);

drop policy if exists "Patients can read their lab bookings" on public.lab_bookings;
create policy "Patients can read their lab bookings"
on public.lab_bookings for select to authenticated
using (patient_id = (select auth.uid()));

create or replace function public.book_slot(p_slot_id uuid, p_mode public.visit_mode)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_slot public.slots%rowtype;
  v_appointment_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = v_user_id and role = 'user'
  ) then
    raise exception 'Only patient accounts can book appointments';
  end if;

  select s.* into v_slot
  from public.slots s
  join public.doctors d on d.id = s.doctor_id and d.is_approved is true
  where s.id = p_slot_id
  for update of s;

  if not found then
    raise exception 'This appointment slot is unavailable';
  end if;
  if v_slot.is_booked is true then
    raise exception 'This appointment slot has already been booked';
  end if;
  if v_slot.start_at <= now() then
    raise exception 'This appointment time has passed';
  end if;
  if p_mode is null or v_slot.mode <> p_mode then
    raise exception 'Appointment mode does not match the selected slot';
  end if;

  update public.slots set is_booked = true where id = p_slot_id;
  insert into public.appointments (patient_id, doctor_id, slot_id, mode, status)
  values (v_user_id, v_slot.doctor_id, p_slot_id, p_mode, 'pending')
  returning id into v_appointment_id;

  return v_appointment_id;
end;
$$;

revoke all on function public.book_slot(uuid, public.visit_mode) from public, anon;
grant execute on function public.book_slot(uuid, public.visit_mode) to authenticated;

create or replace function public.book_lab_test(
  p_lab_test_id uuid,
  p_scheduled_at timestamptz,
  p_home_collection boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = v_user_id and role = 'user'
  ) then
    raise exception 'Only patient accounts can book lab tests';
  end if;

  if p_scheduled_at is null or p_scheduled_at <= now() then
    raise exception 'Choose a future date and time';
  end if;

  if not exists (select 1 from public.lab_tests where id = p_lab_test_id) then
    raise exception 'The selected lab test is unavailable';
  end if;

  insert into public.lab_bookings (
    patient_id,
    lab_test_id,
    scheduled_at,
    home_collection,
    status
  )
  values (
    v_user_id,
    p_lab_test_id,
    p_scheduled_at,
    coalesce(p_home_collection, false),
    'pending'
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

revoke all on function public.book_lab_test(uuid, timestamptz, boolean) from public, anon;
grant execute on function public.book_lab_test(uuid, timestamptz, boolean) to authenticated;
