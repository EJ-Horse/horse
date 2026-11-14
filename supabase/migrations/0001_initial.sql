-- EJ app schema.
-- Only the accounts you create by hand (you and Sofía) can sign in; sign-ups are turned off.
-- Every signed-in person shares the same data, so both of you see everything.

-- One flexible table for every list in the app. `kind` says which list
-- (vaccine, photo, cost, skill, ...) and `data` holds that item's fields.
create table public.items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  data jsonb not null default '{}',
  created_by uuid references auth.users on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index items_kind on public.items (kind, created_at desc);

-- Who's who, so the app can say "Sofía added this".
create table public.people (
  user_id uuid primary key references auth.users on delete cascade default auth.uid(),
  name text not null
);

alter table public.items enable row level security;
alter table public.people enable row level security;

create policy "signed-in can read items" on public.items for select to authenticated using (true);
create policy "signed-in can add items" on public.items for insert to authenticated with check (true);
create policy "signed-in can edit items" on public.items for update to authenticated using (true);
create policy "signed-in can delete items" on public.items for delete to authenticated using (true);

create policy "signed-in can read people" on public.people for select to authenticated using (true);
create policy "each person sets own name" on public.people for insert to authenticated with check (user_id = auth.uid());
create policy "each person edits own name" on public.people for update to authenticated using (user_id = auth.uid());

-- Live updates: when one of you adds something, the other phone sees it right away.
alter publication supabase_realtime add table public.items;

-- Private storage for photos, invoices and short video clips (50 MB max per file on the free plan).
insert into storage.buckets (id, name, public) values ('media', 'media', false)
on conflict (id) do nothing;

create policy "signed-in can read media" on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "signed-in can upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "signed-in can delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
