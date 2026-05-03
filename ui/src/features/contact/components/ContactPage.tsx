import { lazy, Suspense, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import Loader from "./Loader";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const contactInfo = {
  address: "12 Tech Park Drive, Bengaluru, KA 560103, India",
  email: "support@fullstackcommerce.dev",
  phone: "+91 80 4000 1234",
  hours: "Mon — Fri · 9:00 AM to 6:00 PM IST",
};

const channels = [
  {
    title: "Customer support",
    body: "Order issues, refunds, delivery questions. Average response under 4 hours on weekdays.",
    cta: "support@fullstackcommerce.dev",
    href: "mailto:support@fullstackcommerce.dev",
  },
  {
    title: "Vendor onboarding",
    body: "Want to sell on the platform? Tell us about your store and we'll send onboarding steps.",
    cta: "vendors@fullstackcommerce.dev",
    href: "mailto:vendors@fullstackcommerce.dev",
  },
  {
    title: "Press & partnerships",
    body: "Media kits, speaking engagements, integration proposals. We aim to reply within two business days.",
    cta: "hello@fullstackcommerce.dev",
    href: "mailto:hello@fullstackcommerce.dev",
  },
];

const ContactPage = () => {
  const { data: homeData } = useHomeData();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData?.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      <main className="space-y-8 px-6 py-10 sm:px-8 lg:px-12">
        {/* Hero */}
        <section className="rounded-2xl border border-[#dfe5fb] bg-white p-8 shadow-sm md:p-12">
          <span className="inline-block rounded-full bg-[#e9edff] px-3 py-1 text-xs font-semibold tracking-wider text-[#334794] uppercase">
            Get in touch
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#1f2a4d] md:text-4xl">We&apos;d love to hear from you</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5f6a96] md:text-base">
            Whether you&apos;re a customer, a vendor, a partner, or just curious about how the project
            works — pick the channel that fits and we&apos;ll route your message to the right person.
          </p>
        </section>

        {/* Channels */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-bold text-[#2b3869]">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5f6a96]">{c.body}</p>
              <a
                href={c.href}
                className="mt-4 inline-block text-sm font-semibold text-[#1f4690] hover:underline"
              >
                {c.cta} →
              </a>
            </article>
          ))}
        </section>

        {/* Form + Info */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-[#1f2a4d]">Send us a message</h2>
            <p className="mt-1 text-sm text-[#5f6a96]">
              Fill out the form and we&apos;ll get back to you as soon as we can.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-base font-bold text-emerald-800">Message received</h3>
                <p className="mt-1 text-sm text-emerald-700">
                  Thanks for reaching out. We&apos;ll be in touch shortly. (Demo only — nothing was actually sent.)
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-[#2b3869]">Name</span>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="mt-1 w-full rounded-md border border-[#dbe1fb] bg-white px-3 py-2 text-sm text-[#2b3869] placeholder-[#9ba6cc] focus:border-[#4562c8] focus:outline-none focus:ring-1 focus:ring-[#4562c8]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-[#2b3869]">Email</span>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-md border border-[#dbe1fb] bg-white px-3 py-2 text-sm text-[#2b3869] placeholder-[#9ba6cc] focus:border-[#4562c8] focus:outline-none focus:ring-1 focus:ring-[#4562c8]"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-semibold text-[#2b3869]">Subject</span>
                  <input
                    type="text"
                    required
                    placeholder="What is this about?"
                    className="mt-1 w-full rounded-md border border-[#dbe1fb] bg-white px-3 py-2 text-sm text-[#2b3869] placeholder-[#9ba6cc] focus:border-[#4562c8] focus:outline-none focus:ring-1 focus:ring-[#4562c8]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-[#2b3869]">Message</span>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us a bit more…"
                    className="mt-1 w-full rounded-md border border-[#dbe1fb] bg-white px-3 py-2 text-sm text-[#2b3869] placeholder-[#9ba6cc] focus:border-[#4562c8] focus:outline-none focus:ring-1 focus:ring-[#4562c8]"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-md bg-[#1f4690] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a3a75]"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#1f2a4d]">Office</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5f6a96]">{contactInfo.address}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7a82a8]">Email</dt>
                  <dd className="font-medium text-[#2b3869]">{contactInfo.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7a82a8]">Phone</dt>
                  <dd className="font-medium text-[#2b3869]">{contactInfo.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#7a82a8]">Hours</dt>
                  <dd className="font-medium text-[#2b3869]">{contactInfo.hours}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#1f2a4d]">Follow along</h2>
              <p className="mt-2 text-sm text-[#5f6a96]">
                We share build updates and behind-the-scenes notes on our socials.
              </p>
              <div className="mt-4 flex gap-2">
                {["Twitter", "GitHub", "LinkedIn", "RSS"].map((label) => (
                  <span
                    key={label}
                    className="rounded-md bg-[#f4f6ff] px-2.5 py-1 text-xs font-medium text-[#334794]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-[#1f2a4d]">Quick answers</h2>
          <p className="mt-1 text-sm text-[#5f6a96]">A few things people ask before reaching out.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "How fast do you reply?",
                a: "Usually within 4 hours on weekdays, 24 hours on weekends.",
              },
              {
                q: "Where can I track my order?",
                a: "Sign in and visit My Orders. Each order has a status and a tracking link.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes, to 30+ countries. Shipping costs are calculated at checkout.",
              },
              {
                q: "Can I become a vendor?",
                a: "Absolutely. Open the Vendor Portal from the landing page or email vendors@…",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-[#e6eafc] bg-[#f8f9ff] p-4">
                <h3 className="text-sm font-bold text-[#2b3869]">{item.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5f6a96]">{item.a}</p>
              </div>
            ))}
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

export default ContactPage;
