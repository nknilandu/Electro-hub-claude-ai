import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Tag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../integrations/supabase/types'

interface Props {
  product: Product
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()

  return (
    <div className="card group flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
        <img
          src={product.image_url || FALLBACK_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        <span className="absolute top-3 left-3 badge bg-brand-100 text-brand-700">
          <Tag className="w-3 h-3 mr-1" />{product.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-xl font-bold text-brand-700">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="btn-outline flex-1 text-sm py-2 px-3"
          >
            <Eye className="w-4 h-4" />
            Details
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="btn-primary flex-1 text-sm py-2 px-3"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
