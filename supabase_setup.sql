-- ==========================================================
-- Supabase Schema Migration Script
-- Copy and paste this script directly into the Supabase SQL Editor
-- ==========================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'customer',
  created_at timestamptz default now(),
  constraint check_role check (role in ('customer', 'admin'))
);

-- 2. Orders Table
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
  constraint check_status check (status in ('pending_payment', 'pending_verification', 'verified', 'in_progress', 'completed', 'cancelled'))
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- 4. Non-Recursive Security Definer Helper for Role Checking
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
$$ language plpgsql security definer;

-- 5. Profiles RLS Policies
create policy "Users can read own profile, admins read all"
on public.profiles
for select
using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "Users can update own profile"
on public.profiles
for update
using (id = auth.uid());

-- 6. Orders RLS Policies
create policy "Customers can insert own orders, admins read/insert all"
on public.orders
for insert
with check (customer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Customers can read own orders, admins read all"
on public.orders
for select
using (customer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Admins can update orders"
on public.orders
for update
using (public.is_admin(auth.uid()));

-- 7. Trigger to Auto-Create Profile on Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Storage Bucket Setup (payment-slips)
insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', false)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

-- 9. Storage RLS Policies
create policy "Customers can upload own slips"
on storage.objects
for insert
with check (
  bucket_id = 'payment-slips'
  and left(name, 37) = (auth.uid()::text || '/')
);

create policy "Customers can read own slips, admins read all"
on storage.objects
for select
using (
  bucket_id = 'payment-slips'
  and (
    left(name, 37) = (auth.uid()::text || '/')
    or public.is_admin(auth.uid())
  )
);
