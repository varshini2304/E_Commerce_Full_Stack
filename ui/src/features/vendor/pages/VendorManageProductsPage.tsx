import { useState } from "react";
import { useVendorAuth } from "../hooks/useVendorAuth";
import { useVendorProducts, useDeleteProduct } from "../hooks/useVendorData";
import { VendorLayout } from "../components/VendorLayout";
import { ProductTable } from "../components/ProductTable";
import { navigateTo } from "../../../shared/utils/navigation";

export default function VendorManageProductsPage() {
  const { vendor } = useVendorAuth();
  const vendorId = vendor?.id ?? "";
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useVendorProducts(vendorId);
  const deleteMutation = useDeleteProduct();

  const products = (data?.products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VendorLayout
      title="My Products"
      subtitle={`${data?.total ?? 0} total listings`}
      headerActions={
        <button
          onClick={() => navigateTo("/vendor/products/new")}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      }
    >
      <div className="space-y-5">
        {/* Search bar */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-2.5 ring-1 ring-slate-700/60">
          <svg className="h-5 w-5 flex-shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* State: loading */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}

        {/* State: error */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400 ring-1 ring-red-500/20">
            Failed to load products. Please check your connection and try again.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            {search && (
              <p className="text-sm text-slate-400">
                {products.length} result{products.length !== 1 ? "s" : ""} for "{search}"
              </p>
            )}
            <ProductTable
              products={products}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          </>
        )}
      </div>
    </VendorLayout>
  );
}
