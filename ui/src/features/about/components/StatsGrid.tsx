import { AboutStat } from "../types/aboutTypes";

interface StatsGridProps {
  stats: AboutStat[];
}

const StatsGrid = ({ stats }: StatsGridProps) => (
  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat) => (
      <article className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm" key={stat.label}>
        <p className="text-2xl font-semibold text-[#2b3869]">{stat.value}</p>
        <p className="mt-1 text-sm text-[#66729d]">{stat.label}</p>
      </article>
    ))}
  </section>
);

export default StatsGrid;
