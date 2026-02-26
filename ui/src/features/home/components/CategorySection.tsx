import { CategoryData, SectionHeaderContent } from "../../../types/home";
import { SectionHeader } from "../../../shared/components";

interface CategorySectionProps {
  header: SectionHeaderContent;
  categories: CategoryData[];
  showHeader?: boolean;
}

const categoryIconClassName = "h-5 w-5 text-[#2f3b67]";

const renderCategoryIcon = (icon?: string) => {
  if (icon === "electronics") {
    return (
      <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
        <rect
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          width="18"
          x="3"
          y="5"
        />
        <path d="M10 19h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }
  if (icon === "apparel") {
    return (
      <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
        <path
          d="M8 5a4 4 0 0 0 8 0l3 2.5-2 3-2-1V20H9V9.5l-2 1-2-3L8 5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (icon === "home") {
    return (
      <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
        <path
          d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (icon === "beauty") {
    return (
      <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
        <rect
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          width="8"
          x="8"
          y="10"
        />
        <path d="M10 10V6a2 2 0 1 1 4 0v4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (icon === "sports") {
    return (
      <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg className={categoryIconClassName} fill="none" viewBox="0 0 24 24">
      <path
        d="M6 3h12a2 2 0 0 1 2 2v14l-8-4-8 4V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
};

const CategorySection = ({
  header,
  categories,
  showHeader = true,
}: CategorySectionProps) => (
  <section className="space-y-4">
    {showHeader ? <SectionHeader title={header.title} subtitle={header.subtitle} /> : null}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <article
          className="group rounded-2xl border border-[#d7ddf7] bg-[#eef1ff] p-3 shadow-sm transition-colors hover:bg-white"
          key={category.id}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
            {category.imageUrl ? (
              <img
                alt={category.name}
                className="h-5 w-5 object-contain"
                loading="lazy"
                src={category.imageUrl}
              />
            ) : (
              renderCategoryIcon(category.icon)
            )}
          </div>
          <div className="pt-3">
            <h3 className="text-sm font-semibold text-[#283664]">{category.name}</h3>
            {category.description ? <p className="mt-1 line-clamp-1 text-xs text-[#5e6995]">{category.description}</p> : null}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default CategorySection;
