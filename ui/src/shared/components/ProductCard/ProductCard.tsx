import { memo } from "react";
import { ProductData } from "../../../types/home";
import { APP_CONFIG, UI_LIMITS } from "../../constants/config";
import { Button } from "../Button/Button";

interface ProductCardProps {
  product: ProductData;
  actionLabel: string;
  variant?: "default" | "compact";
  onAction?: (product: ProductData) => void;
  onCardClick?: (product: ProductData) => void;
}

export const ProductCard = memo(
  ({ product, actionLabel, variant = "compact", onAction, onCardClick }: ProductCardProps) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency ?? APP_CONFIG.defaultCurrency,
    });

    const filledStars = Math.round(product.rating ?? 0);
    const imageClassName =
      variant === "compact" ? "h-32 rounded-xl" : "h-56 rounded-2xl";
    const titleClassName =
      variant === "compact" ? "text-sm font-semibold" : "text-lg font-semibold";

    return (
      <article
        className={`group overflow-hidden rounded-2xl border border-[#e3e7f8] bg-white p-2 shadow-sm transition-shadow hover:shadow-md ${onCardClick ? "cursor-pointer" : ""}`}
        onClick={() => onCardClick?.(product)}
        onKeyDown={(event) => {
          if (!onCardClick) {
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onCardClick(product);
          }
        }}
        role={onCardClick ? "button" : undefined}
        tabIndex={onCardClick ? 0 : undefined}
      >
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`${imageClassName} w-full object-cover`}
            loading="lazy"
          />
          {product.badge ? (
            <span className="absolute right-2 top-2 rounded-full bg-[#f47f74] px-2 py-0.5 text-[11px] font-semibold text-white">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-2 px-1 pb-1 pt-3">
          <h3 className={`line-clamp-1 text-[#1f2b59] ${titleClassName}`}>{product.name}</h3>
          <p className="line-clamp-1 text-xs text-[#707aa1]">{product.description}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: UI_LIMITS.ratingStarCount }).map((_, index) => (
              <svg
                className={`h-3 w-3 ${index < filledStars ? "text-[#f5a623]" : "text-[#d6dbef]"}`}
                fill="currentColor"
                key={index}
                viewBox="0 0 24 24"
              >
                <path d="m12 3.8 2.6 5.2 5.7.8-4.1 4 1 5.6L12 16.7 6.8 19.4l1-5.6-4.1-4 5.7-.8L12 3.8Z" />
              </svg>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-bold text-[#1f2b59]">
              {formatter.format(product.price)}
            </p>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onAction?.(product);
              }}
              size="sm"
              type="button"
              variant="navy"
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </article>
    );
  },
);

ProductCard.displayName = "ProductCard";
