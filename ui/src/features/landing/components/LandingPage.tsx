import { navigateTo } from "../../../shared/utils/navigation";

const goShop = () => navigateTo("/shop");
const goAdmin = () => navigateTo("/admin/login");
const goVendor = () => navigateTo("/vendor/login");

const stack = [
  { area: "Frontend", items: ["React 19", "Vite 7", "TypeScript", "Tailwind", "TanStack Query"] },
  { area: "Backend", items: ["Node 20", "Express 4", "Mongoose", "JWT", "Helmet", "express-validator"] },
  { area: "Data", items: ["MongoDB Atlas", "Redis (opt)", "Cloudinary"] },
  { area: "Hosting", items: ["Vercel", "Render", "MongoDB Atlas free tier"] },
];

const security = [
  { t: "JWT auth", b: "Stateless tokens, signed server-side." },
  { t: "bcrypt", b: "Salted password hashes, never returned." },
  { t: "Helmet", b: "Strict HTTP security headers." },
  { t: "CORS allowlist", b: "Origin restricted to the deployed UI." },
  { t: "Rate limit", b: "200 req / 15 min per IP on /api." },
  { t: "Validation", b: "express-validator on every write route." },
];

const useCases = [
  { who: "Customer", how: "customer1@example.com / Password@123", btn: "Open store", action: goShop },
  { who: "Admin", how: "admin@example.com / Password@123", btn: "Open admin", action: goAdmin },
  { who: "Vendor", how: "vendor1@example.com / Vendor@123", btn: "Open vendor", action: goVendor },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-500 text-xs text-slate-950">FS</span>
            <span>fullstack-commerce</span>
          </div>
          <nav className="hidden gap-6 text-xs text-slate-400 sm:flex">
            <a href="#how" className="hover:text-slate-100">how it works</a>
            <a href="#stack" className="hover:text-slate-100">stack</a>
            <a href="#security" className="hover:text-slate-100">security</a>
            <a href="#try" className="hover:text-slate-100">try it</a>
          </nav>
          <button
            type="button"
            onClick={goShop}
            className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-indigo-400"
          >
            Enter store →
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="font-mono text-xs text-indigo-400">// e-commerce reference app</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            A storefront, an admin console, and a vendor portal —{" "}
            <span className="text-indigo-400">wired end-to-end.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            React frontend. JWT-secured Node API. MongoDB Atlas. Cloudinary image pipeline.
            Deployed on Vercel + Render free tiers. No fluff, no half-stubs — every flow works.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goShop}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-400"
            >
              Browse the store
            </button>
            <button
              type="button"
              onClick={goAdmin}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Admin login
            </button>
            <button
              type="button"
              onClick={goVendor}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Vendor portal
            </button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-12 sm:px-8 lg:px-12">
        <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">// modules</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Storefront", b: "Catalogue, search, cart, wishlist, checkout, order tracking." },
            { t: "Admin console", b: "Products, inventory, banners, orders. Role-guarded." },
            { t: "Vendor portal", b: "Vendors manage their own catalogue and inventory." },
          ].map((m) => (
            <div key={m.t} className="rounded-md border border-slate-800 bg-slate-900 p-4">
              <h3 className="text-sm font-semibold text-slate-100">{m.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{m.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-slate-800 px-6 py-14 sm:px-8 lg:px-12">
        <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">// how a request flows</h2>
        <pre className="mt-5 overflow-x-auto rounded-md border border-slate-800 bg-slate-900/60 p-4 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
{`Browser  ─►  Vercel CDN  ─►  Render API  ─►  MongoDB Atlas
   │            React app      Express + JWT     Cloud DB
   │            cached         Helmet + rate     indexed
   └───── token in localStorage  limit + CORS    queries
                                      │
                                      ▼
                                 Cloudinary  (image CDN)`}
        </pre>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "UI", b: "React Query fires request with JWT." },
            { n: "02", t: "Edge", b: "Helmet, CORS, rate limit run first." },
            { n: "03", t: "Auth", b: "Token verified, body validated." },
            { n: "04", t: "Data", b: "Mongoose query, optional Redis cache." },
          ].map((s) => (
            <li key={s.n} className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
              <div className="font-mono text-xs text-indigo-400">{s.n}</div>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">{s.t}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Stack */}
      <section id="stack" className="border-t border-slate-800 bg-slate-900/40 px-6 py-14 sm:px-8 lg:px-12">
        <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">// stack</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((g) => (
            <div key={g.area} className="rounded-md border border-slate-800 bg-slate-900 p-4">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">{g.area}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-200"
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
      <section id="security" className="border-t border-slate-800 px-6 py-14 sm:px-8 lg:px-12">
        <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">// security layers</h2>
        <p className="mt-2 max-w-2xl text-xs text-slate-400 sm:text-sm">
          Each layer catches a different class of attack. A request has to pass every layer before it touches data.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {security.map((c) => (
            <div key={c.t} className="rounded-md border border-slate-800 bg-slate-900/60 p-3">
              <h3 className="font-mono text-xs text-indigo-300">{c.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Try it */}
      <section id="try" className="border-t border-slate-800 bg-slate-900/40 px-6 py-14 sm:px-8 lg:px-12">
        <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">// try it</h2>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
          Demo accounts are seeded. Pick a role and sign in.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {useCases.map((u) => (
            <div key={u.who} className="rounded-md border border-slate-800 bg-slate-900 p-4">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">{u.who}</h3>
              <p className="mt-2 font-mono text-[11px] break-all text-slate-400">{u.how}</p>
              <button
                type="button"
                onClick={u.action}
                className="mt-3 w-full rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-indigo-400"
              >
                {u.btn}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-xs text-slate-500 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono">fullstack-commerce · MIT</span>
          <div className="flex gap-4">
            <a href="/about" className="hover:text-slate-300">about</a>
            <a href="/privacy" className="hover:text-slate-300">privacy</a>
            <a href="/terms" className="hover:text-slate-300">terms</a>
            <a href="/contact" className="hover:text-slate-300">contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
