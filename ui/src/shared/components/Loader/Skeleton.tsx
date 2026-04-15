import { UI_LIMITS } from "../../constants/config";

interface SectionSkeletonProps {
  cards?: number;
}

export const SectionSkeleton = ({
  cards = UI_LIMITS.cardSkeletonCount,
}: SectionSkeletonProps) => (
  <div className="grid grid-cols gap-4 sm:grid-cols-4 lg:grid-cols-4">
    {Array.from({ length: cards }).map((_, index) => (
      <div
        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
        key={index}
      >
        <div className="h-40 rounded-lg bg-slate-200" />
        <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
      </div>
    ))}
  </div>
);
