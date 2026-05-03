import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { UI_MESSAGES } from "../../../shared/constants/config";
import { navigateTo } from "../../../shared/utils/navigation";
import { addProductToCart } from "../../cart/cartStorage";
import { addProductToWishList } from "../../wishlist/WishListStorage";
import { useAllProducts } from "../hooks/useAllProducts";
import type { CatalogProduct } from "../types/catalog.types";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const titleize = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const StarRating = ({ rating, size = 4 }: { rating: number; size?: 3 | 4 | 5 }) => {
  const sizeClass = size === 5 ? "h-5 w-5" : size === 3 ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          className={`${sizeClass} ${index < Math.round(rating) ? "text-[#f7b53b]" : "text-[#dbe0f2]"}`}
          fill="currentColor"
          key={index}
          viewBox="0 0 24 24"
        >
          <path d="m12 3.8 2.6 5.2 5.7.8-4.1 4 1 5.6L12 16.7 6.8 19.4l1-5.6-4.1-4 5.7-.8L12 3.8Z" />
        </svg>
      ))}
    </div>
  );
};

const toProductData = (p: CatalogProduct) => ({
  id: p._id,
  name: p.name,
  description: p.description,
  imageUrl: p.thumbnail,
  price: p.finalPrice,
  currency: "USD",
  slug: p.slug,
});

