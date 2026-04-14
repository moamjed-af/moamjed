import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { scoreLead, getRedirectUrl } from '@/lib/lead-scoring'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, budget_range, buying_timeline, calculator_data } = body

    if (!name || !phone || !budget_range || !buying_timeline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const score = scoreLead({ budget_range, buying_timeline })
    const redirectUrl = getRedirectUrl(score, { budget_range, buying_timeline, name })

    const lead = {
      name,
      phone,
      budget_range,
      buying_timeline,
      score,
      calculator_data: calculator_data || null,
      source: 'website',
    }

    const { error } = await getSupabase().from('leads').insert(lead)

    if (error) {
      console.error('Supabase error:', error)
      // Still return score/redirect even if DB fails
    }

    return NextResponse.json({ score, redirectUrl, success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
