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

const sidebarItems: { label: string; active: boolean; danger?: boolean }[] = [
  { label: "My Orders", active: true },
  { label: "Wishlist", active: false },
  { label: "Addresses", active: false },
  { label: "Account Settings", active: false },
  { label: "Logout", active: false, danger: true },
];

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {data.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={data.navigation} />
        </Suspense>
      ) : null}

      <main className="px-6 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-xl border border-[#e2e7fb] bg-white p-4 shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border border-[#d9dff8]">
                <img
                  alt={userName}
                  className="h-full w-full object-cover"
                  src={profileData.user.avatarUrl}
                />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-[#253267]">{userName}</h2>
              <p className="mt-0.5 text-xs text-[#727ca4]">{userEmail}</p>
            </div>
            <nav className="mt-4 space-y-0.5 border-t border-[#eceffd] pt-3">
              {sidebarItems.map((item) => (
                <button
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    item.active
                      ? "bg-[#e9edff] font-medium text-[#334794]"
                      : item.danger
                        ? "text-[#ee6a5c] hover:bg-[#fdf3f2]"
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

          <section className="space-y-3">
            <header className="rounded-xl border border-[#e2e7fb] bg-white px-5 py-3">
              <h1 className="text-lg font-semibold text-[#253267]">My orders</h1>
              <p className="mt-0.5 text-xs text-[#727ca4]">{orders.length} order(s)</p>
            </header>

            {orders.map((order) => {
              const total = order.items.reduce((sum, item) => sum + item.price, 0);
              const currency = order.items[0]?.currency ?? APP_CONFIG.defaultCurrency;

              return (
                <article
                  className="overflow-hidden rounded-xl border border-[#dde3fb] bg-white"
                  key={order.id}
                >
                  <div className="flex items-center justify-between border-b border-[#edf0fb] px-5 py-2.5">
                    <h3 className="font-mono text-xs text-[#5f6b95]">
                      #{order.id}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClassMap[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="px-5 py-2">
                    {order.items.map((item) => (
                      <div
                        className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-[#edf0fb] py-2.5 last:border-0"
                        key={item.id}
                      >
                        <img
                          alt={item.name}
                          className="h-10 w-10 rounded-md object-cover"
                          loading="lazy"
                          src={item.imageUrl}
                        />
                        <p className="text-sm font-medium text-[#2d3a6b]">{item.name}</p>
                        <p className="text-sm font-semibold text-[#2b3869]">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>
                    ))}

                    <div className="flex flex-wrap items-center justify-end gap-3 py-3">
                      <span className="text-xs text-[#66719a]">Total</span>
                      <span className="text-base font-semibold text-[#2b3869]">
                        {formatPrice(total, currency)}
                      </span>
                      <button
                        className="ml-2 rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
                        onClick={() => navigateTo(`/orders/${order.id}`)}
                        type="button"
                      >
                        {order.status === "Cancelled" ? "View details" : "Track order"}
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
  );
};

export default MyOrdersPage;
