interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionHeader = ({
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) => (
  <header className={align === "center" ? "text-center" : "text-left"}>
    <h2 className="text-3xl font-bold tracking-tight text-[#1f2b59] sm:text-3xl">
      {title}
    </h2>
    {subtitle ? (
      <p className="mt-2 text-sm text-[#68739c] sm:text-base">{subtitle}</p>
    ) : null}
  </header>
);
