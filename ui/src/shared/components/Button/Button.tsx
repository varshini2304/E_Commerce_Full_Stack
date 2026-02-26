import { ButtonHTMLAttributes, ReactNode } from "react";

const variantClassMap = {
  primary:
    "bg-[#f47f74] text-white hover:bg-[#ef6e61] focus-visible:ring-[#f5a39b]",
  secondary:
    "bg-white text-[#1f2b59] ring-1 ring-[#d8dcf2] hover:bg-[#f4f6ff] focus-visible:ring-[#c8cff2]",
  navy:
    "bg-[#1f4690] text-white hover:bg-[#1a3b7c] focus-visible:ring-[#7d9fe2]",
  ghost:
    "bg-transparent text-[#1f2b59] hover:bg-[#eef1ff] focus-visible:ring-[#c8cff2]",
} as const;

const sizeClassMap = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variantClassMap;
  size?: keyof typeof sizeClassMap;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
      variantClassMap[variant]
    } ${sizeClassMap[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
    {...rest}
  >
    {children}
  </button>
);
