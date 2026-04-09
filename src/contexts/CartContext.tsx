import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './AuthContext'
import type { Product } from '../integrations/supabase/types'
import toast from 'react-hot-toast'

interface CartContextType {
  cartCount: number
  refreshCartCount: () => void
  addToCart: (product: Product) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
    if (!user) { setCartCount(0); return }
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
    if (data) {
      const total = data.reduce((sum, item) => sum + (item.quantity || 0), 0)
      setCartCount(total)
    }
  }, [user])

  useEffect(() => {
    refreshCartCount()
  }, [refreshCartCount])

  async function addToCart(product: Product) {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }
    // Check if already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)
    } else {
      await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      })
    }
    toast.success(`${product.name} added to cart!`)
    refreshCartCount()
  }

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
