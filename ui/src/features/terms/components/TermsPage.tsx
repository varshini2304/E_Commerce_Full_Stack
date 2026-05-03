import { lazy, Suspense, useEffect, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import Loader from "./Loader";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: [
      "By creating an account on FullStack Commerce or using the storefront, you agree to these Terms. If you do not agree, please do not use the service.",
      "These Terms apply to customers, vendors, and admins. Some sections only apply to vendors — they are clearly labelled below.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts and access",
    body: [
      "You are responsible for keeping your password safe. Don't share your account.",
      "We may suspend or terminate accounts that violate these Terms or attempt to abuse the service.",
      "You must be at least 13 years old to use the service. If you are under 18, use it under the guidance of a parent or guardian.",
    ],
  },
  {
    id: "orders",
    title: "Orders and payments",
    body: [
      "Placing an order is an offer to buy. The order is accepted when we send a confirmation.",
      "Prices and stock are shown live but can change. If a product becomes unavailable, we'll notify you and refund any payment.",
      "Payments in the demo are simulated. No real card data is captured or stored.",
    ],
  },
  {
    id: "shipping-returns",
    title: "Shipping and returns",
    body: [
      "Shipping times shown at checkout are estimates, not guarantees.",
      "If a product arrives damaged or wrong, contact support within 7 days for a replacement or refund.",
      "Some categories (perishables, custom orders) are non-returnable — this is flagged on the product page.",
    ],
  },
  {
    id: "vendors",
    title: "Vendor obligations",
    body: [
      "Vendors must own or have rights to every product they list. Counterfeit or restricted items are removed without notice.",
      "Vendors are responsible for accurate stock counts, prices, and shipping commitments on their own products.",
      "Customer disputes go through platform support first; the vendor agrees to cooperate with resolution.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      "Don't attempt to break, scrape, or overload the service.",
      "Don't try to access accounts that aren't yours, or bypass authorization.",
      "Don't upload malware, illegal content, or content that infringes on others' rights.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: [
      "The codebase, design, and brand of FullStack Commerce belong to the project and its contributors. The code is open-source under the MIT license — see the repository for details.",
      "Vendor product content (images, descriptions) remains owned by the vendor; the platform receives a license to display it.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: [
      "The demo is provided 'as is' without warranties of any kind.",
      "To the extent permitted by law, the project, contributors, and host providers are not liable for indirect or consequential damages arising from use of the service.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these Terms from time to time. Material changes will be highlighted on the homepage and on this page's Last updated date.",
      "Your continued use after a change means you accept the updated Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    body: [
      "Questions about these Terms? Email legal@fullstackcommerce.dev or use the Contact page form.",
    ],
  },
];

const TermsPage = () => {
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
          <h1 className="mt-4 text-3xl font-bold text-[#1f2a4d] md:text-4xl">Terms &amp; Conditions</h1>
          <p className="mt-2 text-sm text-[#69749f]">
            Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5f6a96]">
            The rules of using the FullStack Commerce demo, written in plain English.
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

export default TermsPage;
