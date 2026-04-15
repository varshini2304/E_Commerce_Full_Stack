export const APP_CONFIG = {
  maxContainerWidthClass: "max-w-6xl",
  defaultCurrency: "USD",
} as const;

export const QUERY_KEYS = {
  home: ["home"] as const,
  profilePage: ["profile-page"] as const,
  staleTimeMs: 60_000,
  gcTimeMs: 300_000,
  retryCount: 2,
} as const;

export const UI_LIMITS = {
  categoryVisibleCount: 6,
  featuredVisibleCount: 4,
  trendingVisibleCount: 4,
  compactVisibleCount: 4,
  sectionSkeletonCount: 4,
  cardSkeletonCount: 4,
  ratingStarCount: 5,
} as const;

export const API_ENDPOINTS = {
  home: "/api/home",
  profilePage: "/api/profile-page",
} as const;

export const UI_MESSAGES = {
  loadingLabel: "Loading content",
  genericErrorTitle: "Something went wrong",
  genericErrorDescription: "Please refresh and try again.",
  defaultProductActionLabel: "Add to cart",
  newsletterEmailType: "email",
} as const;
