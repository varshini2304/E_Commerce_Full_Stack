import { lazy, Suspense, useMemo } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { useProfileData } from "../../profile/hooks/useProfileData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";
import { ProductData } from "../../../types/home";
import { navigateTo } from "../../../shared/utils/navigation";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

interface OrderRow {
  id: string;
  status: OrderStatus;
  items: ProductData[];
}

const statusClassMap: Record<OrderStatus, string> = {
  Delivered: "bg-[#abd8b6] text-[#2d6f3f]",
  Processing: "bg-[#f7cc7f] text-[#99630c]",
  Shipped: "bg-[#f7cc7f] text-[#99630c]",
  Cancelled: "bg-[#c2c8de] text-[#4c577f]",
};

const sidebarItems = [
  { label: "My Orders", active: true },
  { label: "Wishlist", active: false },
  { label: "Addresses", active: false },
  { label: "Account Settings", active: false },
  { label: "Logout", active: false, danger: true },
] as const;

const MyOrdersPage = () => {
  const { data, isLoading, isError } = useHomeData();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfileData();

  if (isLoading || isProfileLoading) {
    return <Loader />;
  }

  if (isError || isProfileError || !data || !profileData) {
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

  const orders: OrderRow[] = useMemo(() => {
    const statusMap: Record<string, OrderStatus> = {
      delivered: "Delivered",
      processing: "Processing",
      shipped: "Shipped",
      cancelled: "Cancelled",
      pending: "Processing",
    };

    return profileData.orders.map((order) => ({
      id: String(order.id),
      status: statusMap[order.status] ?? "Processing",
      items: order.items.map((item) => ({
        id: `${order.id}-${item.productId}`,
        name: item.name,
        description: item.name,
        imageUrl: item.thumbnail,
        price: item.price,
        currency: APP_CONFIG.defaultCurrency,
      })),
    }));
  }, [profileData.orders]);

  const userName = profileData.user.name;
  const userEmail = profileData.user.email;

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <div className="border-y border-[#eceffd] bg-[#f5f6fe] px-6 py-4 text-sm text-[#6a75a1]" />

        <main className="bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_50%,#e8eafd)] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-2xl border border-[#e2e7fb] bg-white/90 p-4 shadow-sm">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-[#d9dff8]">
                  <img
                    alt={userName}
                    className="h-full w-full object-cover"
                    src={profileData.user.avatarUrl}
                  />
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[#253267]">{userName}</h2>
                <p className="mt-1 text-sm text-[#727ca4]">{userEmail}</p>
              </div>
              <nav className="mt-5 space-y-1 border-t border-[#eceffd] pt-3">
                {sidebarItems.map((item) => (
                  <button
                    className={`w-full rounded-lg px-4 py-3 text-left text-lg ${
                      item.active
                        ? "bg-[#e9edff] text-[#334794]"
                        : item.danger
                          ? "text-[#ee6a5c]"
                          : "text-[#5c678f] hover:bg-[#f4f6ff]"
                    }`}
                    key={item.label}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="space-y-4">
              <header className="rounded-2xl border border-[#e2e7fb] bg-white/85 px-6 py-4">
                <h1 className="text-4xl font-semibold text-[#253267]">My Orders</h1>
                <div className="mt-3 inline-flex rounded-xl border border-[#d7ddf8] bg-white px-5 py-2 text-[#5f6b95]">
                  All Orders
                </div>
              </header>

              {orders.map((order) => {
                const total = order.items.reduce((sum, item) => sum + item.price, 0);
                const currency = order.items[0]?.currency ?? APP_CONFIG.defaultCurrency;

                return (
                  <article
                    className="overflow-hidden rounded-2xl border border-[#dde3fb] bg-white/90"
                    key={order.id}
                  >
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#edf0fe] to-[#e4e8fd] px-6 py-3">
                      <h3 className="text-2xl font-semibold text-[#2c396a]">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold ${statusClassMap[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="px-4 py-2 sm:px-6">
                      {order.items.map((item) => (
                        <div
                          className="grid grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-[#edf0fb] py-3"
                          key={item.id}
                        >
                          <img
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover"
                            loading="lazy"
                            src={item.imageUrl}
                          />
                          <div>
                            <p className="text-lg font-medium text-[#2d3a6b]">{item.name}</p>
                            <p className="text-lg text-[#55608c]">
                              {formatPrice(item.price, item.currency)}
                            </p>
                          </div>
                          <p className="text-2xl font-semibold text-[#2b3869]">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                      ))}

                      <div className="flex flex-wrap items-center justify-end gap-3 py-3">
                        <span className="text-2xl text-[#66719a]">Total</span>
                        <span className="text-4xl font-semibold text-[#2b3869]">
                          {formatPrice(total, currency)}
                        </span>
                        <button
                          className="ml-4 h-10 rounded-lg bg-[#4562c8] px-6 text-lg font-semibold text-white"
                          onClick={() => navigateTo(`/orders/${order.id}`)}
                          type="button"
                        >
                          {order.status === "Cancelled" ? "View Details" : "Track Order"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
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

export default MyOrdersPage;
