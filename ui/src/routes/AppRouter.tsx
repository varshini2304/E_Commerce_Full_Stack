import { useEffect, useState } from "react";
import AdminLoginPage from "../features/auth/components/AdminLoginPage";
import AdminDashboardPage from "../features/auth/components/AdminDashboardPage";
import AdminAddProductPage from "../features/auth/components/AdminAddProductPage";
import AdminInventoryPage from "../features/auth/components/AdminInventoryPage";
import AdminOrderManagementPage from "../features/auth/components/AdminOrderManagementPage";
import AdminManageProductsPage from "../features/auth/components/AdminManageProductsPage";
import HomePage from "../features/home/components/HomePage";
import MyOrdersPage from "../features/orders/components/MyOrdersPage";
import OrderSuccessPage from "../features/orders/components/OrderSuccessPage";
import CheckoutPage from "../features/orders/components/CheckoutPage";
import TrackOrderPage from "../features/order-tracking/components/TrackOrderPage";
import CartPage from "../features/cart/components/CartPage";
import ProfilePage from "../features/profile/components/ProfilePage";
import CategoryPage from "../features/products/components/CategoryPage";
import ProductDisplayPage from "../features/products/components/ProductDisplayPage";
import { MainLayout } from "../layouts/MainLayout";
import { APP_NAVIGATE_EVENT } from "../shared/utils/navigation";
import WishListPage from "../features/wishlist/components/WishListPage";
import ContactPage from "../features/contact/components/ContactPage";
import PrivacyPolicyPage from "../features/privacy-policy/components/PrivacyPolicyPage";
import TermsPage from "../features/terms/components/TermsPage";
import AboutPage from "../features/about/components/AboutPage";

// ── Vendor Dashboard ──────────────────────────────────────────
import VendorLoginPage from "../features/vendor/pages/VendorLoginPage";
import VendorDashboardPage from "../features/vendor/pages/VendorDashboardPage";
import VendorManageProductsPage from "../features/vendor/pages/VendorManageProductsPage";
import VendorAddProductPage from "../features/vendor/pages/VendorAddProductPage";
import VendorEditProductPage from "../features/vendor/pages/VendorEditProductPage";
import VendorInventoryPage from "../features/vendor/pages/VendorInventoryPage";

export const AppRouter = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPathname = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncPathname);
    window.addEventListener(APP_NAVIGATE_EVENT, syncPathname);
    return () => {
      window.removeEventListener("popstate", syncPathname);
      window.removeEventListener(APP_NAVIGATE_EVENT, syncPathname);
    };
  }, []);

  // ── Vendor routes (render outside MainLayout — own full-screen layout) ──
  const isVendorPath = pathname.startsWith("/vendor");
  if (isVendorPath) {
    if (pathname === "/vendor/login") return <VendorLoginPage />;
    if (pathname === "/vendor/dashboard") return <VendorDashboardPage />;
    if (pathname === "/vendor/products/new") return <VendorAddProductPage />;
    if (pathname.startsWith("/vendor/products/edit/")) return <VendorEditProductPage />;
    if (pathname.startsWith("/vendor/products")) return <VendorManageProductsPage />;
    if (pathname.startsWith("/vendor/inventory")) return <VendorInventoryPage />;
    // Fallback: redirect to dashboard
    return <VendorDashboardPage />;
  }

  // ── Admin & Customer routes (inside MainLayout) ──
  const isAdminLoginPage = pathname.startsWith("/admin/login");
  const isAdminDashboardPage = pathname.startsWith("/admin/dashboard");
  const isAdminAddProductPage = pathname.startsWith("/admin/products/new");
  const isAdminManageProductsPage = pathname.startsWith("/admin/products/manage");
  const isAdminInventoryPage = pathname.startsWith("/admin/inventory");
  const isAdminOrderManagementPage = pathname.startsWith("/admin/orders/manage");
  const isProductPage = pathname === "/product" || pathname.startsWith("/product/");
  const isProductsPage = pathname === "/products" || pathname.startsWith("/products/");
  const isCategoryPage = pathname.startsWith("/category/");
  const isCartPage = pathname.startsWith("/cart");
  const isCheckoutPage = pathname.startsWith("/checkout");
  const isProfilePage = pathname.startsWith("/profile");
  const isOrderSuccessPage = pathname.startsWith("/order-success");
  const isTrackOrderPage = pathname.startsWith("/orders/") && !pathname.startsWith("/orders/manage");
  const isOrdersPage = pathname.startsWith("/orders") || pathname.startsWith("/my-orders");
  const isWishlistPage = pathname.startsWith("/wishlist");
  const isContactPage = pathname.startsWith("/contact");
  const isPrivacyPage = pathname.startsWith("/privacy");
  const isTermsPage = pathname.startsWith("/terms");
  const isAboutPage = pathname.startsWith("/about");

  return (
    <MainLayout>
      {isAdminManageProductsPage ? (
        <AdminManageProductsPage />
      ) : isAdminOrderManagementPage ? (
        <AdminOrderManagementPage />
      ) : isAdminInventoryPage ? (
        <AdminInventoryPage />
      ) : isAdminAddProductPage ? (
        <AdminAddProductPage />
      ) : isAdminDashboardPage ? (
        <AdminDashboardPage />
      ) : isAdminLoginPage ? (
        <AdminLoginPage />
      ) : isTrackOrderPage ? (
        <TrackOrderPage />
      ) : isOrdersPage ? (
        <MyOrdersPage />
      ) : isCartPage ? (
        <CartPage />
      ) : isCheckoutPage ? (
        <CheckoutPage />
      ) : isProfilePage ? (
        <ProfilePage />
      ) : isCategoryPage ? (
        <CategoryPage />
      ) : isProductsPage ? (
        <CategoryPage />
      ) : isOrderSuccessPage ? (
        <OrderSuccessPage />
      ) : isWishlistPage ? (
        <WishListPage />
      ) : isContactPage ? (
        <ContactPage />
      ) : isPrivacyPage ? (
        <PrivacyPolicyPage />
      ) : isTermsPage ? (
        <TermsPage />
      ) : isAboutPage ? (
        <AboutPage />
      ) : isProductPage ? (
        <ProductDisplayPage />
      ) : (
        <HomePage />
      )}
    </MainLayout>
  );
};

