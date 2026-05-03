import { navigateTo } from "../../../shared/utils/navigation";

const goShop = () => navigateTo("/shop");
const goHome = () => navigateTo("/");
const goContact = () => navigateTo("/contact");

const stats = [
  { label: "Modules", value: "3", note: "Storefront · Admin · Vendor" },
  { label: "API endpoints", value: "40+", note: "REST, JWT-secured" },
  { label: "Backends", value: "2", note: "Node.js & Spring Boot" },
  { label: "Open source", value: "100%", note: "MIT licensed" },
];

const values = [
  {
    title: "Built end-to-end",
    body: "Frontend, API, database, auth, payments, image pipeline — every layer is implemented, not stubbed.",
  },
  {
    title: "Secure by default",
    body: "JWT auth, bcrypt hashing, Helmet headers, CORS allowlist, rate limiting, and validated inputs at every boundary.",
  },
  {
    title: "Production patterns",
    body: "DTOs, layered architecture, central error handling, response compression, and seedable demo data.",
  },
  {
    title: "Two stacks, one domain",
    body: "Identical product, two implementations — Node/MongoDB and Spring/MySQL — to compare ecosystems side-by-side.",
  },
];

const milestones = [
  { phase: "v0.1", title: "Storefront MVP", body: "Catalogue, cart, checkout, JWT auth on Express + MongoDB." },
  { phase: "v0.2", title: "Admin console", body: "Product/inventory/order management with role-guarded routes." },
  { phase: "v0.3", title: "Vendor portal", body: "Multi-vendor catalogue isolation and inventory ownership." },
  { phase: "v0.4", title: "Spring Boot port", body: "Same domain re-implemented on Spring + MySQL + Redis." },
  { phase: "v0.5", title: "Microservices", body: "API Gateway, product/order/inventory/payment split, Kafka events." },
  { phase: "v1.0", title: "Production deploy", body: "Vercel + Render + Atlas + Cloudinary, all on free tiers." },
];

const team = [
  {
    role: "Engineering",
    body: "Designed the data model, API contracts, security layers, and dual backend implementations.",
  },
  {
    role: "Design",
    body: "Crafted the storefront, admin, and vendor experiences with Tailwind and a consistent design system.",
  },
  {
    role: "DevOps",
    body: "Wired Render Blueprint deploys, Vercel previews, Atlas, Cloudinary, and CI for every push.",
  },
];

