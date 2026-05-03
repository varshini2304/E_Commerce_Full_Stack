# Deploy On Render (Node API + React Frontend)

## 1) Push code to GitHub
Render will deploy from your Git repository.

## 2) Create services from blueprint
In Render dashboard:

1. New `+` -> `Blueprint`
2. Select this repository
3. Render will detect `render.yaml` and create:
   - `fullstack-api` (Node backend)
   - `fullstack-ui` (Static frontend)

## 3) Set backend environment variables (`fullstack-api`)
Add these values in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (set this to your frontend Render URL, for example `https://fullstack-ui.onrender.com`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:
- `REDIS_URL` (if you use Redis caching in production)

## 4) Deploy backend first
After first deploy, copy backend URL, for example:
- `https://fullstack-api.onrender.com`

Health check:
- `https://fullstack-api.onrender.com/health`

## 5) Set frontend environment variable (`fullstack-ui`)
In frontend service env vars:

- `VITE_API_BASE_URL=https://fullstack-api.onrender.com`

Redeploy frontend after updating env vars.

## 6) Verify app
- Open frontend URL
- Test login, product listing, cart, order flows
- Check browser console for CORS/network errors

## Common fixes
- CORS error: confirm backend `CLIENT_ORIGIN` exactly matches frontend URL.
- `401` or auth issues: confirm `JWT_SECRET` is set.
- API not reachable: confirm `VITE_API_BASE_URL` points to backend URL and frontend is redeployed.
