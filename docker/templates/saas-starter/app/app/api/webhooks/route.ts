import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.client_reference_id || session.metadata?.userId

      if (userId && session.subscription) {
        // Create or update subscription record
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
          })

        if (error) {
          console.error('Error creating subscription:', error)
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object

      // Update subscription status
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error updating subscription:', error)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object

      // Update subscription to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error canceling subscription:', error)
      }
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object

      // Record successful payment
      const { error } = await supabase
        .from('payments')
        .insert({
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: 'succeeded',
          payment_method: paymentIntent.payment_method_types[0],
        })

      if (error) {
        console.error('Error recording payment:', error)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
