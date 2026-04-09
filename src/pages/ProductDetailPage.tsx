import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Tag, Star, Shield, Truck, RotateCcw } from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import type { Product } from '../integrations/supabase/types'
import { useCart } from '../contexts/CartContext'
import { PageLoader } from '../components/LoadingSpinner'
import Footer from '../components/Footer'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setProduct(data as Product)
        setLoading(false)
      })
  }, [id])

  if (loading) return <PageLoader />

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-400">Product not found</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square border border-gray-100">
            <img
              src={product.image_url || FALLBACK_IMAGE}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="badge bg-brand-100 text-brand-700 mb-3">
                <Tag className="w-3 h-3 mr-1" />
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">{product.name}</h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>

              <p className="text-4xl font-extrabold text-brand-700">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About this product</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                className="btn-primary flex-1 py-4 text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link to="/products" className="btn-outline flex-1 py-4 text-base justify-center">
                Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, text: '2-Year Warranty' },
                { icon: Truck, text: 'Free Shipping' },
                { icon: RotateCcw, text: '30-Day Returns' },
              ].map(item => (
                <div key={item.text} className="flex flex-col items-center gap-2 text-center p-3 bg-gray-50 rounded-xl">
                  <item.icon className="w-5 h-5 text-brand-600" />
                  <span className="text-xs font-medium text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
