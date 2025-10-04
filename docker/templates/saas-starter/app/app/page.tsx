import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">SaaS Starter</div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            Build Your SaaS Product
            <span className="block text-primary-600">Faster Than Ever</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            A production-ready starter template with authentication, payments, and everything you need to launch your SaaS product.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 text-base font-medium text-primary-600 bg-white border border-primary-600 rounded-md hover:bg-primary-50"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Built-in user authentication with Supabase. Sign up, login, and manage users securely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stripe Payments</h3>
            <p className="text-gray-600">
              Accept payments and manage subscriptions with Stripe integration out of the box.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Dashboard</h3>
            <p className="text-gray-600">
              Beautiful, responsive dashboard to manage user profiles and subscription details.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built with Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-gray-600 font-medium">Next.js</div>
            <div className="text-gray-600 font-medium">Supabase</div>
            <div className="text-gray-600 font-medium">Stripe</div>
            <div className="text-gray-600 font-medium">Tailwind CSS</div>
            <div className="text-gray-600 font-medium">TypeScript</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 SaaS Starter. Built with ❤️ using Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
