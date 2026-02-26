import { lazy, Suspense } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { Loader, ProductCard, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";
import { ProductData } from "../../../types/home";
import { addProductToCart } from "../../cart/cartStorage";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const CategoryPage = () => {
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

  const slug = decodeURIComponent(window.location.pathname.split("/")[2] ?? "");
  const category = (data.categories ?? []).find((item) => item.icon === slug);
  const allProducts = [...(data.featuredProducts ?? []), ...(data.trendingProducts ?? [])];
  const productsMap = new Map<string, ProductData>();
  allProducts.forEach((product) => {
    productsMap.set(product.id, product);
  });
  const uniqueProducts = Array.from(productsMap.values());
  const categoryProducts = uniqueProducts.filter((product) => product.categorySlug === slug);
  const visibleProducts = categoryProducts.length > 0 ? categoryProducts : uniqueProducts;
  const pageTitle = category?.name ?? (slug ? slug.replaceAll("-", " ") : "Products");

  const onAddToCart = (product: ProductData) => {
    addProductToCart(product);
    window.location.href = "/cart";
  };

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <main className="space-y-6 bg-[#fbfbff] p-6 md:p-8">
          <section className="rounded-2xl border border-[#dde3fc] bg-gradient-to-r from-[#8f95e8] via-[#b3b6f5] to-[#d2d4fa] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Category
            </p>
            <h1 className="mt-1 text-3xl font-bold">{pageTitle}</h1>
            {category?.description ? (
              <p className="mt-2 text-sm text-white/90">{category.description}</p>
            ) : null}
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                actionLabel="Add to cart"
                key={product.id}
                onAction={onAddToCart}
                product={product}
                variant="default"
              />
            ))}
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

export default CategoryPage;
