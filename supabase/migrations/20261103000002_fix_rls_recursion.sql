-- Fix RLS Infinite Recursion on admin_users

-- 1. Create security definer function to check admin status
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select true from public.admin_users where user_id = auth.uid() limit 1),
    false
  );
$$;

-- 2. Drop recursive policies
drop policy if exists "Admins can view admin_users" on public.admin_users;
drop policy if exists "Admins have full access to infak" on public.infak_distributions;
drop policy if exists "Admins have full access to geber" on public.geber_masjid_distributions;
drop policy if exists "Admins have full access to reports" on public.reports;
drop policy if exists "Admins have full access to gallery" on public.gallery_items;
drop policy if exists "Admins have full access to campaigns" on public.themed_campaigns;
drop policy if exists "Admins have full access to settings" on public.site_settings;

-- 3. Re-create non-recursive policies
create policy "Admins can view admin_users" on public.admin_users
  for select using (auth.uid() = user_id);

create policy "Admins have full access to infak" on public.infak_distributions
  for all using (public.is_admin());

create policy "Admins have full access to geber" on public.geber_masjid_distributions
  for all using (public.is_admin());

create policy "Admins have full access to reports" on public.reports
  for all using (public.is_admin());

create policy "Admins have full access to gallery" on public.gallery_items
  for all using (public.is_admin());

create policy "Admins have full access to campaigns" on public.themed_campaigns
  for all using (public.is_admin());

create policy "Admins have full access to settings" on public.site_settings
  for all using (public.is_admin());

