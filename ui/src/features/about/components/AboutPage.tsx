import { lazy, Suspense } from "react";
import { navigateTo } from "../../../shared/utils/navigation";
import { useHomeData } from "../../home/hooks/useHomeData";
import Loader from "./Loader";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const goShop = () => navigateTo("/shop");
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
  const { data: homeData } = useHomeData();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData?.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      <main className="space-y-10 px-6 py-10 sm:px-8 lg:px-12">
          {/* Hero */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-white p-8 shadow-sm md:p-12">
            <span className="inline-block rounded-full bg-[#e9edff] px-3 py-1 text-xs font-semibold tracking-wider text-[#334794] uppercase">
              About the project
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#1f2a4d] md:text-5xl">
              An e-commerce platform built to{" "}
              <span className="text-[#1f4690]">
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
                className="rounded-md bg-[#1f4690] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a3a75]"
              >
                Try the demo
              </button>
              <button
                type="button"
                onClick={goContact}
                className="rounded-md border border-[#dbe1fb] bg-white px-4 py-2 text-sm font-semibold text-[#2b3869] hover:border-[#c4cdef]"
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
                <div className="text-2xl font-bold text-[#1f4690]">{s.value}</div>
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
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] text-xs font-bold text-[#334794]">
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
                  <h3 className="text-xs font-semibold tracking-wider text-[#334794] uppercase">
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
                  className="rounded-md bg-[#f4f6ff] px-2.5 py-1 text-xs font-medium text-[#334794]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-[#dfe5fb] bg-[#1f4690] p-8 text-center text-white shadow-sm md:p-10">
            <h2 className="text-2xl font-bold">Ready to look around?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/90">
              The store is pre-seeded with demo accounts. Sign in, place an order, then peek at the
              admin console — everything is wired up end-to-end.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={goShop}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1f4690] hover:bg-[#f4f6ff]"
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

      {homeData?.footer ? (
        <Suspense fallback={<Loader />}>
          <SiteFooter data={homeData.footer} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default AboutPage;
