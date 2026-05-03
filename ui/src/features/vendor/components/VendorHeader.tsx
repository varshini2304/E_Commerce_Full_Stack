import type { Vendor } from "../types/vendor.types";

interface HeaderProps {
  title: string;
  subtitle?: string;
  vendor: Vendor;
  children?: React.ReactNode;
}

export function VendorHeader({ title, subtitle, vendor, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f172a]/95 px-8 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {/* Avatar */}
        <div className="flex items-center gap-3 rounded-full bg-slate-800 py-1.5 pl-3 pr-1.5 ring-1 ring-slate-700">
          <span className="text-sm text-slate-300">{vendor.name}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
            {vendor.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
