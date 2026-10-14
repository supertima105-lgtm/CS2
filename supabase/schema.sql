-- ====================================================================
-- CS2 Tactics Lab: Supabase Database Schema & Row Level Security (RLS)
-- ====================================================================
-- Запустите этот скрипт в Supabase Dashboard: SQL Editor -> New Query -> Run

-- 1. Таблица сохраненных раскидок пользователя (Избранное и Выучено)
create table if not exists public.user_lineups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lineup_id text not null,
  is_favorite boolean default false not null,
  is_learned boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_lineup_unique unique(user_id, lineup_id)
);

-- Индексы для быстрой фильтрации по пользователю
create index if not exists idx_user_lineups_user_id on public.user_lineups(user_id);
create index if not exists idx_user_lineups_lineup_id on public.user_lineups(lineup_id);

-- 2. Включаем Row Level Security (RLS)
alter table public.user_lineups enable row level security;

-- 3. Политики безопасности RLS (Пользователь имеет доступ ТОЛЬКО к своим данным)

-- Чтение: пользователь видит только свои записи
create policy "Users can select own lineup records"
  on public.user_lineups
  for select
  using (auth.uid() = user_id);

-- Создание: пользователь может добавлять только записи с собственным user_id
create policy "Users can insert own lineup records"
  on public.user_lineups
  for insert
  with check (auth.uid() = user_id);

-- Обновление: пользователь может изменять только свои записи
create policy "Users can update own lineup records"
  on public.user_lineups
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Удаление: пользователь может удалять только свои записи
create policy "Users can delete own lineup records"
  on public.user_lineups
  for delete
  using (auth.uid() = user_id);

-- 4. Автоматическое обновление updated_at триггером (Опционально)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.user_lineups;
create trigger set_updated_at
  before update on public.user_lineups
  for each row
  execute function public.handle_updated_at();
