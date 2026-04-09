import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ShoppingBag, X } from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import type { Product } from '../integrations/supabase/types'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { PageLoader } from '../components/LoadingSpinner'

const CATEGORIES = ['All', 'Audio', 'Mobile', 'Cables', 'Charging', 'Computing', 'Wearables']

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [products, activeCategory, search])

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">All Products</h1>
          <p className="text-gray-400">{products.length} premium accessories available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1 shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results info */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> products
            {activeCategory !== 'All' && <> in <span className="font-semibold text-brand-600">{activeCategory}</span></>}
            {search && <> matching "<span className="font-semibold text-gray-700">{search}</span>"</>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-400">No products found</p>
            <p className="text-gray-300 text-sm mt-2 mb-6">Try a different search or category filter</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="btn-outline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
