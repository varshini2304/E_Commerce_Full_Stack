import { useEffect, useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { useVendorAuth } from "../hooks/useVendorAuth";
import { navigateTo } from "../../../shared/utils/navigation";
import { APP_NAVIGATE_EVENT } from "../../../shared/utils/navigation";

interface VendorLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function VendorLayout({ title, subtitle, children, headerActions }: VendorLayoutProps) {
  const { vendor, isAuthenticated, logout } = useVendorAuth();
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(APP_NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(APP_NAVIGATE_EVENT, sync);
    };
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !vendor) {
    navigateTo("/vendor/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <VendorSidebar vendor={vendor} activePath={pathname} onLogout={logout} />

      {/* Main content — offset by sidebar width */}
      <div className="ml-64 flex flex-1 flex-col">
        <VendorHeader title={title} subtitle={subtitle} vendor={vendor}>
          {headerActions}
        </VendorHeader>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
