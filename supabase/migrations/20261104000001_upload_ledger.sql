-- Upload Ledger Table to track all storage blobs and eliminate orphans
create table if not exists public.upload_ledger (
  id uuid primary key default uuid_generate_v4(),
  url text unique not null,
  content_hash text not null,
  size_bytes int not null,
  mime_type text not null default 'image/webp',
  status text not null default 'pending' check (status in ('pending', 'committed', 'deleted')),
  created_at timestamptz default now(),
  committed_at timestamptz null
);

-- RLS
alter table public.upload_ledger enable row level security;

create policy "Admins have full access to upload_ledger" on public.upload_ledger
  for all using (public.is_admin());

