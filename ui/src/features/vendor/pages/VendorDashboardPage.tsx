import { useVendorAuth } from "../hooks/useVendorAuth";
import { useVendorProducts } from "../hooks/useVendorData";
import { useVendorInventory } from "../hooks/useVendorData";
import { VendorLayout } from "../components/VendorLayout";
import { DashboardCards } from "../components/DashboardCards";
import { navigateTo } from "../../../shared/utils/navigation";

export default function VendorDashboardPage() {
  const { vendor } = useVendorAuth();
  const vendorId = vendor?.id ?? "";

  const { data: productsData, isLoading: loadingProducts } = useVendorProducts(vendorId);
  const { data: inventoryData, isLoading: loadingInventory } = useVendorInventory(vendorId);

  const products = productsData?.products ?? [];
  const inventory = inventoryData ?? [];

  const totalStock = inventory.reduce((sum, i) => sum + i.availableStock, 0);
  const lowStockCount = inventory.filter((i) => i.availableStock <= 10).length;
  const activeProducts = products.filter((p) => p.isActive).length;

  const isLoading = loadingProducts || loadingInventory;

  return (
    <VendorLayout
      title="Dashboard"
      subtitle={`Welcome back, ${vendor?.name}`}
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
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards */}
          <DashboardCards
            totalProducts={products.length}
            totalStock={totalStock}
            lowStockCount={lowStockCount}
            activeProducts={activeProducts}
          />

          {/* Quick Actions */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Add New Product", desc: "List a new item for sale", icon: "➕", path: "/vendor/products/new", accent: "from-indigo-500/20 to-indigo-500/5" },
                { label: "Manage Products", desc: "Edit or remove listings", icon: "📦", path: "/vendor/products", accent: "from-sky-500/20 to-sky-500/5" },
                { label: "View Inventory", desc: "Check stock levels", icon: "📋", path: "/vendor/inventory", accent: "from-emerald-500/20 to-emerald-500/5" },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigateTo(action.path)}
                  className={`group flex items-start gap-4 rounded-2xl bg-gradient-to-br ${action.accent} p-5 ring-1 ring-slate-700/50 transition hover:ring-slate-600 text-left`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{action.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Products */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Recent Products</h2>
              <button onClick={() => navigateTo("/vendor/products")} className="text-xs text-indigo-400 hover:underline">
                View all →
              </button>
            </div>
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 py-14 text-center">
                <p className="text-slate-400">No products yet.</p>
                <button onClick={() => navigateTo("/vendor/products/new")}
                  className="mt-3 text-sm text-indigo-400 hover:underline">Add your first product →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700/50">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                      {product.thumbnail
                        ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">IMG</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-slate-400">${product.finalPrice.toFixed(2)} · {product.stock} units</p>
                    </div>
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full ${product.isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          {lowStockCount > 0 && (
            <div className="flex items-start gap-4 rounded-2xl bg-amber-500/10 p-5 ring-1 ring-amber-500/20">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-300">{lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low on stock</p>
                <p className="mt-0.5 text-sm text-amber-400/70">Review your inventory to avoid stockouts.</p>
              </div>
              <button onClick={() => navigateTo("/vendor/inventory")}
                className="ml-auto flex-shrink-0 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30">
                View Inventory
              </button>
            </div>
          )}
        </div>
      )}
    </VendorLayout>
  );
}
