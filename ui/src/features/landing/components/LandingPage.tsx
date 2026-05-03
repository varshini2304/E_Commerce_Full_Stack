import { navigateTo } from "../../../shared/utils/navigation";

const goShop = () => navigateTo("/shop");
const goAdmin = () => navigateTo("/admin/login");
const goVendor = () => navigateTo("/vendor/login");

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-slate-950">FS</span>
          <span>FullStack Commerce</span>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-300 sm:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#stack" className="hover:text-white">Tech</a>
          <a href="#security" className="hover:text-white">Security</a>
          <a href="#use" className="hover:text-white">How to use</a>
        </nav>
        <button
          type="button"
          onClick={goShop}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-400"
        >
          Enter Store →
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 text-center">

        <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
          A complete e-commerce platform,
          <br />
          <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
            built end-to-end.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          A storefront, an admin console, and a vendor portal — wired to a JWT-secured Node.js API,
          MongoDB Atlas, and a Cloudinary image pipeline. Built to demonstrate how a real-world
          SaaS product is architected, secured, and shipped.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={goShop}
            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
          >
            Browse the Store
          </button>
          <button
            type="button"
            onClick={goAdmin}
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-100 hover:border-slate-400"
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={goVendor}
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-100 hover:border-slate-400"
          >
            Vendor Portal
          </button>
        </div>
      </section>

      {/* What it is */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Storefront",
              body: "Browse products, search categories, manage cart and wishlist, and place orders with payment verification.",
            },
            {
              title: "Admin console",
              body: "Manage products, inventory, banners, and order fulfilment. Role-guarded with JWT + admin claim.",
            },
            {
              title: "Vendor portal",
              body: "Vendors add their own catalogue, track inventory, and manage their products in isolation.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur"
            >
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          A typical request flows through a layered architecture. Each layer has a single
          responsibility, which makes the system easier to test, scale, and reason about.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "1",
              title: "React UI",
              body: "User clicks a button. React Query issues a fetch to the API base URL with the JWT in the Authorization header.",
            },
            {
              step: "2",
              title: "Express API",
              body: "Helmet sets secure headers, CORS validates the origin, the rate limiter throttles bursts, then the route handler runs.",
            },
            {
              step: "3",
              title: "Auth & validation",
              body: "JWT middleware verifies the signature and expiry. express-validator rejects malformed bodies before they touch the DB.",
            },
            {
              step: "4",
              title: "MongoDB",
              body: "Mongoose models read/write to MongoDB Atlas. Frequent reads can be cached with Redis. Images go to Cloudinary.",
            },
          ].map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="text-3xl font-extrabold text-indigo-400">{s.step}</div>
              <h3 className="mt-2 text-base font-bold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* ASCII flow */}
        <pre className="mt-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs leading-6 text-slate-300">
          {`  Browser                Vercel CDN              Render API               MongoDB Atlas
  ┌──────┐  HTTPS GET  ┌────────────┐  fetch    ┌──────────────┐  query   ┌────────────┐
  │ User │ ──────────▶ │ React app  │ ────────▶ │ Express API  │ ───────▶ │ Cloud DB   │
  └──────┘   token     └────────────┘   JWT     └──────────────┘  index   └────────────┘
                                                       │
                                                       ▼
                                                 ┌──────────┐
                                                 │Cloudinary│  (image CDN)
                                                 └──────────┘`}
        </pre>
      </section>

      {/* Tech stack */}
      <section id="stack" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Tech stack</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { area: "Frontend", items: ["React 19", "Vite 7", "TypeScript", "Tailwind CSS", "TanStack Query"] },
            { area: "Backend", items: ["Node.js 20", "Express 4", "Mongoose", "JWT", "express-validator", "Helmet"] },
            { area: "Data & infra", items: ["MongoDB Atlas", "Redis (optional)", "Cloudinary", "Render", "Vercel"] },
            { area: "Alt backend", items: ["Java 17", "Spring Boot 3.3", "Spring Security", "JPA / MySQL", "MapStruct"] },
            { area: "DX", items: ["ESLint", "Nodemon", "Vite proxy", "Seed scripts", "Render Blueprint"] },
            { area: "Quality", items: ["Layered architecture", "DTO + validation", "Centralised error handler", "Compression", "Rate limiting"] },
          ].map((g) => (
            <div key={g.area} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">{g.area}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section id="security" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Why it&apos;s secure</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          Security is layered — each control catches a different class of attack. A request has to
          pass every layer before it touches data.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "JWT auth", b: "Stateless tokens signed with a server-side secret. Verified on every protected route." },
            { t: "bcrypt password hashing", b: "Passwords salted + hashed with bcrypt — plaintext never touches disk or logs." },
            { t: "Role-based access", b: "Customer, vendor, and admin scopes enforced server-side, not just hidden in the UI." },
            { t: "Helmet HTTP headers", b: "Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, and CSP defaults." },
            { t: "CORS allowlist", b: "Only the configured frontend origin can call the API with credentials." },
            { t: "Rate limiting", b: "200 requests / 15 min per IP on /api blunts brute-force and scraping." },
            { t: "Input validation", b: "express-validator rejects malformed/oversized payloads before any DB call." },
            { t: "No x-powered-by leak", b: "Server fingerprinting headers stripped to slow down targeted exploits." },
            { t: "Secrets via env vars", b: "JWT secret, DB URI, Cloudinary keys live in Render env vars — never in git." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-base font-bold text-white">{c.t}</h3>
              <p className="mt-1 text-sm text-slate-300">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section id="use" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">How to use it</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          The database is pre-seeded with demo accounts so you can try every flow without signing up.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">Customer</h3>
            <p className="mt-2 text-xs text-slate-400">Email</p>
            <p className="font-mono text-sm text-slate-100">customer1@example.com</p>
            <p className="mt-2 text-xs text-slate-400">Password</p>
            <p className="font-mono text-sm text-slate-100">Password@123</p>
            <button
              type="button"
              onClick={goShop}
              className="mt-4 w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-400"
            >
              Open Store
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">Admin</h3>
            <p className="mt-2 text-xs text-slate-400">Email</p>
            <p className="font-mono text-sm text-slate-100">admin@example.com</p>
            <p className="mt-2 text-xs text-slate-400">Password</p>
            <p className="font-mono text-sm text-slate-100">Password@123</p>
            <button
              type="button"
              onClick={goAdmin}
              className="mt-4 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 hover:border-slate-400"
            >
              Open Admin
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">Vendor</h3>
            <p className="mt-2 text-xs text-slate-400">Sign in flow</p>
            <p className="text-sm text-slate-100">Use any seeded vendor account or register at /vendor/login.</p>
            <button
              type="button"
              onClick={goVendor}
              className="mt-4 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 hover:border-slate-400"
            >
              Open Vendor
            </button>
          </div>
        </div>

        <ol className="mt-10 space-y-3 text-slate-200">
          <li><span className="mr-2 inline-block w-6 text-indigo-400">1.</span>Click <em>Browse the Store</em> to enter the storefront.</li>
          <li><span className="mr-2 inline-block w-6 text-indigo-400">2.</span>Sign in with the customer credentials above.</li>
          <li><span className="mr-2 inline-block w-6 text-indigo-400">3.</span>Pick a category, open a product, add to cart, then checkout.</li>
          <li><span className="mr-2 inline-block w-6 text-indigo-400">4.</span>Track your order under <em>My Orders</em>.</li>
          <li><span className="mr-2 inline-block w-6 text-indigo-400">5.</span>Try the admin panel — manage products, inventory, and order statuses.</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
          <div>Built with React, Express, MongoDB · Deployed on Vercel + Render</div>
          <div className="flex gap-4">
            <a href="/about" className="hover:text-white">About</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
