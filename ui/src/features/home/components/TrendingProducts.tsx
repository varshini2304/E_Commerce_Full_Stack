import { memo } from "react";
import { ProductData, SectionHeaderContent } from "../../../types/home";
import { ProductCard, SectionHeader } from "../../../shared/components";

interface TrendingProductsProps {
  header: SectionHeaderContent;
  products: ProductData[];
  actionLabel: string;
  compact?: boolean;
}

const TrendingProducts = memo(
  ({ header, products, actionLabel, compact = true }: TrendingProductsProps) => (
    <section className="space-y-6">
      <SectionHeader title={header.title} subtitle={header.subtitle} />
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          compact ? "xl:grid-cols-3" : "lg:grid-cols-4"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            actionLabel={actionLabel}
            key={product.id}
            product={product}
            variant={compact ? "compact" : "default"}
          />
        ))}
      </div>
    </section>
  ),
);

TrendingProducts.displayName = "TrendingProducts";

export default TrendingProducts;
