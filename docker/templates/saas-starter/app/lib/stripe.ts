import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter',
    monthly: {
      priceId: process.env.STRIPE_PRICE_ID_STARTER_MONTHLY,
      amount: 999, // $9.99
    },
    yearly: {
      priceId: process.env.STRIPE_PRICE_ID_STARTER_YEARLY,
      amount: 9999, // $99.99
    },
  },
  pro: {
    name: 'Pro',
    monthly: {
      priceId: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
      amount: 2999, // $29.99
    },
    yearly: {
      priceId: process.env.STRIPE_PRICE_ID_PRO_YEARLY,
      amount: 29999, // $299.99
    },
  },
  enterprise: {
    name: 'Enterprise',
    monthly: {
      priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY,
      amount: 9999, // $99.99
    },
    yearly: {
      priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE_YEARLY,
      amount: 99999, // $999.99
    },
  },
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}
