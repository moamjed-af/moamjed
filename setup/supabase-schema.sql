-- Mo Amjed Real Estate — Supabase Schema
-- Run this in Supabase: Dashboard → SQL Editor → New Query → paste → Run

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  budget_range TEXT NOT NULL,
  buying_timeline TEXT NOT NULL,
  score TEXT NOT NULL CHECK (score IN ('HIGH', 'MEDIUM', 'LOW')),
  calculator_data JSONB,
  source TEXT DEFAULT 'website',
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'lost'))
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: allow inserts from anonymous (website visitors)
CREATE POLICY "Allow public insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: only authenticated users (you) can read leads
CREATE POLICY "Allow authenticated read" ON leads
  FOR SELECT TO authenticated
  USING (true);

-- Index for quick sorting by score and date
CREATE INDEX leads_score_idx ON leads (score);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

-- Optional: view for quick dashboard
CREATE OR REPLACE VIEW lead_summary AS
SELECT
  score,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'new') as new_leads,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as this_week
FROM leads
GROUP BY score
ORDER BY CASE score WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END;
