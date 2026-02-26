import { lazy, Suspense } from "react";
import { useHomeData } from "../hooks/useHomeData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import {
  APP_CONFIG,
  UI_LIMITS,
  UI_MESSAGES,
} from "../../../shared/constants/config";

const HeroSection = lazy(() => import("./HeroSection"));
const CategorySection = lazy(() => import("./CategorySection"));
const FeaturedProducts = lazy(() => import("./FeaturedProducts"));
const TrendingProducts = lazy(() => import("./TrendingProducts"));
const PromoBanner = lazy(() => import("./PromoBanner"));
const NewsletterSection = lazy(() => import("./NewsletterSection"));
const TopNav = lazy(() => import("./TopNav"));
const SiteFooter = lazy(() => import("./SiteFooter"));

const HomePage = () => {
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

  const sectionHeaders = data.sectionHeaders;
  const categories = data.categories ?? [];
  const featuredProducts = data.featuredProducts ?? [];
  const trendingProducts = data.trendingProducts ?? [];

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <div className="space-y-10 px-4 py-6 sm:px-6 sm:py-8">
          <section className="space-y-4">
            {data.hero ? (
              <Suspense fallback={<Loader />}>
                <HeroSection data={data.hero} />
              </Suspense>
            ) : null}
            {sectionHeaders?.categories ? (
              <div className="-mt-28 px-4 pt-20 sm:px-8">
                <Suspense fallback={<SectionSkeleton />}>
                  <CategorySection
                    categories={categories.slice(0, UI_LIMITS.categoryVisibleCount)}
                    header={sectionHeaders.categories}
                    showHeader={false}
                  />
                </Suspense>
              </div>
            ) : null}
          </section>

          {sectionHeaders?.featuredProducts || sectionHeaders?.trendingProducts ? (
            <div className="grid gap-8 xl:grid-cols-2">
              {sectionHeaders?.featuredProducts ? (
                <Suspense fallback={<SectionSkeleton cards={UI_LIMITS.compactVisibleCount} />}>
                  <FeaturedProducts
                    actionLabel={
                      sectionHeaders.featuredProducts.ctaLabel ??
                      UI_MESSAGES.defaultProductActionLabel
                    }
                    header={sectionHeaders.featuredProducts}
                    products={featuredProducts.slice(0, UI_LIMITS.compactVisibleCount)}
                  />
                </Suspense>
              ) : null}

              {sectionHeaders?.trendingProducts ? (
                <Suspense fallback={<SectionSkeleton cards={UI_LIMITS.compactVisibleCount} />}>
                  <TrendingProducts
                    actionLabel={
                      sectionHeaders.trendingProducts.ctaLabel ??
                      UI_MESSAGES.defaultProductActionLabel
                    }
                    header={sectionHeaders.trendingProducts}
                    products={trendingProducts.slice(0, UI_LIMITS.compactVisibleCount)}
                  />
                </Suspense>
              ) : null}
            </div>
          ) : null}

          {data.promoBanner ? (
            <Suspense fallback={<SectionSkeleton cards={2} />}>
              <PromoBanner data={data.promoBanner} />
            </Suspense>
          ) : null}

          {sectionHeaders?.featuredProducts || sectionHeaders?.trendingProducts ? (
            <div className="grid gap-8 xl:grid-cols-2">
              {sectionHeaders?.featuredProducts ? (
                <Suspense fallback={<SectionSkeleton cards={UI_LIMITS.compactVisibleCount} />}>
                  <FeaturedProducts
                    actionLabel={
                      sectionHeaders.featuredProducts.ctaLabel ??
                      UI_MESSAGES.defaultProductActionLabel
                    }
                    header={sectionHeaders.featuredProducts}
                    products={featuredProducts.slice(
                      UI_LIMITS.compactVisibleCount,
                      UI_LIMITS.compactVisibleCount * 2,
                    )}
                  />
                </Suspense>
              ) : null}
              {sectionHeaders?.trendingProducts ? (
                <Suspense fallback={<SectionSkeleton cards={UI_LIMITS.compactVisibleCount} />}>
                  <TrendingProducts
                    actionLabel={
                      sectionHeaders.trendingProducts.ctaLabel ??
                      UI_MESSAGES.defaultProductActionLabel
                    }
                    header={sectionHeaders.trendingProducts}
                    products={trendingProducts.slice(
                      UI_LIMITS.compactVisibleCount,
                      UI_LIMITS.compactVisibleCount * 2,
                    )}
                  />
                </Suspense>
              ) : null}
            </div>
          ) : null}
        </div>

        {sectionHeaders?.newsletter && data.newsletter ? (
          <Suspense fallback={<SectionSkeleton cards={1} />}>
            <NewsletterSection
              data={data.newsletter}
              header={sectionHeaders.newsletter}
            />
          </Suspense>
        ) : null}
        {data.footer ? (
          <Suspense fallback={<Loader />}>
            <SiteFooter data={data.footer} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