const AboutPage = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#e6eafc] bg-white px-6 py-4">
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-2 text-base font-bold tracking-tight text-[#2b3869]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">FS</span>
            FullStack Commerce
          </button>
          <nav className="hidden gap-5 text-sm text-[#5f6a96] sm:flex">
            <a href="/" className="hover:text-[#2b3869]">Home</a>
            <a href="/shop" className="hover:text-[#2b3869]">Store</a>
            <a href="/about" className="font-semibold text-[#2b3869]">About</a>
            <a href="/contact" className="hover:text-[#2b3869]">Contact</a>
          </nav>
          <button
            type="button"
            onClick={goShop}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Browse Store
          </button>
        </header>

        <main className="space-y-10 bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-10">
          {/* Hero */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-8 shadow-sm md:p-12">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 uppercase">
              About the project
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#1f2a4d] md:text-5xl">
              An e-commerce platform built to{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                show how the whole stack fits together.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5f6a96]">
              FullStack Commerce is a learning-oriented but production-grade e-commerce reference app.
              It demonstrates how a real product is structured: a React storefront, an admin console,
              a vendor portal, a JWT-secured API, a layered data tier, and a deploy pipeline that runs
              entirely on free-tier cloud services.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={goShop}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                Try the demo
              </button>
              <button
                type="button"
                onClick={goContact}
                className="rounded-xl border border-[#c9d2f4] px-5 py-2.5 text-sm font-semibold text-[#2b3869] hover:border-indigo-400"
              >
                Get in touch
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[#dfe5fb] bg-white p-5 text-center shadow-sm"
              >
                <div className="text-3xl font-extrabold text-indigo-600">{s.value}</div>
                <div className="mt-1 text-sm font-semibold text-[#2b3869]">{s.label}</div>
                <div className="mt-1 text-xs text-[#7a82a8]">{s.note}</div>
              </div>
            ))}
          </section>

          {/* Story + Mission */}
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1f2a4d]">Our story</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5f6a96]">
                The project began as an answer to a simple question: what does it actually take to
                build and ship a real e-commerce product? Tutorials usually skip the boring parts —
                auth flows, role separation, image hosting, deploy configs, CORS, rate limits.
                FullStack Commerce was built to keep all of that visible and explainable.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#5f6a96]">
                It grew from a single Express + MongoDB backend into a dual-stack reference, with a
                Spring Boot port and a microservices variant on the way, so the same domain can be
                studied in three different architectures.
              </p>
            </article>

            <article className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1f2a4d]">Mission &amp; vision</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#5f6a96]">
                <p>
                  <span className="font-semibold text-[#2b3869]">Mission: </span>
                  Make the path from "tutorial code" to "shipped product" obvious — by showing every
                  seam, every decision, and every configuration in one working app.
                </p>
                <p>
                  <span className="font-semibold text-[#2b3869]">Vision: </span>
                  A reference implementation that engineers can read, fork, and adapt for their own
                  full-stack work — without hidden magic.
                </p>
              </div>
            </article>
          </section>

          {/* Values */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-[#1f2a4d]">What we value</h2>
            <p className="mt-2 text-sm text-[#5f6a96]">
              Four principles guide every feature, refactor, and deploy decision.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-[#e6eafc] bg-[#f8f9ff] p-5"
                >
                  <h3 className="text-base font-bold text-[#2b3869]">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5f6a96]">{v.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-[#1f2a4d]">How it grew</h2>
            <p className="mt-2 text-sm text-[#5f6a96]">
              The project shipped in versioned milestones — each one adding a new layer of realism.
            </p>
            <ol className="mt-6 space-y-4">
              {milestones.map((m) => (
                <li key={m.phase} className="flex gap-4">
                  <div className="flex-none">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {m.phase}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2b3869]">{m.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#5f6a96]">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Team */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-[#1f2a4d]">The team behind it</h2>
            <p className="mt-2 text-sm text-[#5f6a96]">
              A small cross-functional effort that owned every layer of the product.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {team.map((t) => (
                <div
                  key={t.role}
                  className="rounded-xl border border-[#e6eafc] bg-[#f8f9ff] p-5"
                >
                  <h3 className="text-sm font-semibold tracking-wider text-indigo-700 uppercase">
                    {t.role}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6a96]">{t.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-[#1f2a4d]">Tech we run on</h2>
            <p className="mt-2 text-sm text-[#5f6a96]">
              Modern, well-supported, and free to host at this scale.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "React 19",
                "Vite 7",
                "TypeScript",
                "Tailwind CSS",
                "TanStack Query",
                "Node.js 20",
                "Express",
                "Mongoose",
                "MongoDB Atlas",
                "JWT",
                "bcrypt",
                "Helmet",
                "Cloudinary",
                "Redis",
                "Spring Boot 3.3",
                "MySQL",
                "Render",
                "Vercel",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-8 text-center text-white shadow-sm md:p-10">
            <h2 className="text-2xl font-bold">Ready to look around?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/90">
              The store is pre-seeded with demo accounts. Sign in, place an order, then peek at the
              admin console — everything is wired up end-to-end.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={goShop}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Open the store
              </button>
              <button
                type="button"
                onClick={goContact}
                className="rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contact us
              </button>
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6eafc] bg-white px-6 py-4 text-xs text-[#7a82a8]">
          <div>© FullStack Commerce — built to be read, forked, and shipped.</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-[#2b3869]">Privacy</a>
            <a href="/terms" className="hover:text-[#2b3869]">Terms</a>
            <a href="/contact" className="hover:text-[#2b3869]">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
