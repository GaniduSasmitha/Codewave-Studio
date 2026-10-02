-- Track whether an admin has opened each project order.
alter table public.orders
  add column if not exists is_read boolean not null default false,
  add column if not exists read_at timestamptz;

-- Ensure order changes, including read-state changes, are delivered by Realtime.
alter table public.orders replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
