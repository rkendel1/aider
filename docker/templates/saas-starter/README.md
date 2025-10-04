# SaaS Starter Template

A production-ready SaaS starter template built with Next.js and Supabase, featuring authentication, user dashboard, and Stripe payment integration.

## Features

- **Next.js Frontend**: Modern React framework with server-side rendering
- **Supabase Backend**: PostgreSQL database, authentication, and REST API
- **User Authentication**: Sign up, login, and logout functionality
- **User Dashboard**: Protected dashboard with user-specific information
- **Stripe Integration**: Payment processing for subscriptions and one-time payments
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Prerequisites

- Docker and Docker Compose
- Stripe account (for payment integration)
- OpenAI API key (for Aider)

## Quick Start

1. **Navigate to the template directory**:
   ```bash
   cd docker/templates/saas-starter
   ```

2. **Copy and configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (for production)

3. **Start the services**:
   ```bash
   docker compose up -d
   ```

4. **Set up the database**:
   ```bash
   docker exec -it saas-starter-db-1 psql -U postgres -f /docker-entrypoint-initdb.d/schema.sql
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Supabase API: http://localhost:8000
   - Code-Server: http://localhost:8443 (password: `aider`)

## Project Structure

```
saas-starter/
├── app/                    # Next.js application
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   └── payments/      # Payment components
│   ├── lib/               # Utility libraries
│   │   ├── supabase.ts    # Supabase client
│   │   └── stripe.ts      # Stripe client
│   ├── app/               # Next.js app directory
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   ├── dashboard/     # Dashboard page
│   │   └── api/           # API routes
│   └── package.json       # Dependencies
├── supabase/
│   └── schema.sql         # Database schema
├── docker-compose.yml     # Docker services configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Database Schema

The template includes the following database tables:

- **user_profiles**: Extended user information
- **subscriptions**: User subscription data
- **payments**: Payment transaction records

## Authentication Flow

1. Users sign up with email and password
2. Supabase creates an authenticated user
3. User profile is automatically created
4. Users can log in and access the dashboard
5. Protected routes redirect unauthenticated users to login

## Payment Integration

The template includes basic Stripe integration:

- **Subscription Plans**: Monthly and annual billing
- **Payment Processing**: Secure checkout with Stripe
- **Webhook Handling**: Automatic subscription status updates
- **Customer Portal**: Self-service billing management

## Development Workflow

1. **Use Aider for code generation**:
   - Access Code-Server at http://localhost:8443
   - Use the integrated Aider to generate and modify code
   
2. **Test your changes**:
   - Frontend updates are live-reloaded
   - Database changes can be applied via migrations
   
3. **Extend the template**:
   - Add new pages in `app/app/`
   - Create new components in `app/components/`
   - Extend the database schema in `supabase/schema.sql`

## Customization

### Styling
- Tailwind CSS is pre-configured
- Customize colors in `tailwind.config.js`
- Add global styles in `app/app/globals.css`

### Subscription Plans
- Edit plan details in `app/lib/stripe.ts`
- Update pricing in `app/components/payments/PricingTable.tsx`

### Database Schema
- Modify `supabase/schema.sql` for custom tables
- Add migrations in `supabase/migrations/`

## Deployment

### Environment Variables
Update the following for production:
- Generate secure `JWT_SECRET` (minimum 32 characters)
- Use production Stripe keys
- Set proper CORS origins
- Configure email authentication

### Database Migrations
```bash
# Create a migration
supabase migration new migration_name

# Apply migrations
supabase db push
```

## Troubleshooting

### Authentication Issues
- Verify `JWT_SECRET` is at least 32 characters
- Check Supabase authentication settings
- Ensure email confirmation is properly configured

### Payment Issues
- Verify Stripe API keys are correct
- Test with Stripe test mode first
- Check webhook signatures

### Database Connection
- Ensure PostgreSQL container is running
- Verify connection string in `.env`
- Check database logs: `docker compose logs db`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

This template is provided as-is for use in your SaaS projects.
