# SaaS Starter - Quick Start Guide

Get your SaaS application running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- Stripe account (test mode is fine for development)

## Step 1: Clone and Navigate

```bash
cd docker/templates/saas-starter
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update the following:
# 1. OPENAI_API_KEY - Your OpenAI API key (for Aider)
# 2. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - From Stripe Dashboard
# 3. STRIPE_SECRET_KEY - From Stripe Dashboard
```

## Step 3: Start Services

```bash
docker compose up -d
```

Wait for all services to start (about 1-2 minutes).

## Step 4: Access Your Application

- **Frontend**: http://localhost:3000
- **Code-Server**: http://localhost:8443 (password: `aider`)
- **Supabase Studio**: http://localhost:8000

## Step 5: Create Your First User

1. Visit http://localhost:3000
2. Click "Sign Up"
3. Enter your email and password
4. You'll be redirected to the dashboard

## What's Next?

### Customize Your App

1. Open Code-Server at http://localhost:8443
2. Navigate to the project files
3. Use Aider to make changes:
   ```
   Change the app name from "SaaS Starter" to "My Awesome SaaS"
   ```

### Set Up Stripe Products

1. Go to your Stripe Dashboard
2. Create products for each pricing tier (Starter, Pro, Enterprise)
3. Copy the price IDs and update them in:
   - `.env` file
   - `app/lib/stripe.ts`

### Configure Webhooks

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `http://your-domain.com/api/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Customize Styling

Edit `app/tailwind.config.js` to change colors and theme.

### Add Features

Use Aider in Code-Server to add new features:
```
Add a user profile edit page where users can update their name and bio
```

## Common Commands

```bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Restart a specific service
docker compose restart nextjs

# Access database
docker exec -it saas-starter-db psql -U postgres

# Run Next.js commands
docker exec -it saas-starter-nextjs npm run build
```

## Troubleshooting

### Can't connect to database
```bash
docker compose ps db
docker compose logs db
```

### Next.js build errors
```bash
docker compose logs nextjs
docker exec -it saas-starter-nextjs npm install
```

### Stripe webhooks not working
- Make sure webhook secret is correctly set
- Use Stripe CLI for local testing:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks
  ```

## Support

- Read the full README.md
- Check docker/EXAMPLES.md for more examples
- Visit [Aider Documentation](https://aider.chat/docs)
- Visit [Next.js Documentation](https://nextjs.org/docs)
- Visit [Supabase Documentation](https://supabase.com/docs)
