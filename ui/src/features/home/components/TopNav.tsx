import { MouseEvent, useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCartCount } from "../../cart/cartStorage";
import { HomeNavigationData } from "../../../types/home";
import { navigateTo } from "../../../shared/utils/navigation";
import { WISH_LIST_UPDATED_EVENT, getWishListCount } from "../../wishlist/WishListStorage";

interface TopNavProps {
  data: HomeNavigationData;
}

const iconClassName = "h-5 w-5 text-[#253163]";

const renderActionIcon = (icon: string) => {
  if (icon === "wishlist") {
    return (
      <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "cart") {
    return (
      <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
        <path
          d="M3 4h2l1.7 9h10.7L19 7H7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="18" fill="currentColor" r="1.5" />
        <circle cx="17" cy="18" fill="currentColor" r="1.5" />
      </svg>
    );
  }

  return (
    <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.5-3.6 4.1-5.5 8-5.5s6.5 1.9 8 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
};

const TopNav = ({ data }: TopNavProps) => {
  const [cartCount, setCartCount] = useState(() => getCartCount());
   const [wishListCount, setWishListCount] = useState(() => getWishListCount());
  const onNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!path.startsWith("/")) {
      return;
    }

    event.preventDefault();
    navigateTo(path);
  };

  useEffect(() => {
    const syncCount = () => {
      setCartCount(getCartCount());
    };

    const syncWishListCount = () => {
      setWishListCount(getWishListCount());
    };

    syncCount();
    syncWishListCount();
    window.addEventListener("storage", syncCount);
    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener(WISH_LIST_UPDATED_EVENT, syncWishListCount);
    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener(WISH_LIST_UPDATED_EVENT, syncWishListCount);
    };
  }, []);

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-[#edeefe] bg-white px-6 py-5 md:px-8">
    <a
      className="inline-flex items-center gap-2"
      href={data.homeHref ?? "/"}
      onClick={(event) => onNavigate(event, data.homeHref ?? "/")}
    >
      {data.logoUrl ? (
        <img alt={data.logoAlt ?? ""} className="h-8 w-8" src={data.logoUrl} />
      ) : (
        <svg className="h-8 w-8 text-[#3457a9]" fill="none" viewBox="0 0 24 24">
          <path
            d="M5 12l7-7 7 7M7 19h10v-5l-5-5-5 5v5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
      {data.logoText ? (
        <span className="text-sm font-semibold text-[#233168]">{data.logoText}</span>
      ) : null}
    </a>

    <form action={data.searchAction} className="min-w-[220px] flex-1 md:px-6">
      <label className="sr-only" htmlFor="search">
        {data.searchPlaceholder}
      </label>
      <div className="flex h-11 items-center gap-2 rounded-full border border-[#dee2f7] bg-[#fbfcff] px-4">
        <svg className="h-4 w-4 text-[#8a93ba]" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="m20 20-3.2-3.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
        <input
          className="w-full border-none bg-transparent text-sm text-[#2a3562] placeholder:text-[#a5acc8] focus:outline-none"
          id="search"
          name="query"
          placeholder={data.searchPlaceholder}
          type="search"
        />
      </div>
    </form>

    <nav className="ml-auto flex items-center gap-3">
      {data.actions.map((action) => {
        const badgeCount =
          action.icon === "cart" ? cartCount : action.icon === "wishlist" ? wishListCount : action.badgeCount;
        return (
          <a
            className="relative inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-[#253163] hover:bg-[#f1f3ff]"
            href={action.href}
            key={action.id}
            onClick={(event) => onNavigate(event, action.href)}
          >
            {renderActionIcon(action.icon)}
            <span className="hidden md:inline">{action.label}</span>
            {typeof badgeCount === "number" ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f47f74] px-1 text-[11px] text-white">
                {badgeCount}
              </span>
            ) : null}
          </a>
        );
      })}
    </nav>
  </header>
  );
};

export default TopNav;
