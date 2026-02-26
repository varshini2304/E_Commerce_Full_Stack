import { lazy, Suspense, useMemo } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const OrderSuccessPage = () => {
  const { data, isLoading, isError } = useHomeData();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-900">
          {UI_MESSAGES.genericErrorTitle}
        </h1>
        <p className="mt-2 text-sm text-red-700">
          {UI_MESSAGES.genericErrorDescription}
        </p>
      </section>
    );
  }

  const orderItems = useMemo(
    () => [...(data.featuredProducts ?? []), ...(data.trendingProducts ?? [])].slice(0, 3),
    [data.featuredProducts, data.trendingProducts],
  );

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const currency = orderItems[0]?.currency ?? APP_CONFIG.defaultCurrency;
  const orderId = data.promoBanner?.badge?.replace(/\s/g, "") || "123456";

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <div className="border-y border-[#eceffd] bg-[#f5f6fe] px-6 py-4 text-sm text-[#6a75a1]">
          <p>
            Home <span className="mx-2">&gt;</span>
            <span className="font-medium text-[#253267]">Order Success</span>
          </p>
        </div>

        <main className="space-y-6 bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_50%,#e8eafd)] p-6 md:p-8">
          <section className="rounded-3xl border border-[#e2e7fb] bg-white/90 px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#b6e0c5]">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
                <path
                  d="m5 13 4 4 10-10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-semibold text-[#273466]">Thank you for your order!</h1>
            <p className="mx-auto mt-3 max-w-2xl text-2xl text-[#5a658f]">
              Your order <span className="font-semibold text-[#2a3768]">#{orderId}</span> has
              been successfully placed. You will receive an email confirmation shortly.
            </p>
            <button
              className="mt-6 h-14 min-w-[300px] rounded-xl bg-gradient-to-r from-[#3c58be] to-[#4d6dd9] px-8 text-3xl font-semibold text-white"
              type="button"
            >
              Track Order
            </button>
          </section>

          <section className="rounded-3xl border border-[#e2e7fb] bg-white/90">
            <header className="border-b border-[#eceffc] px-6 py-5">
              <h2 className="text-4xl font-semibold text-[#273466]">Order Summary</h2>
            </header>

            <div className="px-4 py-2 sm:px-6">
              {orderItems.map((item) => (
                <article
                  className="grid grid-cols-[72px_1fr_auto_auto] items-center gap-3 border-b border-[#edf0fb] py-4"
                  key={item.id}
                >
                  <img
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    loading="lazy"
                    src={item.imageUrl}
                  />
                  <div>
                    <h3 className="text-2xl font-medium text-[#2c396a]">{item.name}</h3>
                    <p className="text-2xl text-[#ef6050]">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                  <p className="text-2xl font-medium text-[#2c396a]">
                    {formatPrice(item.price, item.currency)}
                  </p>
                  <p className="text-2xl text-[#7480a9]">x 1</p>
                </article>
              ))}

              <div className="flex items-center justify-end gap-8 py-4">
                <span className="text-2xl text-[#6c779f]">Subtotal</span>
                <span className="text-4xl font-semibold text-[#273466]">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#eceffc] p-6 text-center">
              <button
                className="h-12 min-w-[280px] rounded-xl bg-gradient-to-r from-[#f67e73] to-[#ed6d5f] px-8 text-3xl font-medium text-white"
                type="button"
              >
                Continue Shopping
              </button>
            </div>
          </section>
        </main>

        {data.footer ? (
          <Suspense fallback={<SectionSkeleton cards={1} />}>
            <SiteFooter data={data.footer} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
