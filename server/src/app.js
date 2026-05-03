import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.RATE_LIMIT_MAX || "200", 10),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
    data: { status: "healthy" },
  });
});

app.get("/", (_req, res) => {
  res.type("html").status(200).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Full Stack E-Commerce API</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b1020;color:#e6e8f2;line-height:1.6}
    .wrap{max-width:880px;margin:0 auto;padding:48px 24px}
    .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#10b981;color:#0b1020;font-weight:600;font-size:12px;letter-spacing:.5px}
    h1{font-size:32px;margin:18px 0 8px}
    h2{font-size:20px;margin:32px 0 12px;border-bottom:1px solid #1f2747;padding-bottom:8px}
    p,li{font-size:15px;color:#c4c8de}
    code{background:#1a2040;padding:2px 6px;border-radius:4px;font-size:13px;color:#a5e7c8}
    a{color:#7aa9ff;text-decoration:none}
    a:hover{text-decoration:underline}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0}
    .card{background:#121736;border:1px solid #1f2747;border-radius:10px;padding:14px}
    .card h3{margin:0 0 6px;font-size:14px;color:#9fb4ff}
    .card p{margin:0;font-size:13px}
    table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px}
    th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #1f2747}
    th{color:#9fb4ff;font-weight:600}
    .pill{display:inline-block;background:#1a2040;color:#a5e7c8;padding:2px 8px;border-radius:4px;font-size:12px;font-family:monospace}
    .footer{margin-top:48px;padding-top:24px;border-top:1px solid #1f2747;color:#7a82a8;font-size:13px}
  </style>
</head>
<body>
  <div class="wrap">
    <span class="badge">API ONLINE</span>
    <h1>Full Stack E-Commerce API</h1>
    <p>Node.js + Express backend powering the storefront, vendor, and admin experiences. JWT-secured, MongoDB-backed, deployed on Render.</p>

    <h2>Quick Links</h2>
    <ul>
      <li><a href="/health">/health</a> — health check (JSON)</li>
      <li><a href="/api/products">/api/products</a> — public product listing</li>
      <li><a href="/api/categories">/api/categories</a> — public category listing</li>
    </ul>

    <h2>How It Works</h2>
    <p>The frontend (React + Vite) calls this API over HTTPS. The API authenticates users with JWT, validates input, queries MongoDB, caches frequent reads in Redis (optional), and serves images via Cloudinary.</p>

    <h2>Security</h2>
    <div class="grid">
      <div class="card"><h3>JWT auth</h3><p>Stateless tokens signed with a server-side secret. Required for protected routes.</p></div>
      <div class="card"><h3>bcrypt</h3><p>Passwords hashed with salted bcrypt — never stored in plaintext.</p></div>
      <div class="card"><h3>Helmet</h3><p>Sets secure HTTP headers (CSP, HSTS, X-Frame-Options).</p></div>
      <div class="card"><h3>CORS</h3><p>Locked to the configured frontend origin only.</p></div>
      <div class="card"><h3>Rate limiting</h3><p>200 requests / 15 min per IP on <code>/api</code> to deter abuse.</p></div>
      <div class="card"><h3>Input validation</h3><p>express-validator on every write endpoint to block malformed payloads.</p></div>
    </div>

    <h2>Key Endpoints</h2>
    <table>
      <tr><th>Method</th><th>Path</th><th>Purpose</th></tr>
      <tr><td><span class="pill">POST</span></td><td>/api/auth/register</td><td>Create a customer account</td></tr>
      <tr><td><span class="pill">POST</span></td><td>/api/auth/login</td><td>Get a JWT</td></tr>
      <tr><td><span class="pill">GET</span></td><td>/api/products</td><td>List products (public)</td></tr>
      <tr><td><span class="pill">POST</span></td><td>/api/cart</td><td>Add to cart (auth)</td></tr>
      <tr><td><span class="pill">POST</span></td><td>/api/orders</td><td>Place an order (auth)</td></tr>
      <tr><td><span class="pill">POST</span></td><td>/api/payments</td><td>Create + verify payment (auth)</td></tr>
    </table>

    <h2>How To Use</h2>
    <ol>
      <li>Open the frontend (your deployed UI URL).</li>
      <li>Sign in as a seeded user — for example <code>customer1@example.com</code> / <code>Password@123</code>.</li>
      <li>Browse products, add to cart, place an order.</li>
      <li>Try the admin panel at <code>/admin/login</code> with <code>admin@example.com</code> / <code>Password@123</code>.</li>
      <li>Or hit endpoints directly with curl / Postman using the JWT from <code>/api/auth/login</code>.</li>
    </ol>

    <div class="footer">
      Backend: Node.js 20 · Express · MongoDB Atlas · Cloudinary &nbsp;|&nbsp; <a href="/health">Health</a>
    </div>
  </div>
</body>
</html>`);
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
