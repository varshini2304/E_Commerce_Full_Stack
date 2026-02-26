import { Button } from "../../../shared/components";
import { PromoBannerData } from "../../../types/home";

interface PromoBannerProps {
  data: PromoBannerData;
}

const PromoBanner = ({ data }: PromoBannerProps) => (
  <section className="grid items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#7e87e8] to-[#a4aaf0] px-6 py-8 text-white md:grid-cols-2 md:px-8">
    <div>
      {data.badge ? (
        <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          {data.badge}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold sm:text-3xl">{data.title}</h2>
      <p className="mt-3 text-sm text-white/90 sm:text-base">{data.description}</p>
      {data.action ? (
        <a className="mt-6 inline-flex" href={data.action.href}>
          <Button>{data.action.label}</Button>
        </a>
      ) : null}
    </div>
    <div className="justify-self-end overflow-hidden rounded-2xl border border-white/20">
      <img src={data.imageUrl} alt={data.imageAlt} className="h-52 w-full object-cover" />
    </div>
  </section>
);

export default PromoBanner;
