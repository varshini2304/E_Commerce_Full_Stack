import { useCreateProduct } from "../hooks/useVendorData";
import { VendorLayout } from "../components/VendorLayout";
import { ProductForm } from "../components/ProductForm";
import { navigateTo } from "../../../shared/utils/navigation";
import type { ProductRequest } from "../types/vendor.types";
import { useState } from "react";

export default function VendorAddProductPage() {
  const createMutation = useCreateProduct();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (data: ProductRequest) => {
    setSuccess(false);
    createMutation.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => navigateTo("/vendor/products"), 1500);
      },
    });
  };

  return (
    <VendorLayout
      title="Add Product"
      subtitle="Create a new listing for your store"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 px-5 py-4 ring-1 ring-emerald-500/20">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-emerald-300">
              Product created! Redirecting to your listings…
            </p>
          </div>
        )}

        {/* API Error */}
        {createMutation.isError && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400 ring-1 ring-red-500/20">
            {(createMutation.error as any)?.response?.data?.message ?? "Failed to create product. Please try again."}
          </div>
        )}

        {/* Tip */}
        <div className="flex items-start gap-3 rounded-xl bg-indigo-500/10 px-4 py-3 ring-1 ring-indigo-500/20">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-indigo-300">
            After saving, inventory will be auto-created via Kafka — no extra steps needed.
          </p>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Product"
        />
      </div>
    </VendorLayout>
  );
}
