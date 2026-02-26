import { lazy, Suspense } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const sidebarItems = [
  { label: "Dashboard", active: false, danger: false, badge: "" },
  { label: "Products", active: true, danger: false, badge: "" },
  { label: "Orders", active: false, danger: false, badge: "" },
  { label: "Customers", active: false, danger: false, badge: "" },
  { label: "Low Stock", active: false, danger: false, badge: "5" },
  { label: "Settings", active: false, danger: false, badge: "" },
  { label: "Logout", active: false, danger: true, badge: "" },
] as const;

const AdminAddProductPage = () => {
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
                <h1 className="text-5xl font-semibold text-[#2b3869]">Add Product</h1>
                <div className="flex gap-2">
                  <button
                    className="h-11 rounded-lg border border-[#d9def8] bg-white px-6 text-2xl text-[#6a749f]"
                    type="button"
                  >
                    Save Draft
                  </button>
                  <button
                    className="h-11 rounded-lg bg-[#4362c8] px-6 text-2xl font-semibold text-white"
                    type="button"
                  >
                    Publish
                  </button>
                </div>
              </header>

              <form className="space-y-4">
                <section className="rounded-2xl border border-[#e2e7fb] bg-white/90 p-5">
                  <label className="text-4xl text-[#2f3c6d]" htmlFor="product-name">
                    Product Name
                  </label>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                    id="product-name"
                    placeholder="Product Name"
                    type="text"
                  />

                  <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
                    <div>
                      <label className="text-3xl text-[#2f3c6d]" htmlFor="category">
                        Category
                      </label>
                      <select
                        className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] focus:outline-none"
                        id="category"
                      >
                        <option>Select category</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-3xl text-[#2f3c6d]" htmlFor="price">
                        Price
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                        id="price"
                        placeholder="$"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="text-3xl text-[#2f3c6d]" htmlFor="discount">
                        Discount %
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                        id="discount"
                        placeholder="%"
                        type="number"
                      />
                    </div>
                  </div>

                  <label className="mt-4 block text-4xl text-[#2f3c6d]" htmlFor="description">
                    Description
                  </label>
                  <div className="mt-2 overflow-hidden rounded-xl border border-[#d9def8]">
                    <div className="flex gap-3 border-b border-[#e4e8fb] bg-[#f8f9ff] px-4 py-2 text-[#7f89b4]">
                      <span>B</span>
                      <span>I</span>
                      <span>U</span>
                      <span>H</span>
                      <span>Link</span>
                      <span>List</span>
                    </div>
                    <textarea
                      className="h-28 w-full resize-none bg-white px-4 py-3 text-lg text-[#3f4a75] focus:outline-none"
                      id="description"
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-[#e2e7fb] bg-white/90 p-5">
                  <h2 className="text-4xl text-[#2f3c6d]">Images</h2>
                  <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d6dcf7] bg-[#fbfcff] px-5 py-10 text-center">
                    <svg className="h-9 w-9 text-[#a2abd0]" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 16V7m0 0-3 3m3-3 3 3M5 16a4 4 0 0 1 1.3-7.8A5.5 5.5 0 0 1 17 8a4 4 0 0 1 1 7.9"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="mt-2 text-2xl text-[#5f6b95]">
                      Drag & drop or click to upload product images
                    </span>
                    <span className="mt-1 text-lg text-[#8892ba]">
                      Upload up to 5 images, JPG, PNG or GIF format, max 5MB each
                    </span>
                    <input className="hidden" multiple type="file" />
                  </label>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-3xl text-[#2f3c6d]" htmlFor="sku">
                        SKU
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                        id="sku"
                        placeholder="SKU"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="text-3xl text-[#2f3c6d]" htmlFor="brand">
                        Brand
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                        id="brand"
                        placeholder="Brand"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-3xl text-[#2f3c6d]" htmlFor="tags">
                      Tags
                    </label>
                    <input
                      className="mt-2 h-12 w-full rounded-xl border border-[#d9def8] bg-[#f8f9ff] px-4 text-2xl text-[#3f4a75] placeholder:text-[#9ea8cc] focus:outline-none"
                      id="tags"
                      placeholder="Enter tags..."
                      type="text"
                    />
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      className="h-11 rounded-lg border border-[#d9def8] bg-white px-6 text-2xl text-[#6a749f]"
                      type="button"
                    >
                      Save Draft
                    </button>
                    <button
                      className="h-11 rounded-lg bg-[#4362c8] px-6 text-2xl font-semibold text-white"
                      type="submit"
                    >
                      Publish
                    </button>
                  </div>
                </section>
              </form>
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

export default AdminAddProductPage;
