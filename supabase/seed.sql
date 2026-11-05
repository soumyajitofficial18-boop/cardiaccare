-- Demo directory data for Supabase SQL Editor.
-- Safe to run repeatedly. Demo doctor rows have no Auth profile, so the app
-- displays them as "Healthcare professional" until linked to a real account.
do $$
declare
  v_seed record;
  v_hospital_id uuid;
begin
  for v_seed in
    select *
    from (
      values
        (
          'Greenview Multispecialty Hospital',
          '18 Lake Road',
          'Kolkata',
          '+91 33 4000 1200',
          'Cardiology',
          'Sample listing for CareConnect demo. Cardiology consultations with online and in-person visit options.',
          800::numeric,
          1200::numeric
        ),
        (
          'Greenview Multispecialty Hospital',
          '18 Lake Road',
          'Kolkata',
          '+91 33 4000 1200',
          'Dermatology',
          'Sample listing for CareConnect demo. Dermatology consultations for common skin and hair concerns.',
          650::numeric,
          950::numeric
        ),
        (
          'Riverside Community Hospital',
          '42 Park Avenue',
          'Howrah',
          '+91 33 4100 2300',
          'Pediatrics',
          'Sample listing for CareConnect demo. Pediatric consultations with online and in-person visit options.',
          700::numeric,
          1000::numeric
        )
    ) as seed(
      hospital_name,
      hospital_address,
      hospital_city,
      hospital_phone,
      specialization,
      doctor_bio,
      fee_online,
      fee_offline
    )
  loop
    select id
      into v_hospital_id
    from public.hospitals
    where name = v_seed.hospital_name
      and city = v_seed.hospital_city
    order by id
    limit 1;

    if v_hospital_id is null then
      insert into public.hospitals (name, address, city, phone)
      values (
        v_seed.hospital_name,
        v_seed.hospital_address,
        v_seed.hospital_city,
        v_seed.hospital_phone
      )
      returning id into v_hospital_id;
    end if;

    if not exists (
      select 1
      from public.doctors
      where hospital_id = v_hospital_id
        and profile_id is null
        and specialization = v_seed.specialization
        and bio like 'Sample listing for CareConnect demo.%'
    ) then
      insert into public.doctors (
        hospital_id,
        specialization,
        bio,
        fee_online,
        fee_offline,
        is_approved
      )
      values (
        v_hospital_id,
        v_seed.specialization,
        v_seed.doctor_bio,
        v_seed.fee_online,
        v_seed.fee_offline,
        true
      );
    end if;
  end loop;
end;
$$;

-- Add one week of future sample availability. Two in-person and two online
-- appointments are offered per day for each demo provider.
insert into public.slots (doctor_id, start_at, end_at, mode, is_booked)
select
  d.id,
  slot_time.start_at,
  slot_time.start_at + interval '30 minutes',
  slot_time.mode::public.visit_mode,
  false
from public.doctors d
cross join generate_series(1, 7) as days(day_offset)
cross join (
  values
    (time '10:00', 'offline'),
    (time '11:00', 'offline'),
    (time '15:00', 'online'),
    (time '16:00', 'online')
) as appointment_time(start_time, mode)
cross join lateral (
  select
    (
      ((now() at time zone 'Asia/Kolkata')::date
        + day_offset
        + appointment_time.start_time)
      at time zone 'Asia/Kolkata'
    ) as start_at,
    appointment_time.mode
) as slot_time
where d.profile_id is null
  and d.is_approved is true
  and d.bio like 'Sample listing for CareConnect demo.%'
on conflict (doctor_id, start_at, mode) do nothing;
