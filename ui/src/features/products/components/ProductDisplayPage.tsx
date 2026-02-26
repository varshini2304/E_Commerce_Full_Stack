import { lazy, Suspense, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";
import { ProductData } from "../../../types/home";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const ratingBars = [
  { label: "5", widthClass: "w-3/4", value: "75%" },
  { label: "4", widthClass: "w-1/4", value: "24%" },
  { label: "3", widthClass: "w-[8%]", value: "8%" },
  { label: "2", widthClass: "w-[2%]", value: "2%" },
  { label: "1", widthClass: "w-[6%]", value: "6%" },
] as const;

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <svg
        className={`h-4 w-4 ${index < Math.round(rating) ? "text-[#f7b53b]" : "text-[#dbe0f2]"}`}
        fill="currentColor"
        key={index}
        viewBox="0 0 24 24"
      >
        <path d="m12 3.8 2.6 5.2 5.7.8-4.1 4 1 5.6L12 16.7 6.8 19.4l1-5.6-4.1-4 5.7-.8L12 3.8Z" />
      </svg>
    ))}
  </div>
);

const RelatedCard = ({ product }: { product: ProductData }) => (
  <article className="grid grid-cols-[88px_1fr] gap-3 rounded-xl border border-[#e2e8ff] bg-white p-2">
    <img
      alt={product.name}
      className="h-20 w-20 rounded-lg object-cover"
      loading="lazy"
      src={product.imageUrl}
    />
    <div>
      <h4 className="line-clamp-2 text-sm font-semibold text-[#243267]">{product.name}</h4>
      <div className="mt-1">
        <StarRating rating={product.rating ?? 4} />
      </div>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-sm font-bold text-[#f35c4d]">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </div>
  </article>
);

const ProductDisplayPage = () => {
  const { data, isLoading, isError } = useHomeData();
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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

  const featuredProducts = data.featuredProducts ?? [];
  const trendingProducts = data.trendingProducts ?? [];
  const selectedProduct = featuredProducts[0] ?? trendingProducts[0];
  const relatedProducts = [...featuredProducts.slice(1, 3), ...trendingProducts.slice(0, 1)];

  if (!selectedProduct) {
    return <Loader label={UI_MESSAGES.loadingLabel} />;
  }

  const gallery: ProductData[] = [selectedProduct, ...featuredProducts.slice(1, 4)];
  const reviewItems: ProductData[] = [featuredProducts[1], featuredProducts[2]].filter(
    (item): item is ProductData => Boolean(item),
  );
  const rating = selectedProduct.rating ?? 4.8;
  const reviews = selectedProduct.reviewCount ?? 877;
  const strikePrice = selectedProduct.price * 1.43;

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
            Home <span className="mx-2">&gt;</span> Electronics{" "}
            <span className="mx-2">&gt;</span> Wireless Headphones{" "}
            <span className="mx-2">&gt;</span>
            <span className="font-semibold text-[#223067]">{selectedProduct.name}</span>
          </p>
        </div>

        <main className="space-y-6 bg-[#fbfbff] p-6 md:p-8">
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="relative rounded-2xl border border-[#dde2fb] bg-gradient-to-br from-[#d8dcff] via-[#f0f2ff] to-[#e3e7ff] p-3">
                <img
                  alt={gallery[activeImage]?.name ?? selectedProduct.name}
                  className="h-[340px] w-full rounded-xl object-cover"
                  src={gallery[activeImage]?.imageUrl ?? selectedProduct.imageUrl}
                />
                <button
                  className="absolute right-4 top-4 rounded-full border border-[#d6dcfb] bg-white px-4 py-2 text-sm text-[#526093]"
                  type="button"
                >
                  Zoom
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((product, index) => (
                  <button
                    className={`overflow-hidden rounded-lg border p-1 ${index === activeImage ? "border-[#5d73d8]" : "border-[#dbe1fb]"} bg-white`}
                    key={`${product.id}-${index}`}
                    onClick={() => setActiveImage(index)}
                    type="button"
                  >
                    <img
                      alt={product.name}
                      className="h-16 w-full rounded-md object-cover"
                      src={product.imageUrl}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <h1 className="text-5xl font-semibold text-[#243267]">{selectedProduct.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating rating={rating} />
                <p className="text-2xl font-semibold text-[#2a386c]">{rating.toFixed(1)}</p>
                <p className="text-lg text-[#7b85ad]">({reviews} reviews)</p>
              </div>
              <span className="inline-flex rounded-lg bg-[#a8d4b2] px-4 py-2 text-sm font-semibold text-[#2c6c3d]">
                Best Selling
              </span>

              <div className="flex items-end gap-3">
                <p className="text-4xl font-semibold text-[#f55d4e]">
                  {formatPrice(selectedProduct.price, selectedProduct.currency)}
                </p>
                <p className="pb-1 text-3xl text-[#818aae] line-through">
                  {formatPrice(strikePrice, selectedProduct.currency)}
                </p>
              </div>
              <p className="text-3xl text-[#2e9150]">In Stock</p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center overflow-hidden rounded-xl border border-[#d7defa]">
                  <button
                    className="h-14 w-14 text-3xl text-[#56618f]"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    type="button"
                  >
                    -
                  </button>
                  <span className="flex h-14 w-14 items-center justify-center border-x border-[#d7defa] text-3xl text-[#263469]">
                    {quantity}
                  </span>
                  <button
                    className="h-14 w-14 text-3xl text-[#56618f]"
                    onClick={() => setQuantity((value) => value + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  className="h-14 min-w-[260px] rounded-xl bg-gradient-to-r from-[#f77f72] to-[#4563c8] px-8 text-3xl font-semibold text-white"
                  type="button"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Paypal", "Mastercard", "Pay", "Stripe"].map((method) => (
                  <span
                    className="rounded-lg border border-[#d7defa] bg-white px-4 py-2 text-xs font-semibold text-[#5a6492]"
                    key={method}
                  >
                    {method}
                  </span>
                ))}
              </div>

              <button className="text-3xl text-[#3a4775]" type="button">
                Add to Wishlist
              </button>
            </div>
          </section>

          <section className="grid gap-6 border-t border-[#ecf0fc] pt-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <div className="flex rounded-xl border border-[#e1e7fc] bg-gradient-to-r from-[#f8f9ff] to-[#eef1fd] p-1">
                <button
                  className={`rounded-lg px-6 py-2 text-sm font-medium ${activeTab === "description" ? "bg-[#4f66c7] text-white" : "text-[#4e5987]"}`}
                  onClick={() => setActiveTab("description")}
                  type="button"
                >
                  Description
                </button>
                <button
                  className={`rounded-lg px-6 py-2 text-sm font-medium ${activeTab === "specs" ? "bg-[#4f66c7] text-white" : "text-[#4e5987]"}`}
                  onClick={() => setActiveTab("specs")}
                  type="button"
                >
                  Specifications
                </button>
              </div>

              <div className="rounded-2xl border border-[#e1e7fc] bg-white p-6">
                <h2 className="text-4xl font-semibold text-[#243267]">
                  {activeTab === "description" ? "Description" : "Specifications"}
                </h2>
                <p className="mt-3 text-2xl leading-relaxed text-[#4f5a85]">
                  {selectedProduct.description}
                </p>
                <ul className="mt-4 space-y-2 text-3xl text-[#303e6f]">
                  <li>High-Fidelity Sound</li>
                  <li>Active Noise Cancellation</li>
                  <li>30 Hours Playback</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#e1e7fc] bg-white p-6">
                {reviewItems.map((item, index) => (
                  <article
                    className="border-b border-[#edf1fc] pb-5 pt-1 last:border-0 last:pb-0"
                    key={item.id}
                  >
                    <h3 className="text-3xl font-semibold text-[#243267]">
                      {index === 0 ? "Alex J." : "Sarah M."}
                    </h3>
                    <div className="mt-2">
                      <StarRating rating={item.rating ?? 5} />
                    </div>
                    <p className="mt-2 text-2xl leading-relaxed text-[#4f5a85]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#e1e7fc] bg-white p-4">
                <h3 className="text-3xl font-semibold text-[#243267]">Customer Reviews</h3>
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={rating} />
                  <p className="text-3xl font-semibold text-[#243267]">{rating.toFixed(1)}</p>
                  <p className="text-xl text-[#7a85ad]">({reviews})</p>
                </div>
                <div className="mt-4 space-y-2">
                  {ratingBars.map((item) => (
                    <div className="flex items-center gap-2" key={item.label}>
                      <span className="w-3 text-xs text-[#7a85ad]">{item.label}</span>
                      <div className="h-2 flex-1 rounded bg-[#e6ebfb]">
                        <div className={`h-2 rounded bg-[#ff6d5d] ${item.widthClass}`} />
                      </div>
                      <span className="w-8 text-right text-xs text-[#7a85ad]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 h-11 w-full rounded-xl bg-[#4b63c6] text-sm font-semibold text-white"
                  type="button"
                >
                  Write & Review
                </button>
              </div>

              <div className="rounded-2xl border border-[#e1e7fc] bg-white p-4">
                <h3 className="text-3xl font-semibold text-[#243267]">Related Products</h3>
                <div className="mt-3 space-y-3">
                  {relatedProducts.map((product) => (
                    <RelatedCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </aside>
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

export default ProductDisplayPage;
