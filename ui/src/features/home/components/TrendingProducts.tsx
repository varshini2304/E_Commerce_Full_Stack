import { memo } from "react";
import { ProductData, SectionHeaderContent } from "../../../types/home";
import { ProductCard, SectionHeader } from "../../../shared/components";

interface TrendingProductsProps {
  header: SectionHeaderContent;
  products: ProductData[];
  actionLabel: string;
  compact?: boolean;
  onProductAction?: (product: ProductData) => void;
  onProductSelect?: (product: ProductData) => void;
  onProductWishlist?: (product: ProductData) => void;
  onViewAll?: () => void;
}

const TrendingProducts = memo(
  ({
    header,
    products,
    actionLabel,
    compact = true,
    onProductAction,
    onProductSelect,
    onProductWishlist,
    onViewAll,
  }: TrendingProductsProps) => (
    <section className="space-y-6">
      <SectionHeader
        title={header.title}
        subtitle={header.subtitle}
        actionLabel={onViewAll ? "View all products" : undefined}
        onAction={onViewAll}
      />
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          compact ? "xl:grid-cols-3" : "lg:grid-cols-4"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            actionLabel={actionLabel}
            key={product.id}
            onAction={onProductAction}
            onCardClick={onProductSelect}
            onWishlist={onProductWishlist}
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
