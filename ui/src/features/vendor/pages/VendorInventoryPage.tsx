import { useVendorAuth } from "../hooks/useVendorAuth";
import { useVendorInventory } from "../hooks/useVendorData";
import { VendorLayout } from "../components/VendorLayout";
import { InventoryTable } from "../components/InventoryTable";

export default function VendorInventoryPage() {
  const { vendor } = useVendorAuth();
  const vendorId = vendor?.id ?? "";

  const { data: inventory = [], isLoading, isError, refetch } = useVendorInventory(vendorId);

  const totalStock = inventory.reduce((s, i) => s + i.availableStock, 0);
  const totalReserved = inventory.reduce((s, i) => s + i.reservedStock, 0);
  const outOfStock = inventory.filter((i) => i.availableStock === 0).length;
  const lowStock = inventory.filter((i) => i.availableStock > 0 && i.availableStock <= 10).length;

  return (
    <VendorLayout
      title="Inventory"
      subtitle="Real-time stock levels across all your products"
      headerActions={
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Summary Tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Products Tracked", value: inventory.length, color: "text-white" },
            { label: "Total Available", value: totalStock.toLocaleString(), color: "text-emerald-400" },
            { label: "Reserved (Orders)", value: totalReserved.toLocaleString(), color: "text-amber-400" },
            { label: "Out of Stock", value: outOfStock, color: outOfStock > 0 ? "text-red-400" : "text-slate-400" },
          ].map((tile) => (
            <div key={tile.label} className="rounded-2xl bg-slate-800/50 p-5 ring-1 ring-slate-700/50">
              <p className="text-xs text-slate-400">{tile.label}</p>
              <p className={`mt-1 text-2xl font-bold ${tile.color}`}>{tile.value}</p>
            </div>
          ))}
        </div>

        {/* Low Stock Warning */}
        {lowStock > 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 px-5 py-3.5 ring-1 ring-amber-500/20">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-300">
              <span className="font-semibold">{lowStock} product{lowStock > 1 ? "s" : ""}</span> {lowStock > 1 ? "are" : "is"} running low (≤10 units). Consider restocking soon.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400 ring-1 ring-red-500/20">
            Failed to load inventory data. Please click Refresh to try again.
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <p className="text-xs text-slate-500">
              Inventory is automatically managed via Kafka events. Stock auto-creates when you add a product.
            </p>
            <InventoryTable items={inventory} />
          </>
        )}
      </div>
    </VendorLayout>
  );
}
