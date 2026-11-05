-- MHE Gardens — Supabase schema
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- The site writes with the service role key (server only), so Row Level Security
-- stays ON with no public policies: nobody can read or write from the browser.

create extension if not exists vector;

-- Leads from the "See if you qualify" questionnaire (buyer/seller/investor)
-- and the credit / talk-with-Ruth / auction help popups (credit/agent/auction)
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  role        text not null check (role in ('buyer', 'seller', 'investor', 'credit', 'agent', 'auction')),
  outcome     text not null,
  name        text not null,
  phone       text not null,
  email       text not null,
  answers     jsonb not null default '{}'::jsonb,
  message     text,
  email_sent  boolean not null default false,
  status      text not null default 'new'   -- new, contacted, booked, signed, closed, lost
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;

-- AI chat messages (one row per message)
create table if not exists public.chat_messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null
);
create index if not exists chat_messages_session_idx on public.chat_messages (session_id, created_at);
alter table public.chat_messages enable row level security;

-- Knowledge for the AI guide (your PDFs, split into chunks), for search later
create table if not exists public.documents (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  source      text not null,          -- e.g. file name of the PDF
  chunk       int not null default 0,
  content     text not null,
  embedding   vector(1024)            -- mistral-embed size
);
alter table public.documents enable row level security;

create or replace function public.match_documents(query_embedding vector(1024), match_count int default 5)
returns table (id bigint, source text, content text, similarity float)
language sql stable as $$
  select d.id, d.source, d.content, 1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where d.embedding is not null
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
