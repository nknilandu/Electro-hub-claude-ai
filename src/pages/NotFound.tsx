import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-brand-400" />
      </div>
      <h1 className="text-7xl font-extrabold text-brand-600 mb-3">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link to="/products" className="btn-outline">
          Browse Products
        </Link>
      </div>
    </div>
  )
}
