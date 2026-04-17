import { lazy, Suspense } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { useAboutContent } from "../hooks/useAboutContent";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import StatsGrid from "./StatsGrid";
import ValueList from "./ValueList";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const AboutPage = () => {
  const { data: homeData } = useHomeData();
  const { data, isLoading, isError, refetch } = useAboutContent();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {homeData?.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={homeData.navigation} />
          </Suspense>
        ) : null}

        <main className="space-y-6 bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-8">
          {isLoading ? <Loader /> : null}

          {isError ? (
            <ErrorState
              message="We could not fetch About content from the server."
              onRetry={() => {
                void refetch();
              }}
            />
          ) : null}

          {data ? (
            <>
              <section className="overflow-hidden rounded-2xl border border-[#dfe5fb] bg-white shadow-sm">
                <img alt={data.title} className="h-64 w-full object-cover" src={data.heroImage} />
                <div className="space-y-3 p-6">
                  <h1 className="text-3xl font-semibold text-[#2b3869]">{data.title}</h1>
                  <p className="text-sm text-[#5f6a96]">{data.subtitle}</p>
                </div>
              </section>

              <StatsGrid stats={data.stats} />

              <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#2b3869]">Our Story</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f6a96]">{data.story}</p>
                </article>

                <article className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#2b3869]">Mission &amp; Vision</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f6a96]">
                    <span className="font-semibold text-[#2b3869]">Mission: </span>
                    {data.mission}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f6a96]">
                    <span className="font-semibold text-[#2b3869]">Vision: </span>
                    {data.vision}
                  </p>
                </article>
              </section>

              <ValueList values={data.values} />
            </>
          ) : null}
        </main>

        {homeData?.footer ? (
          <Suspense fallback={<Loader />}>
            <SiteFooter data={homeData.footer} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default AboutPage;
