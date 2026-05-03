import type { Vendor } from "../types/vendor.types";
import { navigateTo } from "../../../shared/utils/navigation";

interface SidebarProps {
  vendor: Vendor;
  activePath: string;
  onLogout: () => void;
}

const NAV_ITEMS = [
  {
    path: "/vendor/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: "/vendor/products",
    label: "My Products",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    path: "/vendor/products/new",
    label: "Add Product",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    path: "/vendor/inventory",
    label: "Inventory",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export function VendorSidebar({ vendor, activePath, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gradient-to-b from-[#0f172a] to-[#1e2a45] shadow-2xl">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Seller Hub</p>
          <p className="text-[10px] text-slate-400">Vendor Dashboard</p>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="mx-4 mt-4 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
            {vendor.businessName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{vendor.businessName}</p>
            <p className="truncate text-xs text-slate-400">{vendor.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${vendor.isVerified ? "bg-emerald-400" : "bg-amber-400"}`} />
          <span className="text-[11px] text-slate-400">
            {vendor.isVerified ? "Verified Seller" : "Pending Verification"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath.startsWith(item.path) &&
            !(item.path === "/vendor/dashboard" && activePath !== "/vendor/dashboard");
          const exactActive = activePath === item.path ||
            (item.path === "/vendor/products" && activePath === "/vendor/products");
          const active = item.path === "/vendor/dashboard" ? activePath === item.path : exactActive || (item.path !== "/vendor/products/new" && activePath.startsWith(item.path) && item.path !== "/vendor/dashboard");

          return (
            <button
              key={item.path}
              onClick={() => navigateTo(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`transition-colors ${active ? "text-indigo-400" : "group-hover:text-slate-300"}`}>
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
