import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, Package, User, Minus, Plus, Trash2,
  ShoppingBag, ChevronRight, CheckCircle
} from 'lucide-react'
import { supabase } from '../../integrations/supabase/client'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import type { CartItem, Order } from '../../integrations/supabase/types'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

type Tab = 'cart' | 'orders' | 'profile'

export default function UserDashboard() {
  const { user, profile } = useAuth()
  const { refreshCartCount } = useCart()
  const [tab, setTab] = useState<Tab>('cart')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'cart', label: 'My Cart', icon: ShoppingCart },
    { id: 'orders', label: 'Purchased Products', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile?.email}</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 border-b border-gray-100 -mb-px">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tab === 'cart' && <CartSection userId={user?.id || ''} refreshCartCount={refreshCartCount} />}
        {tab === 'orders' && <OrdersSection userId={user?.id || ''} />}
        {tab === 'profile' && <ProfileSection />}
      </div>
    </div>
  )
}

// ── Cart Section ────────────────────────────────────────────────────────────

function CartSection({ userId, refreshCartCount }: { userId: string; refreshCartCount: () => void }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  const fetchCart = useCallback(async () => {
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    setItems((data as CartItem[]) || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchCart() }, [fetchCart])

  async function updateQty(itemId: string, newQty: number) {
    if (newQty < 1) { await removeItem(itemId); return }
    await supabase.from('cart_items').update({ quantity: newQty }).eq('id', itemId)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i))
    refreshCartCount()
  }

  async function removeItem(itemId: string) {
    await supabase.from('cart_items').delete().eq('id', itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
    refreshCartCount()
    toast.success('Item removed from cart')
  }

  async function handleCheckout() {
    if (items.length === 0) return
    setCheckingOut(true)
    const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total, status: 'completed' })
      .select()
      .single()

    if (orderError || !order) {
      toast.error('Checkout failed. Please try again.')
      setCheckingOut(false)
      return
    }

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price_at_purchase: i.product?.price || 0,
    }))

    await supabase.from('order_items').insert(orderItems)
    await supabase.from('cart_items').delete().eq('user_id', userId)

    setItems([])
    refreshCartCount()
    toast.success('Order placed successfully! 🎉')
    setCheckingOut(false)
  }

  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  if (items.length === 0) {
    return (
      <div className="text-center py-24 card max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
        <p className="text-gray-400 mb-7 text-sm">Add some awesome accessories to get started!</p>
        <Link to="/products" className="btn-primary">
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items list */}
      <div className="lg:col-span-2 space-y-4">
        {items.map(item => (
          <div key={item.id} className="card p-5 flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
              <img
                src={item.product?.image_url || ''}
                alt={item.product?.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{item.product?.name}</h4>
              <p className="text-sm text-gray-400 mt-0.5">${Number(item.product?.price || 0).toFixed(2)} each</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-700">
                    ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6 h-fit sticky top-24 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {items.map(i => (
            <div key={i.id} className="flex justify-between text-gray-500">
              <span className="truncate mr-2">{i.product?.name} × {i.quantity}</span>
              <span className="shrink-0">${(Number(i.product?.price || 0) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-brand-700">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="btn-primary w-full py-4 text-base disabled:opacity-60"
        >
          {checkingOut ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Place Order
            </>
          )}
        </button>
        <Link to="/products" className="btn-outline w-full py-3 text-sm justify-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ── Orders Section ──────────────────────────────────────────────────────────

function OrdersSection({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 card max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
        <p className="text-gray-400 mb-7 text-sm">Your completed orders will appear here</p>
        <Link to="/products" className="btn-primary">
          <ShoppingBag className="w-4 h-4" />
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="card overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order ID</p>
              <p className="font-mono text-sm text-gray-700">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
              <p className="text-sm text-gray-700">{new Date(order.created_at || '').toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
              <p className="text-sm font-bold text-brand-700">${Number(order.total).toFixed(2)}</p>
            </div>
            <span className="badge bg-green-100 text-green-700 capitalize">{order.status}</span>
          </div>
          <div className="p-6 divide-y divide-gray-50">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                  <img
                    src={item.product?.image_url || ''}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.product?.name}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity} · ${Number(item.price_at_purchase).toFixed(2)} each</p>
                </div>
                <p className="font-semibold text-gray-900 shrink-0">
                  ${(item.quantity * Number(item.price_at_purchase)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Profile Section ─────────────────────────────────────────────────────────

function ProfileSection() {
  const { user, profile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)
    setSaving(false)
    if (error) toast.error('Failed to update profile')
    else toast.success('Profile updated!')
  }

  return (
    <div className="max-w-lg">
      <div className="card p-8 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-2xl font-bold text-brand-700">
            {(profile?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{profile?.email}</h3>
            <span className={`badge mt-1 ${profile?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-brand-100 text-brand-700'} capitalize`}>
              {profile?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className="input"
            />
          </div>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="label">Account type</label>
            <input
              type="text"
              value={profile?.role === 'admin' ? 'Administrator' : 'Customer'}
              disabled
              className="input bg-gray-50 text-gray-400 cursor-not-allowed capitalize"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <ChevronRight className="w-4 h-4" />
            Member since {new Date(user?.created_at || '').toLocaleDateString()}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
