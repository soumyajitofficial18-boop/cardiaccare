create type user_role as enum ('user','doctor','admin');
create type visit_mode as enum ('online','offline');
create type appt_status as enum ('pending','confirmed','completed','cancelled');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, phone text,
  role user_role not null default 'user',
  created_at timestamptz default now()
);

create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = '';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null, address text, city text, phone text
);

create table doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id),
  hospital_id uuid references hospitals(id),
  specialization text, bio text,
  fee_online numeric, fee_offline numeric,
  is_approved boolean default false
);

-- doctor-er weekly schedule
create table doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  day_of_week int check (day_of_week between 0 and 6),
  start_time time, end_time time,
  slot_minutes int default 15,
  mode visit_mode
);

-- actual bookable slots (schedule theke generate hoy)
create table slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  start_at timestamptz not null, end_at timestamptz not null,
  mode visit_mode not null,
  is_booked boolean default false,
  unique (doctor_id, start_at, mode)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references profiles(id),
  doctor_id uuid references doctors(id),
  slot_id uuid unique references slots(id),
  mode visit_mode, status appt_status default 'pending',
  meeting_link text, notes text, prescription_url text,
  created_at timestamptz default now()
);

create table labs (
  id uuid primary key default gen_random_uuid(),
  name text, address text, city text
);
create table lab_tests (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid references labs(id), name text, price numeric
);
create table lab_bookings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references profiles(id),
  lab_test_id uuid references lab_tests(id),
  scheduled_at timestamptz, home_collection boolean default false,
  status appt_status default 'pending', report_url text
);


create function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

alter table appointments enable row level security;

-- patient nijer appointment dekhbe
create policy "patient reads own" on appointments for select
using (patient_id = auth.uid());

-- doctor nijer appointment dekhbe
create policy "doctor reads own" on appointments for select
using (doctor_id in (select id from doctors where profile_id = auth.uid()));

-- admin sob dekhbe
create policy "admin all" on appointments for all using (is_admin());

-- profiles: nijer role change korte parbe na
alter table profiles enable row level security;
create policy "read own" on profiles for select using (id = auth.uid() or is_admin());
create policy "update own (no role)" on profiles for update
using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

create function book_slot(p_slot_id uuid, p_mode visit_mode)
returns uuid as $$
declare v_slot slots; v_appt uuid;
begin
  select * into v_slot from slots where id = p_slot_id for update;
  if v_slot.is_booked then raise exception 'Slot already booked'; end if;

  update slots set is_booked = true where id = p_slot_id;
  insert into appointments (patient_id, doctor_id, slot_id, mode, status)
  values (auth.uid(), v_slot.doctor_id, p_slot_id, p_mode, 'pending')
  returning id into v_appt;
  return v_appt;
end; $$ language plpgsql security definer;