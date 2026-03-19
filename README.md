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
// from the root
cd client
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4) Run backend

```
// from the root
cd server 
npm run dev
```

### Stripe to work locally

```
stripe login
stripe listen --forward-to http://localhost:5050/webhook
```

## Docker build

For the development

```
// REMOVE DOCKER CONTAINER
docker compose -f docker.compose.dev.yaml down
// REBUILD
docker compose -f docker.compose.dev.yaml up --build
```

Check API is running:

```
docker compose -f docker.compose.dev.yaml exec client sh -lc "wget -qS -O- http://server:5050/ 2>&1 | head -n 20"
```

### Docker restart

```
docker compose -f docker.compose.dev.yaml restart
docker compose -f docker.compose.yaml restart

// separately
docker compose -f docker.compose.dev.yaml restart server
docker compose restart mongo
docker compose restart client

// restart Docker itself, engine (Ubuntu)
sudo systemctl restart docker

```

### Docker logs

```
<!-- dev from the root -->
docker compose -f docker.compose.dev.yaml logs -f --tail=200 server
<!-- hosting server live -->
docker logs -f --tail=100 staging-app-1
docker logs staging-app-1 | grep Order
<!-- exec inside container -->
docker exec -it staging-app-1 sh
```