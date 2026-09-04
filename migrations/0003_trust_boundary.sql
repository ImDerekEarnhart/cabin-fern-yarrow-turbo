create table if not exists workspaces (
  id text primary key,
  name text not null,
  created_by text not null,
  legal_entity text not null default '',
  support_email text not null default '',
  security_email text not null default '',
  privacy_email text not null default '',
  retention_days integer not null default 30,
  legal_reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists workspace_members (
  workspace_id text not null,
  user_id text not null,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index if not exists workspace_members_user_idx on workspace_members (user_id);

create table if not exists workspace_invites (
  token text primary key,
  workspace_id text not null,
  email text not null,
  role text not null,
  created_by text not null,
  expires_at timestamptz not null
);

create table if not exists authority_keys (
  workspace_id text primary key,
  public_pem text not null,
  fingerprint text not null,
  registered_by text not null,
  created_at timestamptz not null default now()
);

alter table release_candidates add column if not exists created_by text;
alter table release_candidates add column if not exists workspace_id text;
alter table repositories add column if not exists workspace_id text;
alter table gate_plans add column if not exists workspace_id text;
alter table evidence_receipts add column if not exists workspace_id text;
alter table release_receipts add column if not exists workspace_id text;
alter table discovery_commits add column if not exists workspace_id text;

update release_keys set private_pem = '' where private_pem is not null and private_pem <> '';
