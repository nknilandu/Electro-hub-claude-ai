import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import AllProductsPage from './pages/AllProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AuthPage from './pages/AuthPage'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#111',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
            }}
          />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<AllProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/user-dashboard"
                  element={
                    <PrivateRoute>
                      <UserDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
