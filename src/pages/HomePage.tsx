import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Zap, Shield, Truck, Star, ArrowRight,
  Headphones, Smartphone, Cable, Battery, Cpu, Watch
} from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import type { Product } from '../integrations/supabase/types'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { PageLoader } from '../components/LoadingSpinner'

const CATEGORIES = [
  { name: 'Audio', icon: Headphones, color: 'bg-purple-100 text-purple-700', desc: 'Headphones & Speakers' },
  { name: 'Mobile', icon: Smartphone, color: 'bg-blue-100 text-blue-700', desc: 'Cases & Screen Protectors' },
  { name: 'Cables', icon: Cable, color: 'bg-green-100 text-green-700', desc: 'USB-C, Lightning & More' },
  { name: 'Charging', icon: Battery, color: 'bg-yellow-100 text-yellow-700', desc: 'Fast Chargers & Power Banks' },
  { name: 'Computing', icon: Cpu, color: 'bg-red-100 text-red-700', desc: 'Hubs, Mice & Keyboards' },
  { name: 'Wearables', icon: Watch, color: 'bg-pink-100 text-pink-700', desc: 'Bands & Accessories' },
]

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Customer Support' },
]

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Tech Enthusiast', text: 'Incredible quality and super fast shipping. The USB-C hub I ordered works flawlessly with my MacBook.', rating: 5 },
  { name: 'James K.', role: 'Remote Worker', text: 'Best electronics accessories store online. I\'ve ordered 5 times already and every product exceeded expectations.', rating: 5 },
  { name: 'Priya R.', role: 'Designer', text: 'The wireless charging pad is elegant and charges my devices so fast. Totally worth every penny.', rating: 5 },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              New arrivals every week
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
              Premium Electronics<br />
              <span className="text-yellow-300">Accessories</span> for<br />
              Modern Life
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl">
              Explore hundreds of high-quality accessories for your devices. Fast shipping, easy returns, and unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary bg-white text-brand-700 hover:bg-gray-50 shadow-lg text-base px-8 py-4">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link to="/products" className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 text-base px-8 py-4">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60H1440V0C1200 40 960 60 720 60C480 60 240 40 0 0V60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.value} className="text-center p-6 rounded-2xl bg-brand-50 border border-brand-100">
                <p className="text-3xl font-extrabold text-brand-700">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group card p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our most popular accessories</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">No products yet</p>
              <p className="text-gray-300 text-sm mt-1">Add products from the admin dashboard</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary px-10 py-3.5 text-base">
              Browse All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Choose ElectroHub?</h2>
            <p className="section-subtitle">We put quality and service first</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: '2-Year Warranty', desc: 'Every product comes with a 24-month manufacturer warranty and hassle-free replacement.', color: 'text-green-600 bg-green-100' },
              { icon: Truck, title: 'Free Fast Shipping', desc: 'Free shipping on all orders over $35. Most orders arrive within 2–3 business days.', color: 'text-blue-600 bg-blue-100' },
              { icon: Star, title: 'Curated Quality', desc: 'Every accessory is tested and verified by our team before it reaches your doorstep.', color: 'text-yellow-600 bg-yellow-100' },
            ].map(item => (
              <div key={item.title} className="card p-8 text-center hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Thousands of happy customers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-7 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center font-bold text-brand-700 text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 gradient-hero text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Ready to upgrade your setup?</h2>
          <p className="text-lg text-white/80 mb-10">
            Join over 50,000 customers who trust ElectroHub for premium accessories.
          </p>
          <Link to="/products" className="btn-primary bg-white text-brand-700 hover:bg-gray-50 text-base px-10 py-4 shadow-xl">
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
