-- FLASH CONNECT MVP — Supabase PostgreSQL Schema
-- Université de Parakou — Faculté des Lettres, Arts et Sciences Humaines (FLASH)
--
-- ORDRE DES DÉPENDANCES :
-- 1. Extension & Types ENUM
-- 2. Tables de base
-- 3. Index de performance
-- 4. Fonctions et Triggers système (timestamps, création automatique de profil)
-- 5. Fonctions d'habilitation et sécurité (SECURITY DEFINER)
-- 6. Activation de RLS et Politiques de sécurité
-- 7. Configuration du bucket de stockage privé et politiques de stockage
-- 8. Données de démonstration

--------------------------------------------------------------------------------
-- 1. EXTENSIONS & TYPES PERSONNALISÉS
--------------------------------------------------------------------------------
create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'account_status') then
    create type public.account_status as enum ('pending', 'active', 'rejected', 'suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'academic_staff', 'approver', 'admin', 'auditor');
  end if;
  if not exists (select 1 from pg_type where typname = 'document_status') then
    create type public.document_status as enum ('draft', 'issued', 'revoked');
  end if;
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type public.request_status as enum ('submitted', 'processing', 'needs_info', 'approved', 'rejected', 'cancelled');
  end if;
end $$;

--------------------------------------------------------------------------------
-- 2. TABLES APPLICATIVES
--------------------------------------------------------------------------------

-- Table des profils utilisateurs (liée à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  matricule text unique,
  department text,
  study_level text,
  role public.user_role not null default 'student',
  account_status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table des cours
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  department text not null default 'FLASH',
  study_level text not null default 'À préciser',
  teacher_name text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Table des emplois du temps
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  room text,
  academic_year text,
  created_at timestamptz not null default now(),
  constraint schedule_time_check check (end_time > start_time)
);

-- Table des annonces
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Table des demandes de documents administratifs/académiques
create table if not exists public.document_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  document_type text not null,
  notes text,
  status public.request_status not null default 'submitted',
  staff_note text,
  processed_by uuid references public.profiles(id),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table des documents académiques délivrés
create table if not exists public.academic_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  document_type text not null,
  title text not null,
  academic_year text,
  status public.document_status not null default 'draft',
  storage_path text not null unique,
  sha256 text,
  issued_by uuid references public.profiles(id),
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoke_reason text
);

-- Table des journaux d'audit
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

--------------------------------------------------------------------------------
-- 3. INDEX
--------------------------------------------------------------------------------
create index if not exists profiles_status_idx on public.profiles(account_status);
create index if not exists requests_student_idx on public.document_requests(student_id, created_at desc);
create index if not exists documents_student_idx on public.academic_documents(student_id, created_at desc);
create index if not exists announcements_published_idx on public.announcements(published, published_at desc);
create index if not exists schedules_course_idx on public.schedules(course_id, weekday, start_time);

--------------------------------------------------------------------------------
-- 4. FONCTIONS ET TRIGGERS SYSTÈME
--------------------------------------------------------------------------------

-- Function de mise à jour du champ updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists requests_updated_at on public.document_requests;
create trigger requests_updated_at
  before update on public.document_requests
  for each row execute function public.set_updated_at();

-- Trigger automatique de création de profil à l'inscription d'un utilisateur auth.users
-- Le profil est systématiquement créé avec le rôle 'student' et le statut 'pending'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, matricule, department, study_level, role, account_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(trim(new.raw_user_meta_data ->> 'matricule'), ''),
    nullif(new.raw_user_meta_data ->> 'department', ''),
    nullif(new.raw_user_meta_data ->> 'study_level', ''),
    'student',
    'pending'
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--------------------------------------------------------------------------------
-- 5. FONCTIONS D'HABILITATION ET DE SÉCURITÉ
--------------------------------------------------------------------------------

create or replace function public.has_staff_role()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.account_status = 'active'
      and p.role in ('academic_staff', 'approver', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.account_status = 'active'
      and p.role = 'admin'
  );
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.account_status = 'active'
  );
$$;

create or replace function public.can_issue_documents()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.account_status = 'active'
      and p.role in ('approver', 'admin')
  );
$$;

-- Restrictons les privilèges par défaut
revoke all on function public.has_staff_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_active_user() from public;
revoke all on function public.can_issue_documents() from public;

grant execute on function public.has_staff_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_active_user() to authenticated;
grant execute on function public.can_issue_documents() to authenticated;

-- Fonction sécurisée pour la révision des profils étudiants par le personnel autorisé
create or replace function public.review_profile(target_id uuid, new_status public.account_status)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor_role public.user_role;
begin
  select p.role into actor_role
  from public.profiles p
  where p.id = auth.uid() and p.account_status = 'active';

  if actor_role is null or actor_role not in ('admin', 'academic_staff') then
    raise exception 'Not authorized';
  end if;

  if new_status not in ('active', 'rejected', 'suspended') then
    raise exception 'Invalid status';
  end if;

  update public.profiles
  set account_status = new_status
  where id = target_id and role = 'student';

  if not found then
    raise exception 'Student profile not found';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (
    auth.uid(),
    'review_profile',
    'profile',
    target_id::text,
    jsonb_build_object('new_status', new_status)
  );
end; $$;

revoke all on function public.review_profile(uuid, public.account_status) from public;
grant execute on function public.review_profile(uuid, public.account_status) to authenticated;

