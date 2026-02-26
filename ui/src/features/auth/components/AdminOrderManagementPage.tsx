import { lazy, Suspense, useMemo } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";
import { ProductData } from "../../../types/home";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const sidebarItems = [
  { label: "Dashboard", active: false, danger: false, badge: "" },
  { label: "Orders", active: true, danger: false, badge: "" },
  { label: "Products", active: false, danger: false, badge: "" },
  { label: "Customers", active: false, danger: false, badge: "" },
  { label: "Low Stock", active: false, danger: false, badge: "5" },
  { label: "Settings", active: false, danger: false, badge: "" },
  { label: "Logout", active: false, danger: true, badge: "" },
] as const;

const statusClassMap = {
  Pending: "bg-[#cfe0fb] text-[#315b9c]",
  Shipped: "bg-[#f3dfc5] text-[#9e6c2f]",
  Delivered: "bg-[#cbe7db] text-[#2f725b]",
  "Low Stock": "bg-[#f3dfc5] text-[#9e6c2f]",
  Active: "bg-[#cce2ea] text-[#2f5f77]",
} as const;

const formatPrice = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

interface OrderManagementRow {
  id: string;
  product: ProductData;
  orderId: string;
  price: number;
  status: keyof typeof statusClassMap;
}

const AdminOrderManagementPage = () => {
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
  const userName = data.navigation?.logoText ?? "Alex Johnson";

  const rows: OrderManagementRow[] = useMemo(
    () =>
      products.slice(0, 8).map((product, index) => {
        const statuses: OrderManagementRow["status"][] = [
          "Pending",
          "Shipped",
          "Delivered",
          "Low Stock",
          "Active",
          "Pending",
          "Pending",
          "Pending",
        ];

        return {
          id: `${product.id}-${index}`,
          product,
          orderId: `#12${348 - index}`,
          price: product.price,
          status: statuses[index] ?? "Pending",
        };
      }),
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
                {sidebarItems.map((item, index) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-lg ${
                      item.active
                        ? "bg-white/85 text-[#3a4f9f]"
                        : item.danger
                          ? "text-[#ffb7ad]"
                          : "text-white/90 hover:bg-white/10"
                    }`}
                    key={`${item.label}-${index}`}
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
              <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e2e7fb] bg-white/85 px-6 py-4">
                <h1 className="text-5xl font-semibold text-[#2b3869]">Order Management</h1>
                <button
                  className="h-11 rounded-lg bg-[#4362c8] px-6 text-2xl font-semibold text-white"
                  type="button"
                >
                  + Add Product
                </button>
              </header>

              <section className="rounded-2xl border border-[#e2e7fb] bg-white/90 p-4">
                <div className="grid gap-3 md:grid-cols-[210px_1fr_110px]">
                  <select className="h-11 rounded-lg border border-[#d9def8] bg-[#f8f9ff] px-4 text-xl text-[#58638f]">
                    <option>All Categories</option>
                  </select>
                  <input
                    className="h-11 rounded-lg border border-[#d9def8] bg-[#f8f9ff] px-4 text-xl text-[#58638f] placeholder:text-[#98a2c9]"
                    placeholder="Search products..."
                    type="text"
                  />
                  <button
                    className="h-11 rounded-lg border border-[#d9def8] bg-white px-4 text-2xl text-[#58638f]"
                    type="button"
                  >
                    Filter
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-[#dfe5fb] bg-white/90">
                <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr_110px] gap-3 border-b border-[#e9ecfa] bg-[#f4f6ff] px-4 py-3 text-2xl text-[#5f6a94]">
                  <span>Order ID</span>
                  <span>Customer</span>
                  <span>Price</span>
                  <span>Status</span>
                  <span />
                </div>

                {rows.map((row) => (
                  <div
                    className="grid grid-cols-[1.7fr_1fr_1fr_1fr_110px] items-center gap-3 border-b border-[#eef1fb] px-4 py-3 last:border-0"
                    key={row.id}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        alt={row.product.name}
                        className="h-14 w-14 rounded-lg object-cover"
                        loading="lazy"
                        src={row.product.imageUrl}
                      />
                      <div>
                        <p className="text-2xl text-[#2f3c6d]">{row.product.name}</p>
                        <p className="text-2xl text-[#2f3c6d]">{row.orderId}</p>
                      </div>
                    </div>
                    <p className="text-3xl text-[#2e3b6d]">{row.orderId}</p>
                    <p className="text-3xl text-[#2e3b6d]">
                      {formatPrice(row.price, row.product.currency)}
                    </p>
                    <span
                      className={`w-fit rounded-full px-4 py-1 text-xl ${statusClassMap[row.status]}`}
                    >
                      {row.status}
                    </span>
                    <button
                      className="h-10 rounded-lg border border-[#d6dcf8] bg-[#f4f6ff] px-4 text-2xl text-[#3f5bbd]"
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-2 px-4 py-4 text-xl text-[#7a85ae]">
                  <button className="h-8 w-8 rounded border border-[#d9def8]" type="button">
                    {"<"}
                  </button>
                  <button className="h-8 w-8 rounded border border-[#d9def8] bg-[#f4f6ff]" type="button">
                    1
                  </button>
                  <button className="h-8 w-8 rounded border border-[#d9def8]" type="button">
                    {">"}
                  </button>
                </div>
              </section>
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

export default AdminOrderManagementPage;
