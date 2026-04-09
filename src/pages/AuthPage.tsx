import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, Lock, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const { user, profile, signIn, signUp, loading } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Already logged in — redirect
  if (!loading && user && profile) {
    return <Navigate to={profile.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setSubmitting(true)
    if (mode === 'signup') {
      const { error } = await signUp(email, password, role)
      if (error) {
        toast.error(error.message || 'Sign up failed')
      } else {
        toast.success('Account created! Please sign in.')
        setMode('signin')
        setPassword('')
      }
    } else {
      const { error, role: userRole } = await signIn(email, password)
      if (error) {
        toast.error(error.message || 'Invalid email or password')
      } else {
        toast.success('Welcome back!')
        navigate(userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard', { replace: true })
      }
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            {mode === 'signin' ? 'Sign in to your ElectroHub account' : 'Join thousands of happy customers'}
          </p>
        </div>

        <div className="card p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector (sign up only) */}
            {mode === 'signup' && (
              <div>
                <label className="label">Account type</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'user', icon: User, label: 'Customer', desc: 'Shop & manage orders' },
                    { value: 'admin', icon: ShieldCheck, label: 'Admin', desc: 'Manage products & store' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === opt.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 mb-1.5 ${role === opt.value ? 'text-brand-600' : 'text-gray-400'}`} />
                      <p className={`font-semibold text-sm ${role === opt.value ? 'text-brand-700' : 'text-gray-700'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-brand-600 font-semibold hover:text-brand-700"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
