-- ==========================================================
-- Complete Codewave Studio Supabase Schema & Realtime Setup
-- Copy and paste ALL lines directly into Supabase SQL Editor
-- ==========================================================

-- 1. Profiles Table Setup
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'customer',
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text default 'customer';
alter table public.profiles add column if not exists avatar_path text;

alter table public.profiles drop constraint if exists check_role;
alter table public.profiles add constraint check_role 
  check (role in ('customer', 'admin'));

-- 2. Orders Table Setup
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.profiles(id) on delete cascade,
  package text not null,
  price numeric not null,
  requirements text,
  status text default 'pending_payment',
  slip_url text,
  created_at timestamptz default now(),
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  is_read boolean not null default false,
  read_at timestamptz,
  deleted_by_admin boolean default false,
  deleted_by_user boolean default false
);

alter table public.orders add column if not exists deleted_by_admin boolean default false;
alter table public.orders add column if not exists deleted_by_user boolean default false;
alter table public.orders add column if not exists is_read boolean not null default false;
alter table public.orders add column if not exists read_at timestamptz;

-- Convert any existing NULL flags to false
update public.orders set deleted_by_admin = false where deleted_by_admin is null;
update public.orders set deleted_by_user = false where deleted_by_user is null;

alter table public.orders drop constraint if exists check_status;
alter table public.orders add constraint check_status 
  check (status in ('pending_payment', 'pending_verification', 'verified', 'in_progress', 'completed', 'cancelled', 'rejected'));

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- 4. Admin Security Definer Function
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
declare
  is_admin_user boolean;
begin
  select (role = 'admin') into is_admin_user
  from public.profiles
  where id = user_id;
  return coalesce(is_admin_user, false);
end;
$$ language plpgsql security definer set search_path = public;

-- 5. Profiles RLS Policies
drop policy if exists "Users can read own profile, admins read all" on public.profiles;
create policy "Users can read own profile, admins read all"
on public.profiles for select using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Users can update own profile" on public.profiles;
-- Profile updates are intentionally not exposed to customers. This prevents a
-- customer from changing the protected role column through the public API.

-- 6. Orders RLS Policies (Full Access for database operations)
drop policy if exists "Customers can insert own orders, admins read/insert all" on public.orders;
drop policy if exists "Customers can read own orders, admins read all" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Customers can update own orders" on public.orders;
drop policy if exists "Customers can delete own orders, admins delete all" on public.orders;
drop policy if exists "Allow full access on orders" on public.orders;

create policy "Customers can insert own orders, admins read/insert all"
on public.orders for insert
with check (customer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Customers can read own orders, admins read all"
on public.orders for select
using (customer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Customers can update own orders"
on public.orders for update
using (customer_id = auth.uid())
with check (customer_id = auth.uid());

create policy "Admins can update orders"
on public.orders for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Customers can delete own orders, admins delete all"
on public.orders for delete
using (customer_id = auth.uid() or public.is_admin(auth.uid()));

-- 7. User Registration Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Storage Bucket Setup (payment-slips)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-slips',
  'payment-slips',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 9. Storage RLS Policies for payment-slips bucket
drop policy if exists "Customers and admins can read slips" on storage.objects;
create policy "Customers and admins can read slips"
on storage.objects for select using (
  bucket_id = 'payment-slips'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))
);

drop policy if exists "Customers can upload own slips" on storage.objects;
create policy "Customers can upload own slips"
on storage.objects for insert with check (
  bucket_id = 'payment-slips'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Customers can update own slips" on storage.objects;
create policy "Customers can update own slips"
on storage.objects for update using (
  bucket_id = 'payment-slips'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))
);

drop policy if exists "Customers and admins can delete slips" on storage.objects;
create policy "Customers and admins can delete slips"
on storage.objects for delete using (
  bucket_id = 'payment-slips'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))
);

-- 9a. Authenticated self-service account deletion.
-- Removes uploaded slips first, then the auth user. Foreign-key cascades remove
-- the matching profile and orders in the same transaction.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth, storage
as $$
declare
  requesting_user uuid := auth.uid();
begin
  if requesting_user is null then
    raise exception 'Authentication required';
  end if;

  delete from storage.objects
  where bucket_id = 'payment-slips'
    and (storage.foldername(name))[1] = requesting_user::text;

  delete from storage.objects
  where bucket_id = 'avatars'
    and (storage.foldername(name))[1] = requesting_user::text;

  delete from auth.users where id = requesting_user;
  if not found then
    raise exception 'Account not found';
  end if;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;

