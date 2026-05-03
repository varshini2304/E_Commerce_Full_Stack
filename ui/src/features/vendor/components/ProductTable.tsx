import type { Product } from "../types/vendor.types";
import { navigateTo } from "../../../shared/utils/navigation";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ProductTable({ products, onDelete, isDeleting }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700/50">
          <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-300">No products yet</p>
        <p className="mt-1 text-sm text-slate-500">Add your first product to start selling</p>
        <button
          onClick={() => navigateTo("/vendor/products/new")}
          className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Product</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">SKU</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Price</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Stock</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {products.map((product) => (
            <tr key={product.id} className="bg-slate-900/40 transition-colors hover:bg-slate-800/40">
              {/* Product */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">N/A</div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.categorySlug}</p>
                  </div>
                </div>
              </td>
              {/* SKU */}
              <td className="px-5 py-4">
                <span className="rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
                  {product.sku}
                </span>
              </td>
              {/* Price */}
              <td className="px-5 py-4">
                <span className="font-semibold text-white">${product.finalPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <span className="ml-1.5 text-xs text-slate-500 line-through">${product.price.toFixed(2)}</span>
                )}
              </td>
              {/* Stock */}
              <td className="px-5 py-4">
                <span className={`font-semibold ${product.stock <= 5 ? "text-red-400" : product.stock <= 20 ? "text-amber-400" : "text-emerald-400"}`}>
                  {product.stock}
                </span>
              </td>
              {/* Status */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  product.isActive
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                    : "bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/50"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-emerald-400" : "bg-slate-500"}`} />
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigateTo(`/vendor/products/edit/${product.id}`)}
                    className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/20 transition hover:bg-indigo-500/20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
