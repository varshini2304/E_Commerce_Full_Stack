import { lazy, Suspense } from "react";
import { useOrderTracking } from "../hooks/useOrderTracking";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import StatusBadge from "./StatusBadge";

const OrderTimeline = lazy(() => import("./OrderTimeline"));
const OrderSummaryCard = lazy(() => import("./OrderSummaryCard"));
const DeliveryDetails = lazy(() => import("./DeliveryDetails"));
const ProductList = lazy(() => import("./ProductList"));

const getOrderIdFromPath = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return decodeURIComponent(window.location.pathname.split("/")[2] ?? "");
};

const TrackOrderPage = () => {
  const orderId = getOrderIdFromPath();
  const { data, isLoading, isError, refetch } = useOrderTracking(orderId);

  if (!orderId) {
    return (
      <ErrorState
        description="We couldn't find a valid order id in the URL."
        title="Invalid order link"
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        description="Failed to fetch order details from the server."
        onRetry={() => {
          void refetch();
        }}
        title="Could not load tracking"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-[#dfe5fb] bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-[#2b3869]">Track Your Order</h1>
            <p className="mt-1 text-sm text-[#6f79a3]">Order ID: {data.id}</p>
          </div>
          <StatusBadge status={data.status} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Suspense fallback={<Loader />}>
          <OrderTimeline steps={data.timeline} />
        </Suspense>

        <div className="space-y-6">
          <Suspense fallback={<Loader />}>
            <OrderSummaryCard
              paymentMethod={data.paymentMethod}
              paymentStatus={data.paymentStatus}
              totalAmount={data.totalAmount}
            />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <DeliveryDetails details={data.deliveryDetails} />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <ProductList items={data.products} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
