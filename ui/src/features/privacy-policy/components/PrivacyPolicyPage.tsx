import { lazy, Suspense, useEffect, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import Loader from "./Loader";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      "FullStack Commerce is a learning-oriented reference application. This Privacy Policy explains what information the demo collects, how it is used, and the choices you have. Because the project is a public showcase, we keep data collection to the minimum needed to make the storefront work.",
      "By using the demo you agree to the practices described here. If you do not agree, please do not create an account.",
    ],
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    body: [
      "Account information: name, email, hashed password, and optional profile fields you choose to provide.",
      "Order information: items you add to cart, delivery address, and order history while signed in.",
      "Vendor information: business name, contact details, and the products a vendor uploads.",
      "Technical information: IP address, browser type, and basic request metadata used to keep the service secure (rate-limit counters and error logs).",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: [
      "To authenticate you and keep your session valid via JWT tokens.",
      "To process orders and display order history in your account.",
      "To prevent abuse — for example, repeated invalid logins are throttled.",
      "To improve the demo through aggregated, non-identifying usage metrics.",
    ],
  },
  {
    id: "what-we-do-not-do",
    title: "What we do not do",
    body: [
      "We do not sell your data. The project is open source and non-commercial.",
      "We do not run advertising trackers or third-party analytics that profile individuals.",
      "We do not store payment card numbers — payment flows are simulated for the demo.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Passwords are hashed with bcrypt before storage and are never returned by any API endpoint.",
      "All traffic is served over HTTPS. The API enforces secure HTTP headers (Helmet), origin allowlist (CORS), and per-IP rate limits.",
      "Database credentials and JWT secrets live only in environment variables — never in source control.",
    ],
  },
  {
    id: "your-choices",
    title: "Your choices",
    body: [
      "You can update or delete your profile at any time from the My Profile page.",
      "You can request full account deletion by contacting support@fullstackcommerce.dev.",
      "Vendors can remove their products and account at any time from the vendor dashboard.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: [
      "We use a single JWT token stored in browser localStorage to keep you signed in. No third-party cookies are set.",
      "Clearing site data signs you out and removes the cart contents stored on your device.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      "If anything material changes, we'll update the Last updated date below and surface a notice on the homepage. Continued use of the demo after a change means you accept the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      "Questions about this policy? Reach out at privacy@fullstackcommerce.dev or use the form on the Contact page.",
    ],
  },
];

const PrivacyPolicyPage = () => {
  const { data: homeData } = useHomeData();
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData?.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      <main className="space-y-6 px-6 py-10 sm:px-8 lg:px-12">
        <header className="rounded-2xl border border-[#dfe5fb] bg-white p-8 shadow-sm md:p-12">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 uppercase">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#1f2a4d] md:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#69749f]">
            Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5f6a96]">
            A short, plain-English summary of what data the demo collects and how we handle it.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <nav className="rounded-2xl border border-[#dfe5fb] bg-white p-4 shadow-sm">
              <p className="px-2 pb-2 text-xs font-semibold tracking-wider text-[#7a82a8] uppercase">
                On this page
              </p>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(s.id)}
                      className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition ${
                        activeId === s.id
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-[#5f6a96] hover:bg-[#f1f3fb]"
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <section className="space-y-8 rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-[#1f2a4d]">{s.title}</h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[#5f6a96]">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      {homeData?.footer ? (
        <Suspense fallback={<Loader />}>
          <SiteFooter data={homeData.footer} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default PrivacyPolicyPage;
