import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)] py-10">
    {children}
  </div>
);
