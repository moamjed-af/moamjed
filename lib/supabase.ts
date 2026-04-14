import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    _supabase = createClient(url, key)
  }
  return _supabase
}

// Kept for backwards compat — lazily evaluated
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type Lead = {
  id?: string
  name: string
  phone: string
  budget_range: string
  buying_timeline: string
  score: 'HIGH' | 'MEDIUM' | 'LOW'
  calculator_data?: {
    property_price?: number
    down_payment?: number
    expected_rent?: number
    appreciation?: number
    rental_yield?: number
    annual_roi?: number
    monthly_cash_flow?: number
  }
  created_at?: string
  source?: string
}

// Supabase Schema SQL — run this in your Supabase SQL editor:
//
// create table leads (
//   id uuid default gen_random_uuid() primary key,
//   name text not null,
//   phone text not null,
//   budget_range text not null,
//   buying_timeline text not null,
//   score text check (score in ('HIGH', 'MEDIUM', 'LOW')) not null,
//   calculator_data jsonb,
//   source text default 'website',
//   created_at timestamptz default now()
// );
//
// -- Enable Row Level Security
// alter table leads enable row level security;
//
// -- Allow inserts from anon (website visitors)
// create policy "Allow anon insert" on leads
//   for insert to anon with check (true);
//
// -- Only authenticated users can read
// create policy "Allow auth read" on leads
//   for select to authenticated using (true);