-- 9b. Private profile-avatar storage. OAuth photos are imported by the
-- sync-oauth-avatar Edge Function using the service role; browsers only read
-- their own stored copy through a short-lived signed URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Users can read own avatar, admins read all" on storage.objects;
create policy "Users can read own avatar, admins read all"
on storage.objects for select using (
  bucket_id = 'avatars'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))
);

-- 10. Contact Messages Table Setup
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'unread',
  created_at timestamptz default now(),
  constraint check_message_status check (status in ('unread', 'read'))
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
drop policy if exists "Admins can read contact messages" on public.contact_messages;
drop policy if exists "Admins can update contact messages" on public.contact_messages;
drop policy if exists "Admins can delete contact messages" on public.contact_messages;
drop policy if exists "Allow full access on contact_messages" on public.contact_messages;

create policy "Anyone can insert contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.is_admin(auth.uid()));

-- 11. Enable Full Replica Identity & Realtime Publication for Live Sync
alter table public.orders replica identity full;
alter table public.contact_messages replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'contact_messages'
  ) then
    alter publication supabase_realtime add table public.contact_messages;
  end if;
exception
  when undefined_object then
    null;
end $$;

-- 12. Flush and reload schema cache
NOTIFY pgrst, 'reload schema';

-- 13. Harden customer writes. Apply the matching migration to existing projects.
-- Never trust auth user metadata for roles: clients can set it through the Auth API.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer');
  return new;
end;
$$;

drop policy if exists "Customers can insert own orders, admins read/insert all" on public.orders;
drop policy if exists "Customers can update own orders" on public.orders;
create policy "Admins can insert orders" on public.orders for insert
with check (public.is_admin(auth.uid()));

create or replace function public.create_customer_order(package_id text, requirements_payload text)
returns uuid language plpgsql security definer set search_path = public, auth as $$
declare requesting_user uuid := auth.uid(); order_price numeric; new_order_id uuid;
begin
  if requesting_user is null then raise exception 'Authentication required'; end if;
  if requirements_payload is null or length(requirements_payload) > 2500 then raise exception 'Invalid order requirements'; end if;
  order_price := case package_id when 'starter' then 79 when 'business' then 199 when 'maintenance' then 15 else null end;
  if order_price is null then raise exception 'Invalid package'; end if;
  insert into public.orders (customer_id, package, price, requirements, status)
  values (requesting_user, package_id, order_price, requirements_payload, 'pending_payment') returning id into new_order_id;
  return new_order_id;
end;
$$;

create or replace function public.submit_payment_slip(order_id uuid, slip_path text)
returns void language plpgsql security definer set search_path = public, auth, storage as $$
declare requesting_user uuid := auth.uid();
begin
  if requesting_user is null then raise exception 'Authentication required'; end if;
  if slip_path is null or slip_path !~ ('^' || requesting_user::text || '/') then raise exception 'Invalid payment slip path'; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'payment-slips' and name = slip_path) then raise exception 'Payment slip not found'; end if;
  update public.orders set slip_url = slip_path, status = 'pending_verification'
  where id = order_id and customer_id = requesting_user and status in ('pending_payment', 'rejected');
  if not found then raise exception 'Order is not eligible for payment submission'; end if;
end;
$$;

create or replace function public.hide_own_order(order_id uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  update public.orders set deleted_by_user = true
  where id = order_id and customer_id = auth.uid() and status in ('completed', 'cancelled', 'rejected');
  if not found then raise exception 'Order cannot be hidden'; end if;
end;
$$;

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create or replace function public.submit_contact_message(message_name text, message_email text, message_body text)
returns void language plpgsql security definer set search_path = public as $$
declare normalized_email text := lower(trim(message_email));
begin
  if length(trim(message_name)) not between 1 and 100 or length(normalized_email) not between 3 and 255
     or length(trim(message_body)) not between 1 and 2000 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid contact message'; end if;
  if exists (select 1 from public.contact_messages where email = normalized_email and created_at > now() - interval '30 seconds') then raise exception 'Please wait before sending another message'; end if;
  insert into public.contact_messages (name, email, message) values (trim(message_name), normalized_email, trim(message_body));
end;
$$;

revoke all on function public.create_customer_order(text, text) from public;
revoke all on function public.submit_payment_slip(uuid, text) from public;
revoke all on function public.hide_own_order(uuid) from public;
revoke all on function public.submit_contact_message(text, text, text) from public;
grant execute on function public.create_customer_order(text, text) to authenticated;
grant execute on function public.submit_payment_slip(uuid, text) to authenticated;
grant execute on function public.hide_own_order(uuid) to authenticated;
grant execute on function public.submit_contact_message(text, text, text) to anon, authenticated;
NOTIFY pgrst, 'reload schema';
