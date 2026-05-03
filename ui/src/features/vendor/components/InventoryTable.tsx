import type { InventoryItem } from "../types/vendor.types";

interface InventoryTableProps {
  items: InventoryItem[];
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20">Out of Stock</span>;
  if (stock <= 5) return <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20">Critical</span>;
  if (stock <= 20) return <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">Low</span>;
  return <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">Healthy</span>;
}

export function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-20 text-center">
        <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-3 text-base font-semibold text-slate-400">No inventory data yet</p>
        <p className="text-sm text-slate-600">Inventory is auto-created when you add products</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Product ID</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Available</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Reserved</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Total</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {items.map((item) => {
            const total = item.availableStock + item.reservedStock;
            const fillPct = total > 0 ? (item.availableStock / total) * 100 : 0;
            return (
              <tr key={item.id} className="bg-slate-900/40 transition-colors hover:bg-slate-800/40">
                <td className="px-5 py-4 font-mono text-xs text-slate-400">
                  {item.productId.slice(0, 20)}…
                </td>
                <td className="px-5 py-4">
                  <div>
                    <span className="text-lg font-bold text-white">{item.availableStock}</span>
                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className={`h-full rounded-full transition-all ${fillPct > 50 ? "bg-emerald-500" : fillPct > 20 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium text-amber-400">{item.reservedStock}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium text-slate-200">{total}</span>
                </td>
                <td className="px-5 py-4">
                  <StockBadge stock={item.availableStock} />
                </td>
                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