--------------------------------------------------------------------------------
-- 6. ACTIVATION DE ROW LEVEL SECURITY (RLS) & POLITIQUES DE SÉCURITÉ
--------------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.schedules enable row level security;
alter table public.announcements enable row level security;
alter table public.document_requests enable row level security;
alter table public.academic_documents enable row level security;
alter table public.audit_logs enable row level security;

-- Nettoyage des anciennes politiques si existantes pour réexécutions sans erreur
drop policy if exists "profile read self or staff" on public.profiles;
drop policy if exists "profile update own basic fields only not allowed" on public.profiles;

drop policy if exists "active users read active courses" on public.courses;
drop policy if exists "staff manage courses" on public.courses;

drop policy if exists "active users read schedules" on public.schedules;
drop policy if exists "staff manage schedules" on public.schedules;

drop policy if exists "active users read published announcements" on public.announcements;
drop policy if exists "staff manage announcements" on public.announcements;

drop policy if exists "student read own requests staff read all" on public.document_requests;
drop policy if exists "student submit own request" on public.document_requests;
drop policy if exists "staff update requests" on public.document_requests;

drop policy if exists "student read own issued docs staff read docs" on public.academic_documents;
drop policy if exists "authorized approver inserts docs" on public.academic_documents;
drop policy if exists "authorized approver updates docs" on public.academic_documents;

drop policy if exists "staff read audit logs" on public.audit_logs;
drop policy if exists "authenticated audit insert" on public.audit_logs;

-- Definir les politiques RLS
create policy "profile read self or staff" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_staff_role() or public.is_admin());

create policy "profile update own basic fields only not allowed" on public.profiles
  for update to authenticated
  using (false)
  with check (false);

create policy "active users read active courses" on public.courses
  for select to authenticated
  using ((public.is_active_user() and is_active = true) or public.has_staff_role());

create policy "staff manage courses" on public.courses
  for all to authenticated
  using (public.has_staff_role())
  with check (public.has_staff_role());

create policy "active users read schedules" on public.schedules
  for select to authenticated
  using (public.is_active_user());

create policy "staff manage schedules" on public.schedules
  for all to authenticated
  using (public.has_staff_role())
  with check (public.has_staff_role());

create policy "active users read published announcements" on public.announcements
  for select to authenticated
  using ((public.is_active_user() and published = true) or public.has_staff_role());

create policy "staff manage announcements" on public.announcements
  for all to authenticated
  using (public.has_staff_role())
  with check (public.has_staff_role());

create policy "student read own requests staff read all" on public.document_requests
  for select to authenticated
  using (student_id = auth.uid() or public.has_staff_role());

create policy "student submit own request" on public.document_requests
  for insert to authenticated
  with check (student_id = auth.uid() and status = 'submitted' and public.is_active_user());

create policy "staff update requests" on public.document_requests
  for update to authenticated
  using (public.has_staff_role())
  with check (public.has_staff_role());

create policy "student read own issued docs staff read docs" on public.academic_documents
  for select to authenticated
  using ((student_id = auth.uid() and status = 'issued' and public.is_active_user()) or public.has_staff_role());

create policy "authorized approver inserts docs" on public.academic_documents
  for insert to authenticated
  with check (public.can_issue_documents() and issued_by = auth.uid());

create policy "authorized approver updates docs" on public.academic_documents
  for update to authenticated
  using (public.can_issue_documents())
  with check (public.can_issue_documents());

create policy "staff read audit logs" on public.audit_logs
  for select to authenticated
  using (public.is_admin());

create policy "authenticated audit insert" on public.audit_logs
  for insert to authenticated
  with check (actor_id = auth.uid() and public.has_staff_role());

--------------------------------------------------------------------------------
-- 7. BUCKET DE STOCKAGE PRIVÉ ET POLITIQUES
--------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('academic-documents', 'academic-documents', false, 8388608, array['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = 8388608,
    allowed_mime_types = array['application/pdf'];

drop policy if exists "students read own private academic files" on storage.objects;
drop policy if exists "staff upload private academic files" on storage.objects;
drop policy if exists "staff delete private academic files" on storage.objects;

create policy "students read own private academic files" on storage.objects
  for select to authenticated
  using (
    (bucket_id = 'academic-documents' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active_user())
    or (bucket_id = 'academic-documents' and public.has_staff_role())
  );

create policy "staff upload private academic files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'academic-documents'
    and public.can_issue_documents()
    and (storage.foldername(name))[1] is not null
  );

create policy "staff delete private academic files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'academic-documents'
    and public.can_issue_documents()
  );

--------------------------------------------------------------------------------
-- 8. DONNÉES DE DÉMONSTRATION (FICTIVES)
--------------------------------------------------------------------------------

insert into public.courses (title, description, department, study_level, teacher_name, is_active)
values
  ('Pratique de la langue allemande', 'Cours fictif pour démonstration de l’interface.', 'Études germaniques', 'Licence 3', 'Enseignant fictif', true),
  ('Littérature et civilisation', 'Cours fictif pour démonstration de l’interface.', 'Études germaniques', 'Licence 3', 'Enseignant fictif', true),
  ('Introduction aux sciences du langage', 'Cours fictif pour démonstration de l’interface.', 'Sciences du langage', 'Licence 1', 'Enseignant fictif', true);

insert into public.announcements (title, body, published, published_at)
values
  ('Bienvenue sur FLASH CONNECT', 'Ceci est une annonce fictive. Ce prototype n’est pas encore approuvé officiellement par l’Université de Parakou.', true, now()),
  ('Actes académiques : fonctionnement prévu', 'Les actes officiels ne seront accessibles qu’après contrôle et validation par un responsable habilité.', true, now());
