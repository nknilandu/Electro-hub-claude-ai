export interface Profile {
  id: string
  email: string
  role: 'user' | 'admin'
  full_name?: string
  avatar_url?: string
  created_at?: string
}

export interface Product {
  id: string
  name: string
  description: string
  image_url: string
  price: number
  category: string
  created_at?: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at?: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: string
  created_at?: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  created_at?: string
  product?: Product
}
