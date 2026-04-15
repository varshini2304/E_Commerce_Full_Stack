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
import CartPage from "../features/cart/components/CartPage";
import ProfilePage from "../features/profile/components/ProfilePage";
import CategoryPage from "../features/products/components/CategoryPage";
import ProductDisplayPage from "../features/products/components/ProductDisplayPage";
import { MainLayout } from "../layouts/MainLayout";
import { APP_NAVIGATE_EVENT } from "../shared/utils/navigation";
import WishListPage from "../features/wishlist/components/WishListPage";

export const AppRouter = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPathname = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", syncPathname);
    window.addEventListener(APP_NAVIGATE_EVENT, syncPathname);

    return () => {
      window.removeEventListener("popstate", syncPathname);
      window.removeEventListener(APP_NAVIGATE_EVENT, syncPathname);
    };
  }, []);

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
  const isProfilePage = pathname.startsWith("/profile");
  const isOrderSuccessPage = pathname.startsWith("/order-success");
  const isOrdersPage = pathname.startsWith("/orders") || pathname.startsWith("/my-orders");
  const isWishlistPage = pathname.startsWith("/wishlist");

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
      ) : isOrdersPage ? (
        <MyOrdersPage />
      ) : isCartPage ? (
        <CartPage />
      ) : isProfilePage ? (
        <ProfilePage />
      ) : isCategoryPage ? (
        <CategoryPage />
      ) : isProductsPage ? (
        <CategoryPage />
      ) : isOrderSuccessPage ? (
        <OrderSuccessPage />
      ) :isWishlistPage ? (
        <WishListPage />
       ): isProductPage ? (
        <ProductDisplayPage />
      ) : (
        <HomePage />
      )}
    </MainLayout>
  );
};
