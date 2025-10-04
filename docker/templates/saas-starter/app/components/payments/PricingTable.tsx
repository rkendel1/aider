'use client'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Plan = {
  name: string
  description: string
  price_monthly: number
  price_yearly?: number
  features: string[]
}

const plans: Plan[] = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    price_monthly: 9.99,
    price_yearly: 99.99,
    features: [
      'Up to 10 projects',
      'Basic support',
      '1 GB storage',
      'Email notifications',
    ],
  },
  {
    name: 'Pro',
    description: 'For growing teams and businesses',
    price_monthly: 29.99,
    price_yearly: 299.99,
    features: [
      'Unlimited projects',
      'Priority support',
      '10 GB storage',
      'Advanced analytics',
      'Team collaboration',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price_monthly: 99.99,
    price_yearly: 999.99,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Unlimited storage',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
    ],
  },
]

export default function PricingTable() {
  const handleSubscribe = async (planName: string, billingPeriod: 'monthly' | 'yearly') => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: planName.toLowerCase(),
          billingPeriod,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-7xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price_monthly}
                  </span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                {plan.price_yearly && (
                  <p className="mt-2 text-sm text-gray-500">
                    or ${plan.price_yearly}/year (save{' '}
                    {Math.round(
                      ((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) *
                        100
                    )}
                    %)
                  </p>
                )}
                <button
                  onClick={() => handleSubscribe(plan.name, 'monthly')}
                  className="mt-8 block w-full bg-primary-600 border border-primary-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
                >
                  Subscribe Monthly
                </button>
                {plan.price_yearly && (
                  <button
                    onClick={() => handleSubscribe(plan.name, 'yearly')}
                    className="mt-2 block w-full bg-white border border-gray-300 rounded-md py-2 text-sm font-semibold text-gray-900 text-center hover:bg-gray-50"
                  >
                    Subscribe Yearly
                  </button>
                )}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
