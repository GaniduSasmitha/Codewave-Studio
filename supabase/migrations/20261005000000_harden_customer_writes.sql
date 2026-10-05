-- Keep all customer-facing flows while ensuring protected order fields can only
-- be written by trusted database code or an administrator.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer');
  return new;
end;
$$;

drop policy if exists "Customers can insert own orders, admins read/insert all" on public.orders;
drop policy if exists "Customers can update own orders" on public.orders;
create policy "Admins can insert orders"
on public.orders for insert
with check (public.is_admin(auth.uid()));

create or replace function public.create_customer_order(package_id text, requirements_payload text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requesting_user uuid := auth.uid();
  order_price numeric;
  new_order_id uuid;
begin
  if requesting_user is null then raise exception 'Authentication required'; end if;
  if requirements_payload is null or length(requirements_payload) > 2500 then
    raise exception 'Invalid order requirements';
  end if;

  order_price := case package_id
    when 'starter' then 30000
    when 'business' then 70000
    when 'maintenance' then 15000
    else null
  end;
  if order_price is null then raise exception 'Invalid package'; end if;

  insert into public.orders (customer_id, package, price, requirements, status)
  values (requesting_user, package_id, order_price, requirements_payload, 'pending_payment')
  returning id into new_order_id;
  return new_order_id;
end;
$$;

create or replace function public.submit_payment_slip(order_id uuid, slip_path text)
returns void
language plpgsql
security definer
set search_path = public, auth, storage
as $$
declare
  requesting_user uuid := auth.uid();
begin
  if requesting_user is null then raise exception 'Authentication required'; end if;
  if slip_path is null or slip_path !~ ('^' || requesting_user::text || '/') then
    raise exception 'Invalid payment slip path';
  end if;
  if not exists (
    select 1 from storage.objects
    where bucket_id = 'payment-slips' and name = slip_path
  ) then raise exception 'Payment slip not found'; end if;

  update public.orders
  set slip_url = slip_path, status = 'pending_verification'
  where id = order_id
    and customer_id = requesting_user
    and status in ('pending_payment', 'rejected');
  if not found then raise exception 'Order is not eligible for payment submission'; end if;
end;
$$;

create or replace function public.hide_own_order(order_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update public.orders
  set deleted_by_user = true
  where id = order_id
    and customer_id = auth.uid()
    and status in ('completed', 'cancelled', 'rejected');
  if not found then raise exception 'Order cannot be hidden'; end if;
end;
$$;

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create or replace function public.submit_contact_message(message_name text, message_email text, message_body text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(message_email));
begin
  if length(trim(message_name)) not between 1 and 100
     or length(normalized_email) not between 3 and 255
     or length(trim(message_body)) not between 1 and 2000
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid contact message';
  end if;
  if exists (
    select 1 from public.contact_messages
    where email = normalized_email and created_at > now() - interval '30 seconds'
  ) then raise exception 'Please wait before sending another message'; end if;
  insert into public.contact_messages (name, email, message)
  values (trim(message_name), normalized_email, trim(message_body));
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
