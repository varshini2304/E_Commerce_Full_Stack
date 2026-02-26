export interface LinkAction {
  label: string;
  href: string;
}

export interface IconAction extends LinkAction {
  id: string;
  icon: "wishlist" | "cart" | "profile" | "home" | "search" | string;
  badgeCount?: number;
}

export interface SectionHeaderContent {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
}

export interface HeroSectionData {
  eyebrow?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  primaryAction?: LinkAction;
  secondaryAction?: LinkAction;
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  icon?: "electronics" | "apparel" | "home" | "beauty" | "sports" | "books" | string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

export interface PromoBannerData {
  badge?: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  action?: LinkAction;
}

export interface NewsletterData {
  title: string;
  description: string;
  emailPlaceholder: string;
  submitLabel: string;
  disclaimer?: string;
  actionUrl: string;
  method?: "post" | "get";
}

export interface HomeNavigationData {
  logoUrl?: string;
  logoAlt?: string;
  logoText?: string;
  homeHref?: string;
  searchPlaceholder: string;
  searchAction: string;
  actions: IconAction[];
}

export interface SocialLink {
  id: string;
  icon: "facebook" | "twitter" | "pinterest" | string;
  href: string;
  label: string;
}

export interface FooterData {
  links: LinkAction[];
  socialLinks: SocialLink[];
  copyrightText: string;
}

export interface HomeApiResponse {
  navigation?: HomeNavigationData;
  sectionHeaders: {
    categories: SectionHeaderContent;
    featuredProducts: SectionHeaderContent;
    trendingProducts: SectionHeaderContent;
    newsletter: SectionHeaderContent;
  };
  hero: HeroSectionData;
  categories: CategoryData[];
  featuredProducts: ProductData[];
  trendingProducts: ProductData[];
  promoBanner: PromoBannerData;
  newsletter: NewsletterData;
  footer?: FooterData;
}
