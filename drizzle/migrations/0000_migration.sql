create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.assign_admin_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'admin@truwix.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.assign_admin_role();

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Automation',
  source text not null default 'manual',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "Anyone reads published posts" on public.posts for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins write posts" on public.posts for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tag text not null default 'Automation',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Anyone reads published services" on public.services for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins write services" on public.services for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text, last_name text, email text, phone text, subject text, message text,
  source text not null default 'contact',
  page text, ip text, country text, city text, user_agent text, visitor_id text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "Admins manage leads" on public.leads for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text, ip text, country text, city text, path text, referrer text, user_agent text,
  created_at timestamptz not null default now()
);
create index visits_created_idx on public.visits (created_at desc);
grant select, delete on public.visits to authenticated;
grant all on public.visits to service_role;
alter table public.visits enable row level security;
create policy "Admins read visits" on public.visits for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete visits" on public.visits for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.services (title, description, tag, sort_order) values
('Workflow Automation','Custom automated workflows that replace repetitive manual tasks across sales, finance, HR and operations.','Automation',1),
('Founder & MIS Dashboards','One live view of revenue, cash, production and people, pulled automatically from every system you run.','Intelligence',2),
('Industrial IoT & Monitoring','Connect machines, PLCs and sensors to track OEE, downtime, energy and quality in real time.','IoT',3),
('Dark Factory Solutions','Lights-out production lines with automated scheduling, inspection and alerting.','IoT',4),
('AI & Integrations','AI document reading, assistants and integrations that connect your ERP, CRM, Tally and WhatsApp.','AI',5),
('End-to-end Automation','From discovery to pilot to intelligence layer, we automate entire processes, not just tasks.','Automation',6);