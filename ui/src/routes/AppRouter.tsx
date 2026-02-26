import AdminLoginPage from "../features/auth/components/AdminLoginPage";
import AdminDashboardPage from "../features/auth/components/AdminDashboardPage";
import AdminAddProductPage from "../features/auth/components/AdminAddProductPage";
import AdminInventoryPage from "../features/auth/components/AdminInventoryPage";
import AdminOrderManagementPage from "../features/auth/components/AdminOrderManagementPage";
import AdminManageProductsPage from "../features/auth/components/AdminManageProductsPage";
import HomePage from "../features/home/components/HomePage";
import MyOrdersPage from "../features/orders/components/MyOrdersPage";
import OrderSuccessPage from "../features/orders/components/OrderSuccessPage";
import ProductDisplayPage from "../features/products/components/ProductDisplayPage";
import { MainLayout } from "../layouts/MainLayout";

export const AppRouter = () => {
  const pathname = window.location.pathname;
  const isAdminLoginPage = pathname.startsWith("/admin/login");
  const isAdminDashboardPage = pathname.startsWith("/admin/dashboard");
  const isAdminAddProductPage = pathname.startsWith("/admin/products/new");
  const isAdminManageProductsPage = pathname.startsWith("/admin/products/manage");
  const isAdminInventoryPage = pathname.startsWith("/admin/inventory");
  const isAdminOrderManagementPage = pathname.startsWith("/admin/orders/manage");
  const isProductPage = pathname.startsWith("/product");
  const isOrderSuccessPage = pathname.startsWith("/order-success");
  const isOrdersPage = pathname.startsWith("/orders") || pathname.startsWith("/my-orders");

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
      ) : isOrderSuccessPage ? (
        <OrderSuccessPage />
      ) : isProductPage ? (
        <ProductDisplayPage />
      ) : (
        <HomePage />
      )}
    </MainLayout>
  );
};
