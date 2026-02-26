import { lazy, Suspense, useMemo } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const chartPoints = [
  "M20 150 L100 120 L180 95 L260 80 L340 55 L420 25 L500 35 L580 10",
] as const;

const sidebarItems = [
  { label: "Dashboard", active: true, danger: false, badge: "" },
  { label: "Orders", active: false, danger: false, badge: "" },
  { label: "Products", active: false, danger: false, badge: "" },
  { label: "Customers", active: false, danger: false, badge: "" },
  { label: "Low Stock", active: false, danger: false, badge: "5" },
  { label: "Settings", active: false, danger: false, badge: "" },
  { label: "Logout", active: false, danger: true, badge: "" },
] as const;

const statusClassMap = {
  Processing: "bg-[#f8dfc0] text-[#a16823]",
  Completed: "bg-[#c8e9df] text-[#1f6f5f]",
  Pending: "bg-[#cfe0fb] text-[#315b9c]",
} as const;

const AdminDashboardPage = () => {
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

  const products = [...(data.featuredProducts ?? []), ...(data.trendingProducts ?? [])];
  const totalOrders = products.length * 12;
  const totalSales = products.reduce((sum, item) => sum + item.price * 8, 0);
  const totalProducts = products.length;
  const lowStockItems = Math.min(5, products.length);
  const userName = data.navigation?.logoText ?? "Alex Johnson";

  const recentOrders = useMemo(
    () =>
      products.slice(0, 6).map((item, index) => ({
        id: `#12${348 - index}`,
        customer: ["Sarah", "James", "Emily", "David", "Emma", "Liam"][index] ?? "Customer",
        status: (["Processing", "Completed", "Completed", "Pending", "Pending", "Pending"][
          index
        ] ?? "Pending") as keyof typeof statusClassMap,
        date: ["Apr 25, 2024", "Apr 25, 2024", "Apr 23, 2024", "Apr 24, 2024", "Apr 23, 2024", "Apr 23, 2024"][
          index
        ],
        total: item.price,
        avatar: item.imageUrl,
      })),
    [products],
  );

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <main className="bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit overflow-hidden rounded-2xl bg-gradient-to-b from-[#3555b4] to-[#294797] text-white">
              <div className="px-5 py-7 text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-white/40">
                  <img
                    alt={userName}
                    className="h-full w-full object-cover"
                    src={products[0]?.imageUrl}
                  />
                </div>
                <h2 className="mt-4 text-3xl font-semibold">{userName}</h2>
              </div>
              <nav className="space-y-1 px-3 pb-5">
                {sidebarItems.map((item) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-lg ${
                      item.active
                        ? "bg-white/85 text-[#3a4f9f]"
                        : item.danger
                          ? "text-[#ffb7ad]"
                          : "text-white/90 hover:bg-white/10"
                    }`}
                    key={item.label}
                    type="button"
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-[#f27d76] px-2 py-0.5 text-xs text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="space-y-4">
              <header className="rounded-2xl border border-[#e2e7fb] bg-white/85 px-6 py-4">
                <h1 className="text-5xl font-semibold text-[#2b3869]">
                  Welcome back, <span className="font-bold">Alex!</span>
                </h1>
              </header>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="md:col-span-2 rounded-2xl border border-[#dfe5fb] bg-white/90 p-5">
                  <p className="text-3xl text-[#54608c]">Total Sales</p>
                  <p className="mt-1 text-6xl font-semibold text-[#2b3869]">
                    {formatCurrency(totalSales)}
                  </p>
                  <p className="mt-2 text-2xl text-[#2d8f7f]">+15.7% this month</p>
                </article>
                <article className="rounded-2xl border border-[#dfe5fb] bg-white/90 p-5">
                  <p className="text-3xl text-[#54608c]">Low Stock</p>
                  <p className="mt-2 text-5xl font-semibold text-[#ef6f62]">{lowStockItems}</p>
                  <p className="text-2xl text-[#ef6f62]">Items</p>
                </article>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-[#dfe5fb] bg-white/90 p-5">
                  <p className="text-3xl text-[#54608c]">Total Orders</p>
                  <p className="mt-1 text-6xl font-semibold text-[#2b3869]">
                    {totalOrders.toLocaleString("en-US")}
                  </p>
                </article>
                <article className="rounded-2xl border border-[#dfe5fb] bg-white/90 p-5">
                  <p className="text-3xl text-[#54608c]">Total Products</p>
                  <p className="mt-1 text-6xl font-semibold text-[#2b3869]">
                    {totalProducts.toLocaleString("en-US")}
                  </p>
                </article>
              </div>

              <article className="rounded-2xl border border-[#dfe5fb] bg-white/90 p-5">
                <h2 className="text-4xl font-semibold text-[#2b3869]">Sales Statistics</h2>
                <div className="mt-4 h-[220px] rounded-xl border border-[#e8ecfc] bg-white p-4">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 620 180">
                    <path
                      d={chartPoints[0]}
                      stroke="#a7b7f4"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <path
                      d="M20 150 L100 120 L180 95 L260 80 L340 55 L420 25 L500 35 L580 10 L580 170 L20 170 Z"
                      fill="url(#salesGradient)"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#b7c4f8" />
                        <stop offset="100%" stopColor="#eef2ff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </article>

              <article className="rounded-2xl border border-[#dfe5fb] bg-white/90">
                <div className="flex items-center justify-between border-b border-[#ecf0fc] px-5 py-4">
                  <h2 className="text-4xl font-semibold text-[#2b3869]">Recent Orders</h2>
                  <button className="text-2xl text-[#4161c5]" type="button">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto px-5 pb-4 pt-2">
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="text-xl text-[#68739f]">
                        <th className="py-2 font-medium">Order ID</th>
                        <th className="py-2 font-medium">Customer</th>
                        <th className="py-2 font-medium">Status</th>
                        <th className="py-2 font-medium">Date</th>
                        <th className="py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr className="border-t border-[#edf1fc]" key={order.id + order.customer}>
                          <td className="py-3 text-2xl text-[#2d3a6b]">{order.id}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <img
                                alt={order.customer}
                                className="h-8 w-8 rounded-full object-cover"
                                src={order.avatar}
                              />
                              <span className="text-2xl text-[#2d3a6b]">{order.customer}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-4 py-1 text-lg ${statusClassMap[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-2xl text-[#68739f]">{order.date}</td>
                          <td className="py-3 text-right text-3xl font-semibold text-[#2d3a6b]">
                            {formatCurrency(order.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
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

export default AdminDashboardPage;
