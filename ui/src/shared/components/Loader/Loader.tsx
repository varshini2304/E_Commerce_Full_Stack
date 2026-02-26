import { UI_MESSAGES } from "../../constants/config";

interface LoaderProps {
  label?: string;
}

export const Loader = ({ label = UI_MESSAGES.loadingLabel }: LoaderProps) => (
  <div className="flex min-h-[280px] items-center justify-center" role="status">
    <div className="flex items-center gap-3 text-slate-700">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  </div>
);
