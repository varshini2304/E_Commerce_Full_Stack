import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { vendorAuthApi } from "../api/vendor.api";
import { useVendorAuth } from "../hooks/useVendorAuth";
import { navigateTo } from "../../../shared/utils/navigation";
import type { LoginRequest, RegisterRequest } from "../types/vendor.types";

type Mode = "login" | "register";

const INPUT_BASE =
  "block w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition";

export default function VendorLoginPage() {
  const { login } = useVendorAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);

  // ── Login ──
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => vendorAuthApi.login(data),
    onSuccess: (data) => {
      login(data.token, data.vendor);
      navigateTo("/vendor/dashboard");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? "Invalid email or password");
    },
  });

  // ── Register ──
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => vendorAuthApi.register(data),
    onSuccess: (data) => {
      login(data.token, data.vendor);
      navigateTo("/vendor/dashboard");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? "Registration failed");
    },
  });

  const isPending = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (mode === "login") {
      loginMutation.mutate({
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      });
    } else {
      registerMutation.mutate({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        businessName: fd.get("businessName") as string,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4 py-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Seller Hub</h1>
          <p className="mt-1 text-slate-400">
            {mode === "login" ? "Sign in to your vendor account" : "Create your vendor account"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-slate-800/50 p-8 shadow-2xl ring-1 ring-slate-700/60 backdrop-blur">
          {/* Tab Toggle */}
          <div className="mb-6 flex rounded-xl bg-slate-900/60 p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
                  <input name="name" type="text" required placeholder="John Doe" className={INPUT_BASE} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Business Name</label>
                  <input name="businessName" type="text" required placeholder="Tech Gadgets Inc" className={INPUT_BASE} />
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input name="email" type="email" required placeholder="vendor@example.com" className={INPUT_BASE} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <input name="password" type="password" required placeholder="••••••••" minLength={6} className={INPUT_BASE} />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {isPending && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {isPending ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-700" />
            <span className="text-xs text-slate-500">Secured by JWT</span>
            <span className="h-px flex-1 bg-slate-700" />
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            By continuing you agree to our{" "}
            <button onClick={() => navigateTo("/terms")} className="text-indigo-400 hover:underline">
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