const ProductDisplayPage = () => {
  const { data: homeData } = useHomeData();
  const { data: products = [], isLoading, isError } = useAllProducts();

  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const productLookup = decodeURIComponent(window.location.pathname.split("/")[2] ?? "");

  const selectedProduct = useMemo(
    () =>
      products.find((p) => p.slug === productLookup || p._id === productLookup) ??
      products[0],
    [products, productLookup],
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(
        (p) =>
          p._id !== selectedProduct._id && p.categorySlug === selectedProduct.categorySlug,
      )
      .slice(0, 4);
  }, [products, selectedProduct]);

  if (isLoading) return <Loader label={UI_MESSAGES.loadingLabel} />;

  if (isError || !selectedProduct) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)] p-8">
        <section className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-base font-semibold text-red-900">Product not found</h1>
          <p className="mt-1 text-sm text-red-700">The product you&apos;re looking for is unavailable.</p>
          <button
            type="button"
            onClick={() => navigateTo("/products")}
            className="mt-4 rounded-md bg-[#1f4690] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a75]"
          >
            Browse all products
          </button>
        </section>
      </div>
    );
  }

  const gallery = [
    selectedProduct.thumbnail,
    ...(selectedProduct.images ?? []).filter((url) => url !== selectedProduct.thumbnail),
  ].slice(0, 5);

  const inStock = selectedProduct.stock > 0;
  const lowStock = inStock && selectedProduct.stock < 10;

  const ratingDistribution = [
    { star: 5, pct: Math.min(85, 60 + Math.round(selectedProduct.ratingsAverage * 5)) },
    { star: 4, pct: 22 },
    { star: 3, pct: 8 },
    { star: 2, pct: 3 },
    { star: 1, pct: 2 },
  ];

  const handleAddToCart = () => {
    addProductToCart(toProductData(selectedProduct), quantity);
    setToast(`Added ${quantity} × ${selectedProduct.name} to cart`);
  };

  const handleBuyNow = () => {
    addProductToCart(toProductData(selectedProduct), quantity);
    navigateTo("/checkout");
  };

  const handleWishlist = () => {
    addProductToWishList(toProductData(selectedProduct), 1);
    setToast(`Added ${selectedProduct.name} to wishlist`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData?.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center">
          <div className="pointer-events-auto rounded-md bg-[#1f4690] px-4 py-2 text-xs font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}

      {/* Breadcrumb */}
      <div className="border-b border-[#dfe5fb] bg-white/60 px-6 py-3 text-xs text-[#6a75a1] sm:px-8 lg:px-12">
        <p>
          <button onClick={() => navigateTo("/")} className="hover:text-[#223067]">Home</button>
          <span className="mx-1.5">›</span>
          <button onClick={() => navigateTo("/products")} className="hover:text-[#223067]">
            Products
          </button>
          <span className="mx-1.5">›</span>
          <button
            onClick={() => navigateTo(`/category/${selectedProduct.categorySlug}`)}
            className="hover:text-[#223067]"
          >
            {titleize(selectedProduct.categorySlug)}
          </button>
          <span className="mx-1.5">›</span>
          <span className="font-semibold text-[#223067]">{selectedProduct.name}</span>
        </p>
      </div>

      <main className="space-y-6 px-6 py-8 sm:px-8 lg:px-12">
        {/* Top: gallery + info */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-[#dde2fb] bg-white p-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f4f6ff]">
                <img
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                  src={gallery[activeImage]}
                />
                {selectedProduct.discountPercentage > 0 ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#f47f74] px-2.5 py-1 text-xs font-semibold text-white">
                    {selectedProduct.discountPercentage}% OFF
                  </span>
                ) : null}
              </div>
            </div>
            {gallery.length > 1 ? (
              <div className="grid grid-cols-5 gap-2">
                {gallery.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    onClick={() => setActiveImage(index)}
                    type="button"
                    className={`overflow-hidden rounded-lg border bg-white p-1 transition ${
                      index === activeImage
                        ? "border-[#1f4690] ring-1 ring-[#1f4690]"
                        : "border-[#dbe1fb] hover:border-[#c4cdef]"
                    }`}
                  >
                    <img
                      alt={`Thumbnail ${index + 1}`}
                      className="h-14 w-full rounded-md object-cover"
                      src={url}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Info */}
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7b85ad]">
                <span className="rounded-full bg-[#e9edff] px-2.5 py-0.5 font-semibold uppercase tracking-wider text-[#334794]">
                  {titleize(selectedProduct.categorySlug)}
                </span>
                {selectedProduct.brand ? (
                  <span className="font-medium text-[#5f6a96]">by {selectedProduct.brand}</span>
                ) : null}
                {selectedProduct.vendorId ? (
                  <span className="rounded bg-[#f4f6ff] px-2 py-0.5 font-medium text-[#334794]">
                    vendor product
                  </span>
                ) : null}
              </div>
              <h1 className="mt-2 text-2xl font-bold text-[#1f2b59] md:text-3xl">
                {selectedProduct.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={selectedProduct.ratingsAverage} />
                <p className="text-sm font-semibold text-[#2a386c]">
                  {selectedProduct.ratingsAverage.toFixed(1)}
                </p>
                <p className="text-xs text-[#7b85ad]">({selectedProduct.ratingsCount} reviews)</p>
                <span className="text-[#dbe0f2]">·</span>
                <p className="text-xs text-[#7b85ad]">
                  {selectedProduct.salesCount.toLocaleString()} sold
                </p>
              </div>
            </div>

            {/* Price + stock */}
            <div className="rounded-xl border border-[#dde2fb] bg-white p-4">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-[#1f2b59]">
                  {formatPrice(selectedProduct.finalPrice)}
                </p>
                {selectedProduct.discountPercentage > 0 ? (
                  <p className="pb-1 text-base text-[#9ba6cc] line-through">
                    {formatPrice(selectedProduct.price)}
                  </p>
                ) : null}
                {selectedProduct.discountPercentage > 0 ? (
                  <p className="pb-1 text-sm font-semibold text-[#2e9150]">
                    Save {formatPrice(selectedProduct.price - selectedProduct.finalPrice)}
                  </p>
                ) : null}
              </div>
              <p className="mt-2 text-xs">
                {!inStock ? (
                  <span className="font-semibold text-[#c24545]">Out of stock</span>
                ) : lowStock ? (
                  <span className="font-semibold text-[#b67403]">
                    Only {selectedProduct.stock} left in stock
                  </span>
                ) : (
                  <span className="font-semibold text-[#2e9150]">
                    In stock · {selectedProduct.stock} available
                  </span>
                )}
              </p>
            </div>

            {/* Quantity + actions */}
            <div className="rounded-xl border border-[#dde2fb] bg-white p-4">
              <p className="text-xs font-medium text-[#68739c]">Quantity</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-md border border-[#dbe1fb]">
                  <button
                    className="h-9 w-9 text-base text-[#56618f] hover:bg-[#f5f6fe] disabled:opacity-50"
                    onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                    disabled={quantity <= 1}
                    type="button"
                  >
                    −
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center border-x border-[#dbe1fb] text-sm font-medium text-[#1f2b59]">
                    {quantity}
                  </span>
                  <button
                    className="h-9 w-9 text-base text-[#56618f] hover:bg-[#f5f6fe] disabled:opacity-50"
                    onClick={() => setQuantity((v) => Math.min(selectedProduct.stock || 99, v + 1))}
                    disabled={quantity >= (selectedProduct.stock || 99)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7b85ad]">
                  Total: <span className="font-semibold text-[#1f2b59]">
                    {formatPrice(selectedProduct.finalPrice * quantity)}
                  </span>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="h-9 rounded-md border border-[#dbe1fb] bg-white px-4 text-sm font-semibold text-[#1f4690] hover:border-[#c4cdef] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="h-9 rounded-md bg-[#1f4690] px-5 text-sm font-semibold text-white hover:bg-[#1a3a75] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy now
                </button>
                <button
                  type="button"
                  onClick={handleWishlist}
                  aria-label="Add to wishlist"
                  className="grid h-9 w-9 place-items-center rounded-md border border-[#dbe1fb] bg-white text-[#c24545] hover:bg-[#fdf3f2]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#edf1fd] pt-3">
                {["Visa", "Mastercard", "PayPal", "Stripe"].map((method) => (
                  <span
                    key={method}
                    className="rounded bg-[#f4f6ff] px-2 py-0.5 text-[10px] font-semibold text-[#5f6a96]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust block */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { t: "Free returns", b: "30 days" },
                { t: "Secure", b: "JWT + SSL" },
                { t: "Fast ship", b: "2–4 days" },
              ].map((b) => (
                <div key={b.t} className="rounded-lg border border-[#dde2fb] bg-white px-2 py-2">
                  <p className="text-xs font-semibold text-[#1f2b59]">{b.t}</p>
                  <p className="text-[10px] text-[#7b85ad]">{b.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs + reviews + sidebar */}
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="flex rounded-xl border border-[#e1e7fc] bg-white p-1">
              <button
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${activeTab === "description" ? "bg-[#1f4690] text-white" : "text-[#5f6a96] hover:bg-[#f5f6fe]"}`}
                onClick={() => setActiveTab("description")}
                type="button"
              >
                Description
              </button>
              <button
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${activeTab === "specs" ? "bg-[#1f4690] text-white" : "text-[#5f6a96] hover:bg-[#f5f6fe]"}`}
                onClick={() => setActiveTab("specs")}
                type="button"
              >
                Specifications
              </button>
            </div>

            <div className="rounded-xl border border-[#e1e7fc] bg-white p-5">
              {activeTab === "description" ? (
                <>
                  <h2 className="text-base font-semibold text-[#1f2b59]">About this product</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6a96]">
                    {selectedProduct.description}
                  </p>
                  {selectedProduct.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[#f4f6ff] px-2 py-0.5 text-[11px] font-medium text-[#334794]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <h2 className="text-base font-semibold text-[#1f2b59]">Specifications</h2>
                  <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    {[
                      ["Brand", selectedProduct.brand || "—"],
                      ["Category", titleize(selectedProduct.categorySlug)],
                      ["SKU", selectedProduct.sku],
                      ["Stock", `${selectedProduct.stock} units`],
                      ["Sales", selectedProduct.salesCount.toLocaleString()],
                      ["Discount", `${selectedProduct.discountPercentage}%`],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between gap-3 border-b border-[#edf1fd] py-1.5 last:border-0"
                      >
                        <dt className="text-[#7b85ad]">{label}</dt>
                        <dd className="font-medium text-[#1f2b59]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>

            {/* Reviews */}
            <div className="rounded-xl border border-[#e1e7fc] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#1f2b59]">Customer reviews</h2>
                <button
                  type="button"
                  className="rounded-md border border-[#dbe1fb] px-3 py-1.5 text-xs font-semibold text-[#1f4690] hover:bg-[#f4f6ff]"
                >
                  Write a review
                </button>
              </div>
              {selectedProduct.ratingsCount > 0 ? (
                <div className="mt-4 space-y-3">
                  {[
                    {
                      name: "Alex J.",
                      stars: 5,
                      body: `Love this. ${selectedProduct.brand || "The brand"} delivered on every promise — quality is top-notch and shipping was quick.`,
                    },
                    {
                      name: "Sarah M.",
                      stars: 4,
                      body: "Great value for the price. Would buy again. Packaging could be better but the product itself is solid.",
                    },
                  ].map((r) => (
                    <article
                      key={r.name}
                      className="border-b border-[#edf1fd] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#e9edff] text-xs font-semibold text-[#334794]">
                          {r.name[0]}
                        </div>
                        <p className="text-sm font-semibold text-[#1f2b59]">{r.name}</p>
                        <StarRating rating={r.stars} size={3} />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#5f6a96]">{r.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#7b85ad]">
                  No reviews yet. Be the first to review this product.
                </p>
              )}
            </div>
          </div>

          {/* Aside */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#e1e7fc] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#1f2b59]">Rating breakdown</h3>
              <div className="mt-3 flex items-center gap-3">
                <p className="text-3xl font-bold text-[#1f2b59]">
                  {selectedProduct.ratingsAverage.toFixed(1)}
                </p>
                <div>
                  <StarRating rating={selectedProduct.ratingsAverage} />
                  <p className="mt-0.5 text-xs text-[#7b85ad]">
                    {selectedProduct.ratingsCount} reviews
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {ratingDistribution.map((item) => (
                  <div className="flex items-center gap-2" key={item.star}>
                    <span className="w-3 text-[10px] text-[#7a85ad]">{item.star}</span>
                    <div className="h-1.5 flex-1 rounded bg-[#edf0fb]">
                      <div
                        className="h-1.5 rounded bg-[#f7b53b]"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] text-[#7a85ad]">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            <div className="rounded-xl border border-[#e1e7fc] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#1f2b59]">Related products</h3>
              {relatedProducts.length === 0 ? (
                <p className="mt-3 text-xs text-[#7b85ad]">No related products yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {relatedProducts.map((p) => (
                    <article
                      key={p._id}
                      className="grid cursor-pointer grid-cols-[48px_1fr] gap-3 rounded-lg border border-[#edf1fd] p-2 hover:border-[#dbe1fb]"
                      onClick={() => navigateTo(`/product/${encodeURIComponent(p.slug ?? p._id)}`)}
                    >
                      <img
                        alt={p.name}
                        className="h-12 w-12 rounded-md object-cover"
                        loading="lazy"
                        src={p.thumbnail}
                      />
                      <div className="min-w-0">
                        <h4 className="line-clamp-1 text-xs font-semibold text-[#1f2b59]">
                          {p.name}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <StarRating rating={p.ratingsAverage} size={3} />
                        </div>
                        <p className="mt-0.5 text-xs font-bold text-[#1f4690]">
                          {formatPrice(p.finalPrice)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      {homeData?.footer ? (
        <Suspense fallback={<SectionSkeleton cards={1} />}>
          <SiteFooter data={homeData.footer} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default ProductDisplayPage;
