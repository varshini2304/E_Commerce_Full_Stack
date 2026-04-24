# Backend Setup

## 1. Install

```bash
cd server
npm install
```

## 2. Configure env

Copy `.env.example` to `.env` and set:

- `PORT` (optional, default `8080`)
- `MONGO_URI`
- `JWT_SECRET`
- `REDIS_URL` (optional but recommended for caching)
- `CLOUDINARY_URL` (or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

## 3. Seed data

```bash
npm run seed
```

Default seeded login password: `Password@123`

## 4. Run API

```bash
npm run dev
```

Base URL: `http://localhost:8080/api`

## 5. Docker

Build image locally:

```bash
docker build -t ecommerce-api .
```

Run container locally:

```bash
docker run --env-file .env -p 8080:8080 ecommerce-api
```

## 6. Google Cloud Run Deployment

From the `server/` directory:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ecommerce-api
gcloud run deploy ecommerce-api --image gcr.io/YOUR_PROJECT_ID/ecommerce-api --platform managed --region asia-south1 --allow-unauthenticated
```

Recommended Cloud Run settings:

- CPU: `1`
- Memory: `512Mi`
- Min instances: `0`
- Max instances: `1` (free-tier safe)
- Request timeout: `300s`

## 7. Production Features Added

- Cloud Run-compatible dynamic port (`process.env.PORT || 8080`)
- Dockerfile + `.dockerignore`
- Redis caching for home and product read APIs
- Cache invalidation on product writes and review updates
- Security middleware: `helmet`, API rate limiter, compression
- Request logging via `morgan`

## 8. Manual Setup Still Required

- Create MongoDB Atlas cluster and set correct `MONGO_URI`
- Create Redis instance (Upstash/Redis Cloud) and set `REDIS_URL`
- Create Cloudinary account and set Cloudinary envs
- Add all env vars to Cloud Run service variables (not only local `.env`)
- Restrict CORS `CLIENT_ORIGIN` to your frontend production domain
- Configure CI/CD (optional) for auto-deploy on push

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
