import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import { useTerms } from "../hooks/useTerms";
import TableOfContents from "./TableOfContents";
import TermsSection from "./TermsSection";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const TermsPage = () => {
  const { data: homeData } = useHomeData();
  const { data, isLoading, isError, refetch } = useTerms();

  const sectionIds = useMemo(
    () => (data?.sections ?? []).map((section) => slugify(section.title)),
    [data?.sections],
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    setActiveSectionId(sectionIds[0]);
  }, [sectionIds]);

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry?.target.id) {
          setActiveSectionId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {homeData?.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={homeData.navigation} />
          </Suspense>
        ) : null}

        <main className="space-y-6 bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-8">
          <header className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#2b3869]">Terms &amp; Conditions</h1>
            <p className="mt-2 text-sm text-[#69749f]">
              Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : "-"}
            </p>
          </header>

          {isLoading ? <Loader /> : null}

          {isError ? (
            <ErrorState
              message="We could not fetch the latest terms content from the server."
              onRetry={() => {
                void refetch();
              }}
            />
          ) : null}

          {data ? (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <TableOfContents
                activeSectionId={activeSectionId}
                onSelect={scrollToSection}
                sections={data.sections}
              />

              <section className="space-y-8 rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
                {data.sections.map((section) => (
                  <TermsSection id={slugify(section.title)} key={section.title} section={section} />
                ))}
              </section>
            </div>
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

export default TermsPage;
