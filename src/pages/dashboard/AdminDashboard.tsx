import { useEffect, useState, useCallback } from 'react'
import {
  Package, PlusCircle, BarChart2, Pencil, Trash2,
  X, Check, AlertTriangle, TrendingUp, ShoppingBag
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { supabase } from '../../integrations/supabase/client'
import type { Product } from '../../integrations/supabase/types'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

type Tab = 'products' | 'add' | 'analytics'

const CATEGORIES = ['Audio', 'Mobile', 'Cables', 'Charging', 'Computing', 'Wearables']
const PIE_COLORS = ['#6366f1', '#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const EMPTY_FORM = { name: '', description: '', image_url: '', price: '', category: CATEGORIES[0] }

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('products')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'add', label: 'Add Product', icon: PlusCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your store products and analytics</p>
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
        {tab === 'products' && <ProductsSection />}
        {tab === 'add' && <AddProductSection onAdded={() => setTab('products')} />}
        {tab === 'analytics' && <AnalyticsSection />}
      </div>
    </div>
  )
}

// ── Products Section ─────────────────────────────────────────────────────────

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data as Product[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function startEdit(p: Product) {
    setEditId(p.id)
    setEditForm({ name: p.name, description: p.description, image_url: p.image_url, price: p.price, category: p.category })
  }

  async function saveEdit() {
    if (!editId) return
    setSaving(true)
    const { error } = await supabase
      .from('products')
      .update({
        name: editForm.name,
        description: editForm.description,
        image_url: editForm.image_url,
        price: Number(editForm.price),
        category: editForm.category,
      })
      .eq('id', editId)
    setSaving(false)
    if (error) { toast.error('Failed to update product'); return }
    toast.success('Product updated!')
    setEditId(null)
    fetchProducts()
  }

  async function confirmDelete() {
    if (!deleteId) return
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    if (error) { toast.error('Failed to delete product'); return }
    toast.success('Product deleted')
    setDeleteId(null)
    fetchProducts()
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  if (products.length === 0) {
    return (
      <div className="text-center py-24 card max-w-md mx-auto">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No products yet</h3>
        <p className="text-gray-400 mb-6 text-sm">Start by adding your first product</p>
      </div>
    )
  }

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 py-3">Cancel</button>
              <button onClick={confirmDelete} className="btn-danger flex-1 py-3">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All Products ({products.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${editId === p.id ? 'bg-brand-50/30' : ''}`}>
                  {editId === p.id ? (
                    <>
                      <td className="px-5 py-3" colSpan={2}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input value={editForm.name || ''} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} placeholder="Name" className="input py-2 text-sm" />
                          <input value={editForm.image_url || ''} onChange={e => setEditForm(f => ({...f, image_url: e.target.value}))} placeholder="Image URL" className="input py-2 text-sm" />
                          <input value={editForm.description || ''} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} placeholder="Description" className="input py-2 text-sm sm:col-span-2" />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-2">
                          <input value={editForm.price || ''} onChange={e => setEditForm(f => ({...f, price: e.target.value as unknown as number}))} placeholder="Price" type="number" min="0" step="0.01" className="input py-2 text-sm w-28" />
                          <select value={editForm.category || ''} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} className="input py-2 text-sm">
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={saveEdit} disabled={saving} className="btn-primary py-2 px-3 text-sm">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditId(null)} className="btn-outline py-2 px-3 text-sm">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge bg-gray-100 text-gray-600">{p.category}</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-brand-700">${Number(p.price).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="btn-outline py-1.5 px-3 text-xs gap-1.5">
                            <Pencil className="w-3.5 h-3.5" />Edit
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── Add Product Section ───────────────────────────────────────────────────────

function AddProductSection({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  function set(key: keyof typeof EMPTY_FORM, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) { toast.error('Price must be a positive number'); return }
    setSaving(true)
    const { error } = await supabase.from('products').insert({
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      price: Number(form.price),
      category: form.category,
    })
    setSaving(false)
    if (error) { toast.error('Failed to add product: ' + error.message); return }
    toast.success('Product added successfully!')
    setForm(EMPTY_FORM)
    onAdded()
  }

  return (
    <div className="max-w-xl">
      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. USB-C Fast Charging Cable" className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the product features..." rows={3} className="input resize-none" />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className="input" />
            {form.image_url && (
              <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price ($) *</label>
              <input value={form.price} onChange={e => set('price', e.target.value)} type="number" min="0" step="0.01" placeholder="29.99" className="input" required />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-base disabled:opacity-60">
            {saving ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              <><PlusCircle className="w-5 h-5" />Add Product</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Analytics Section ─────────────────────────────────────────────────────────

function AnalyticsSection() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([])
  const [ordersData, setOrdersData] = useState<{ date: string; orders: number; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      const [{ count: pc }, { data: orders }, { data: products }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total, created_at').order('created_at'),
        supabase.from('products').select('category'),
      ])

      setTotalProducts(pc || 0)
      setTotalOrders(orders?.length || 0)
      setTotalRevenue((orders || []).reduce((s, o) => s + Number(o.total), 0))

      // Category distribution
      const catMap: Record<string, number> = {}
      ;(products || []).forEach(p => {
        catMap[p.category] = (catMap[p.category] || 0) + 1
      })
      setCategoryData(Object.entries(catMap).map(([name, count]) => ({ name, count })))

      // Orders by day (last 7 days)
      const dayMap: Record<string, { orders: number; revenue: number }> = {}
      const now = new Date()
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        dayMap[key] = { orders: 0, revenue: 0 }
      }
      ;(orders || []).forEach(o => {
        const key = new Date(o.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (dayMap[key]) {
          dayMap[key].orders += 1
          dayMap[key].revenue += Number(o.total)
        }
      })
      setOrdersData(Object.entries(dayMap).map(([date, v]) => ({ date, ...v })))
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Products', value: totalProducts, icon: Package, color: 'bg-brand-50 text-brand-600' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
        ].map(s => (
          <div key={s.label} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{s.label}</p>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar chart — orders per day */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Orders (Last 7 Days)</h3>
          {ordersData.every(d => d.orders === 0) ? (
            <div className="h-52 flex items-center justify-center text-gray-300 text-sm">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ordersData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 13 }}
                  cursor={{ fill: '#f5f3ff' }}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — products by category */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Products by Category</h3>
          {categoryData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-gray-300 text-sm">No products yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
