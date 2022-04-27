create table public.profiles (
  id uuid references auth.users not null,
  eth text not null,

  primary key (id, eth)
);

alter table public.profiles enable row level security;

create policy "Only users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
