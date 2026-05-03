import { useState, useEffect } from "react";
import { useVendorProducts, useUpdateProduct } from "../hooks/useVendorData";
import { VendorLayout } from "../components/VendorLayout";
import { ProductForm } from "../components/ProductForm";
import { navigateTo } from "../../../shared/utils/navigation";
import type { ProductRequest, Product } from "../types/vendor.types";
import { useVendorAuth } from "../hooks/useVendorAuth";

export default function VendorEditProductPage() {
  const { vendor } = useVendorAuth();
  const vendorId = vendor?.id ?? "";
  
  // Extract ID from URL path (e.g. /vendor/products/edit/123)
  const productId = window.location.pathname.split("/").pop();

  const { data, isLoading } = useVendorProducts(vendorId);
  const updateMutation = useUpdateProduct();
  const [success, setSuccess] = useState(false);

  const product = data?.products?.find((p) => p.id === productId);

  const handleSubmit = (formData: ProductRequest) => {
    if (!productId) return;
    setSuccess(false);
    updateMutation.mutate({ id: productId, data: formData }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => navigateTo("/vendor/products"), 1500);
      },
    });
  };

  if (isLoading) {
    return (
      <VendorLayout title="Edit Product">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      </VendorLayout>
    );
  }

  if (!product) {
    return (
      <VendorLayout title="Edit Product">
        <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400 ring-1 ring-red-500/20">
          Product not found.
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout
      title="Edit Product"
      subtitle={`Updating ${product.name}`}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 px-5 py-4 ring-1 ring-emerald-500/20">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-emerald-300">
              Product updated successfully! Redirecting…
            </p>
          </div>
        )}

        {/* API Error */}
        {updateMutation.isError && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400 ring-1 ring-red-500/20">
            {(updateMutation.error as any)?.response?.data?.message ?? "Failed to update product. Please try again."}
          </div>
        )}

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </div>
    </VendorLayout>
  );
}
