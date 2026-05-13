create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day_key text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, day_key)
);

alter table public.daily_entries enable row level security;

create policy "users own their entries"
  on public.daily_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
