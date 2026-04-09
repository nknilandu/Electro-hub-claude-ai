import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Zap, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
    setMobileOpen(false)
  }

  const dashboardPath = profile?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Products' },
  ]

  function isActive(path: string) {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-700 hover:text-brand-600 transition-colors">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            ElectroHub
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to={dashboardPath}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.includes('dashboard')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={profile?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="relative"
                >
                  <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-700" />
                  </div>
                  <span className="text-sm text-gray-600 max-w-[120px] truncate">{profile?.email || user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link to={dashboardPath} className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to) ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to={dashboardPath}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
