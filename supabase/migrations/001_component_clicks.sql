-- Counter table: one row per component slug.
create table if not exists component_clicks (
    slug text primary key,
    count integer not null default 0,
    updated_at timestamptz not null default now()
);

alter table component_clicks enable row level security;

-- Anon can read counts.
drop policy if exists "anon_read" on component_clicks;
create policy "anon_read"
    on component_clicks
    for select
    to anon
    using (true);

-- RPC: atomic upsert + increment, returns new count.
create or replace function increment_click(slug_param text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
    new_count integer;
begin
    insert into component_clicks (slug, count, updated_at)
    values (slug_param, 1, now())
    on conflict (slug) do update
        set count = component_clicks.count + 1,
            updated_at = now()
    returning count into new_count;
    return new_count;
end;
$$;

grant execute on function increment_click(text) to anon;
