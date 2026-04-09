import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              ElectroHub
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Premium electronics accessories for the modern world. Quality guaranteed, shipped fast.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {['All Products', 'Cables & Adapters', 'Audio', 'Charging', 'Cases & Covers', 'New Arrivals'].map(item => (
                <li key={item}>
                  <Link to="/products" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {['FAQs', 'Shipping Policy', 'Return Policy', 'Track Order', 'Contact Us', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
                <span>123 Tech Street, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (800) 555-ELEC</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@electrohub.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
                <button className="px-3 py-2 bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium text-white">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ElectroHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
