# Backend Setup

## 1. Install

```bash
cd server
npm install
```

## 2. Configure env

Copy `.env.example` to `.env` and set:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional, default `5000`)

## 3. Seed data

```bash
npm run seed
```

Default seeded login password: `Password@123`

## 4. Run API

```bash
npm run dev
```

Base URL: `http://localhost:5000/api`

## Implemented core endpoints

- `GET /api/home`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin, soft delete)
- `PUT /api/products/:id/stock` (admin)
- `GET /api/cart` (auth)
- `POST /api/cart/add` (auth)
- `PUT /api/cart/update` (auth)
- `DELETE /api/cart/remove/:productId` (auth)
- `POST /api/orders` (auth)
- `GET /api/orders/my` (auth)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `POST /api/payments/create` (auth)
- `POST /api/payments/verify` (auth)
- `POST /api/reviews` (auth)
- `GET /api/auth/profile` (auth)
- `PUT /api/auth/profile` (auth)
- `GET /api/admin/dashboard` (admin)
