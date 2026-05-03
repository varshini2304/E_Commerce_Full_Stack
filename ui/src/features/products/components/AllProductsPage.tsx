import { lazy, Suspense, useMemo, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { addProductToCart } from "../../cart/cartStorage";
import { addProductToWishList } from "../../wishlist/WishListStorage";
import { navigateTo } from "../../../shared/utils/navigation";
import { useAllProducts } from "../hooks/useAllProducts";
import type { CatalogProduct } from "../types/catalog.types";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

type SortKey = "newest" | "price-asc" | "price-desc" | "rating" | "best-selling";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const titleize = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        className={`h-3 w-3 ${i < Math.round(rating) ? "text-[#f5a623]" : "text-[#d6dbef]"}`}
        fill="currentColor"
      >
        <path d="m12 3.8 2.6 5.2 5.7.8-4.1 4 1 5.6L12 16.7 6.8 19.4l1-5.6-4.1-4 5.7-.8L12 3.8Z" />
      </svg>
    ))}
  </div>
);

const AllProductsPage = () => {
  const { data: homeData } = useHomeData();
  const { data: products = [], isLoading, isError, refetch } = useAllProducts();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [vendorOnly, setVendorOnly] = useState(false);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("newest");

  const { categories, brands, priceBounds } = useMemo(() => {
    const cats = new Set<string>();
    const bs = new Set<string>();
    let lo = Infinity;
    let hi = 0;
    for (const p of products) {
      if (p.categorySlug) cats.add(p.categorySlug);
      if (p.brand) bs.add(p.brand);
      if (p.finalPrice < lo) lo = p.finalPrice;
      if (p.finalPrice > hi) hi = p.finalPrice;
    }
    return {
      categories: Array.from(cats).sort(),
      brands: Array.from(bs).sort(),
      priceBounds: { min: lo === Infinity ? 0 : Math.floor(lo), max: Math.ceil(hi) },
    };
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = priceMin ? Number(priceMin) : -Infinity;
    const max = priceMax ? Number(priceMax) : Infinity;

    let list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(p.categorySlug)) return false;
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;
      if (p.ratingsAverage < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (vendorOnly && !p.vendorId) return false;
      if (p.finalPrice < min || p.finalPrice > max) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.finalPrice - b.finalPrice;
        case "price-desc":
          return b.finalPrice - a.finalPrice;
        case "rating":
          return b.ratingsAverage - a.ratingsAverage;
        case "best-selling":
          return b.salesCount - a.salesCount;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return list;
  }, [
    products,
    search,
    selectedCategories,
    selectedBrands,
    minRating,
    inStockOnly,
    vendorOnly,
    priceMin,
    priceMax,
    sort,
  ]);

  const toggleSet = (set: Set<string>, value: string, setter: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setMinRating(0);
    setInStockOnly(false);
    setVendorOnly(false);
    setPriceMin("");
    setPriceMax("");
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

  const handleAddToCart = (p: CatalogProduct) => {
    addProductToCart(toProductData(p), 1);
    navigateTo("/cart");
  };

  const handleAddToWishlist = (p: CatalogProduct) => {
    addProductToWishList(toProductData(p), 1);
  };

  const handleOpen = (p: CatalogProduct) => {
    navigateTo(`/product/${encodeURIComponent(p.slug ?? p._id)}`);
  };

  const activeFilterCount =
    selectedCategories.size +
    selectedBrands.size +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (vendorOnly ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData?.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      <main className="px-6 py-8 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#1f2b59] sm:text-2xl">All products</h1>
            <p className="mt-1 text-xs text-[#68739c]">
              {isLoading
                ? "Loading…"
                : `${filtered.length} of ${products.length} product${products.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#68739c]" htmlFor="sort">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-[#dbe1fb] bg-white px-3 py-1.5 text-xs text-[#2b3869] focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="best-selling">Best selling</option>
            </select>
          </div>
        </header>

        {isError ? (
          <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-800">Failed to load products</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="h-fit space-y-4 rounded-xl border border-[#dbe1fb] bg-white p-4 shadow-sm lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1f2b59]">Filters</h2>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Clear ({activeFilterCount})
                </button>
              ) : null}
            </div>

            {/* Search */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#68739c]">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or description"
                className="w-full rounded-md border border-[#dbe1fb] bg-white px-3 py-1.5 text-xs text-[#2b3869] placeholder-[#9ba6cc] focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Categories */}
            {categories.length > 0 ? (
              <div>
                <label className="mb-1 block text-xs font-medium text-[#68739c]">Category</label>
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-xs text-[#2b3869] hover:bg-[#f4f6ff]">
                        <input
                          type="checkbox"
                          checked={selectedCategories.has(c)}
                          onChange={() =>
                            toggleSet(selectedCategories, c, setSelectedCategories)
                          }
                          className="h-3.5 w-3.5 rounded border-[#c4cdef] text-indigo-600 focus:ring-indigo-400"
                        />
                        {titleize(c)}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Price */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#68739c]">
                Price ({formatPrice(priceBounds.min)} – {formatPrice(priceBounds.max)})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-md border border-[#dbe1fb] bg-white px-2 py-1.5 text-xs text-[#2b3869] placeholder-[#9ba6cc] focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <span className="text-xs text-[#68739c]">–</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-md border border-[#dbe1fb] bg-white px-2 py-1.5 text-xs text-[#2b3869] placeholder-[#9ba6cc] focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Brand */}
            {brands.length > 0 ? (
              <div>
                <label className="mb-1 block text-xs font-medium text-[#68739c]">Brand</label>
                <ul className="max-h-40 space-y-1 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <li key={b}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-xs text-[#2b3869] hover:bg-[#f4f6ff]">
                        <input
                          type="checkbox"
                          checked={selectedBrands.has(b)}
                          onChange={() => toggleSet(selectedBrands, b, setSelectedBrands)}
                          className="h-3.5 w-3.5 rounded border-[#c4cdef] text-indigo-600 focus:ring-indigo-400"
                        />
                        {b}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Rating */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#68739c]">
                Minimum rating
              </label>
              <div className="flex flex-wrap gap-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`rounded-md border px-2 py-1 text-xs ${
                      minRating === r
                        ? "border-indigo-500 bg-indigo-50 font-semibold text-indigo-700"
                        : "border-[#dbe1fb] bg-white text-[#2b3869] hover:border-[#c4cdef]"
                    }`}
                  >
                    {r === 0 ? "Any" : `${r}★ +`}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-1.5 border-t border-[#edf1fd] pt-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#2b3869]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#c4cdef] text-indigo-600 focus:ring-indigo-400"
                />
                In stock only
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#2b3869]">
                <input
                  type="checkbox"
                  checked={vendorOnly}
                  onChange={(e) => setVendorOnly(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#c4cdef] text-indigo-600 focus:ring-indigo-400"
                />
                From vendors only
              </label>
            </div>
          </aside>

          {/* Grid */}
          <section>
            {isLoading ? (
              <SectionSkeleton cards={8} />
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-[#dbe1fb] bg-white p-10 text-center">
                <p className="text-sm font-semibold text-[#1f2b59]">No products match your filters</p>
                <p className="mt-1 text-xs text-[#68739c]">
                  Try clearing filters or broadening your search.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <article
                    key={p._id}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-[#e3e7f8] bg-white shadow-sm transition-shadow hover:shadow-md"
                    onClick={() => handleOpen(p)}
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-[#f4f6ff]">
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {p.discountPercentage > 0 ? (
                        <span className="absolute right-2 top-2 rounded-full bg-[#f47f74] px-2 py-0.5 text-[10px] font-semibold text-white">
                          {p.discountPercentage}% OFF
                        </span>
                      ) : null}
                      {p.stock === 0 ? (
                        <span className="absolute left-2 bottom-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Out of stock
                        </span>
                      ) : null}
                      <button
                        type="button"
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(p);
                        }}
                        className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#c24545] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#a63a3a]"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-1.5 p-3">
                      <p className="font-mono text-[10px] text-[#9ba6cc]">{titleize(p.categorySlug)}</p>
                      <h3 className="line-clamp-1 text-sm font-semibold text-[#1f2b59]">{p.name}</h3>
                      <p className="line-clamp-1 text-xs text-[#707aa1]">{p.description}</p>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={p.ratingsAverage} />
                        <span className="text-[10px] text-[#9ba6cc]">({p.ratingsCount})</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div>
                          <p className="text-sm font-bold text-[#1f2b59]">{formatPrice(p.finalPrice)}</p>
                          {p.discountPercentage > 0 ? (
                            <p className="text-[10px] text-[#9ba6cc] line-through">
                              {formatPrice(p.price)}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p);
                          }}
                          disabled={p.stock === 0}
                          className="rounded-md bg-[#1f4690] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1a3a75] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {homeData?.footer ? (
        <Suspense fallback={<SectionSkeleton cards={1} />}>
          <SiteFooter data={homeData.footer} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default AllProductsPage;
