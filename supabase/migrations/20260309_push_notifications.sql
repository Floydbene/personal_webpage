-- Push notification device tokens
create table if not exists push_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    device_token text not null,
    platform text not null default 'ios',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint push_tokens_user_device_unique unique (user_id, device_token)
);

create index if not exists push_tokens_user_id_idx on push_tokens(user_id);

-- RLS: users can only manage their own tokens
alter table push_tokens enable row level security;

create policy "Users can view their own tokens"
    on push_tokens for select
    to authenticated
    using (user_id = auth.uid());

create policy "Users can insert their own tokens"
    on push_tokens for insert
    to authenticated
    with check (user_id = auth.uid());

create policy "Users can update their own tokens"
    on push_tokens for update
    to authenticated
    using (user_id = auth.uid());

create policy "Users can delete their own tokens"
    on push_tokens for delete
    to authenticated
    using (user_id = auth.uid());

-- Service role needs to read all tokens for sending notifications
-- (Edge functions use service_role key, which bypasses RLS)

-- Enable pg_net for HTTP calls from database if needed
create extension if not exists pg_net with schema extensions;
