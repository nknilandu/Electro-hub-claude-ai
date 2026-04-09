# ElectroHub — Premium Electronics Accessories eCommerce

A production-ready full-stack eCommerce web app built with React + Vite + Tailwind CSS + Supabase.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Charts**: Recharts
- **Routing**: React Router v6
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## Features
- Sign Up / Sign In with role-based access (user / admin)
- Session persistence and auto-login
- Product browsing with search & category filter
- Add to Cart with quantity upsert (no duplicates)
- Live cart badge in navbar
- Checkout → creates order rows, clears cart
- User Dashboard: Cart, Purchase History, Profile
- Admin Dashboard: Product CRUD, Analytics (bar + pie charts)
- Protected routes (PrivateRoute, AdminRoute)
- Responsive design, loading/empty states, toast notifications

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd electro-accessories
npm install
```

### 2. Set Up Supabase Database

1. Go to your [Supabase project](https://app.supabase.com)
2. Open **SQL Editor**
3. Run the entire contents of `supabase-schema.sql`
4. Optionally uncomment the seed data at the bottom to add sample products

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ Never commit `.env` with real credentials. It's in `.gitignore`.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA routing automatically

---

## Project Structure

```
src/
├── integrations/supabase/
│   ├── client.ts          # Centralized Supabase client (env vars only)
│   └── types.ts           # TypeScript interfaces for all tables
├── contexts/
│   ├── AuthContext.tsx     # Auth state, signUp, signIn, signOut
│   └── CartContext.tsx     # Live cart count, addToCart
├── components/
│   ├── Navbar.tsx          # Role-aware nav, live cart badge
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── PrivateRoute.tsx    # Redirects unauthenticated users
│   ├── AdminRoute.tsx      # Redirects non-admins
│   └── LoadingSpinner.tsx
├── pages/
│   ├── HomePage.tsx        # Hero, categories, featured products, testimonials
│   ├── AllProductsPage.tsx # Search, filter, grid
│   ├── ProductDetailPage.tsx
│   ├── AuthPage.tsx        # Sign in / Sign up with role picker
│   ├── NotFound.tsx
│   └── dashboard/
│       ├── UserDashboard.tsx   # Cart, Orders, Profile
│       └── AdminDashboard.tsx  # Products CRUD, Add Product, Analytics
├── App.tsx                 # Routes + all providers
├── main.tsx
└── index.css               # Tailwind + custom component classes
```

---

## Database Schema

| Table | Key Columns |
|---|---|
| `profiles` | `id` (auth uid), `email`, `role` (user\|admin), `full_name` |
| `products` | `id`, `name`, `description`, `image_url`, `price`, `category` |
| `cart_items` | `id`, `user_id`, `product_id`, `quantity` — unique(user_id, product_id) |
| `orders` | `id`, `user_id`, `total`, `status`, `created_at` |
| `order_items` | `id`, `order_id`, `product_id`, `quantity`, `price_at_purchase` |

Row Level Security (RLS) is enabled on all tables.
"# Electro-hub-claude-ai" 
