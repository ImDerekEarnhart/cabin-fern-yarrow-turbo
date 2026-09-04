create table if not exists repositories (
  id text primary key,
  user_id text not null,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists repositories_user_id_idx on repositories (user_id);

create table if not exists release_candidates (
  id text primary key,
  user_id text not null,
  repository_id text not null,
  version text not null,
  artifact_hash text not null,
  manifest_json text not null,
  status text not null default 'frozen',
  risk text not null,
  created_at timestamptz not null default now()
);
create index if not exists release_candidates_user_id_idx on release_candidates (user_id);
create index if not exists release_candidates_repo_idx on release_candidates (repository_id);

create table if not exists gate_plans (
  id text primary key,
  user_id text not null,
  candidate_id text not null unique,
  policy_hash text not null,
  compiled_policy_json text not null
);
create index if not exists gate_plans_user_id_idx on gate_plans (user_id);

create table if not exists evidence_receipts (
  id text primary key,
  user_id text not null,
  candidate_id text not null,
  requirement_id text not null,
  evidence_kind text not null,
  outcome text not null,
  independence text not null,
  source text not null,
  payload_json text not null,
  payload_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists evidence_receipts_candidate_idx on evidence_receipts (candidate_id);

create table if not exists release_receipts (
  id text primary key,
  user_id text not null,
  candidate_id text not null,
  repository_id text not null,
  version text not null,
  artifact_hash text not null,
  verdict text not null,
  receipt_json text not null,
  receipt_hash text not null,
  signer_id text not null,
  signature_b64 text not null,
  public_key_fingerprint text not null,
  created_at timestamptz not null default now()
);
create index if not exists release_receipts_user_id_idx on release_receipts (user_id);

create table if not exists discovery_commits (
  id text primary key,
  user_id text not null,
  repository_id text not null,
  parent_id text,
  branch text not null,
  title text not null,
  claim text not null,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);
create index if not exists discovery_commits_user_id_idx on discovery_commits (user_id);

create table if not exists release_keys (
  user_id text primary key,
  public_pem text not null,
  private_pem text not null,
  fingerprint text not null
);
