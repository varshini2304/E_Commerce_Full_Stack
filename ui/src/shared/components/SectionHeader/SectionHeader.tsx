interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({
  title,
  subtitle,
  align = "left",
  actionLabel,
  onAction,
}: SectionHeaderProps) => (
  <header
    className={`flex flex-wrap items-end justify-between gap-3 ${
      align === "center" ? "text-center" : "text-left"
    }`}
  >
    <div>
      <h2 className="text-xl font-bold tracking-tight text-[#1f2b59] sm:text-2xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-xs text-[#68739c] sm:text-sm">{subtitle}</p>
      ) : null}
    </div>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-1 rounded-md border border-[#dbe1fb] bg-white px-3 py-1.5 text-xs font-semibold text-[#3a4775] hover:border-[#c4cdef] hover:bg-[#f4f6ff]"
      >
        {actionLabel}
        <span aria-hidden="true">→</span>
      </button>
    ) : null}
  </header>
);
