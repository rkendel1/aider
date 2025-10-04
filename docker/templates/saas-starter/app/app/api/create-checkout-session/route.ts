import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { planName, billingPeriod } = await request.json()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create Stripe checkout session
    // Note: In production, you would map planName to actual Stripe price IDs
    const priceId = `price_${planName}_${billingPeriod}` // Placeholder
    
    const session = await createCheckoutSession(
      user.id,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
    )

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
