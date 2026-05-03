import { memo } from "react";
import { ProductData } from "../../../types/home";
import { APP_CONFIG, UI_LIMITS } from "../../constants/config";
import { Button } from "../Button/Button";

interface ProductCardProps {
  product: ProductData;
  actionLabel: string;
  variant?: "default" | "compact";
  onAction?: (product: ProductData) => void;
  onWishlist?: (product: ProductData) => void;
  onCardClick?: (product: ProductData) => void;
}

export const ProductCard = memo(
  ({ product, actionLabel, variant = "compact", onAction, onWishlist, onCardClick }: ProductCardProps) => {
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
        className={`group relative overflow-hidden rounded-2xl border border-[#e3e7f8] bg-white p-2 shadow-sm transition-shadow hover:shadow-md ${onCardClick ? "cursor-pointer" : ""}`}
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
          {onWishlist ? (
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={(event) => {
                event.stopPropagation();
                onWishlist(product);
              }}
              className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#c24545] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#a63a3a]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
                />
              </svg>
            </button>
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
