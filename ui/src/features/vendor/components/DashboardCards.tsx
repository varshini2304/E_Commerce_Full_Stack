interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  positive?: boolean;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, delta, positive, icon, accent }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 p-6 ring-1 ring-slate-700/50 transition-all hover:ring-slate-600">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 ${accent}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
          {delta && (
            <p className={`mt-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
              {positive ? "▲" : "▼"} {delta}
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardCardsProps {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  activeProducts: number;
}

export function DashboardCards({
  totalProducts,
  totalStock,
  lowStockCount,
  activeProducts,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Products"
        value={totalProducts}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
        accent="bg-indigo-500"
      />
      <StatCard
        label="Active Listings"
        value={activeProducts}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        accent="bg-emerald-500"
      />
      <StatCard
        label="Total Stock Units"
        value={totalStock.toLocaleString()}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        }
        accent="bg-sky-500"
      />
      <StatCard
        label="Low Stock Alerts"
        value={lowStockCount}
        positive={lowStockCount === 0}
        delta={lowStockCount > 0 ? `${lowStockCount} need restocking` : "All stocked"}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
        accent={lowStockCount > 0 ? "bg-amber-500" : "bg-emerald-500"}
      />
    </div>
  );
}
