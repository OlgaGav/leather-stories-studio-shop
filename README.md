# Leather Stories Studio — Shop (React + Stripe)

An e-commerce style landing page and shop for handmade leather goods.  
Users can browse products, select color/leather options, add personalization, add items to cart, and checkout via Stripe.

## Features
- Premium landing page (Hero / Story / Products)
- Product variants (color + leather)
- Personalization modal (text + font)
- Cart with quantity updates and totals
- Stripe Checkout (create session + redirect)
- Success page (loads order by Stripe `session_id`)
- Responsive navbar + mobile menu

## Tech Stack
**Frontend**
- React (Vite)
- React Router
- Tailwind CSS

**Backend**
- Node/Express (API)
- Stripe API

## Project Structure

```
src/
components/ UI components (Hero, Navbar, ProductCard, etc.)
pages/ Routes (Index, Cart, Success, Admin)
context/ CartContext
utils/ Variant helpers, formatting
```

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables

Create a .env file in the project root:

### 3) Run frontend

```
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4) Run backend

```
npm run dev
```

## Docker build

For the development

```
docker compose -f docker.compose.dev.yaml up --build
```