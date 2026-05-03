import { useCallback, useEffect, useState } from "react";
import type { Vendor } from "../types/vendor.types";
import { navigateTo } from "../../../shared/utils/navigation";

const TOKEN_KEY = "vendor_token";
const VENDOR_KEY = "vendor_info";

// ─── JWT Decoder (no lib needed) ──────────────────────────────
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// ─── useVendorAuth Hook ────────────────────────────────────────
export function useVendorAuth() {
  const [vendor, setVendor] = useState<Vendor | null>(() => {
    try {
      const raw = localStorage.getItem(VENDOR_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const isAuthenticated = !!token && !!vendor;

  // Check token expiry on mount
  useEffect(() => {
    if (token) {
      const payload = decodeJwtPayload(token);
      const exp = payload?.exp as number | undefined;
      if (exp && Date.now() / 1000 > exp) {
        logout();
      }
    }
  }, [token]);

  const login = useCallback(
    (newToken: string, newVendor: Vendor) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(VENDOR_KEY, JSON.stringify(newVendor));
      setToken(newToken);
      setVendor(newVendor);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(VENDOR_KEY);
    setToken(null);
    setVendor(null);
    navigateTo("/vendor/login");
  }, []);

  return { vendor, token, isAuthenticated, login, logout };
}
