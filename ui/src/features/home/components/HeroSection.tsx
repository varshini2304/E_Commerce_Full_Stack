import { Button } from "../../../shared/components";
import { HeroSectionData } from "../../../types/home";

interface HeroSectionProps {
  data: HeroSectionData;
}

const HeroSection = ({ data }: HeroSectionProps) => (
  <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#8f95e8] via-[#b3b6f5] to-[#d2d4fa] px-6 py-10 text-[#253163] md:grid md:grid-cols-2 md:items-center md:gap-6 md:px-10 md:py-12">
    <div className="relative z-10">
      {data.eyebrow ? (
        <p className="mb-4 inline-flex rounded-full bg-[#f47f74] px-4 py-1 text-xs font-semibold tracking-wide text-white">
          {data.eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[3rem]">
        {data.title}
      </h1>
      <p className="mt-4 max-w-xl text-sm text-[#33416f]/90 sm:text-base">
        {data.subtitle}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {data.primaryAction ? (
          <a href={data.primaryAction.href}>
            <Button>{data.primaryAction.label}</Button>
          </a>
        ) : null}
        {data.secondaryAction ? (
          <a href={data.secondaryAction.href}>
            <Button variant="ghost">
              {data.secondaryAction.label}
            </Button>
          </a>
        ) : null}
      </div>
    </div>
    <div className="relative z-10 mt-8 overflow-hidden rounded-2xl bg-white/20 p-2 md:mt-0">
      <img
        src={data.imageUrl}
        alt={data.imageAlt}
        className="h-full w-full rounded-xl object-cover"
      />
    </div>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.22),transparent_40%)]" />
  </section>
);

export default HeroSection;
