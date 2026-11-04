import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "default" | "cream" | "dark";
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      className = "",
      id,
      name,
      disabled,
      required,
      variant = "default",
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const variantStyles = {
      default:
        "bg-[var(--cream-50)] text-[var(--ink-900)] border-[var(--cream-200)] focus:ring-[var(--gold-400)] focus:border-[var(--gold-500)]",
      cream:
        "bg-[var(--cream-100)] text-[var(--ink-900)] border-[var(--cream-300)] focus:ring-[var(--gold-400)] focus:border-[var(--gold-500)]",
      dark:
        "bg-[var(--green-900)] text-[var(--cream-50)] border-[var(--gold-500)]/30 focus:ring-[var(--gold-400)] focus:border-[var(--gold-400)]",
    }[variant];

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} space-y-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-900)]"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ink-500)] flex items-center justify-center w-4 h-4">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            disabled={disabled}
            required={required}
            className={`
              h-12
              w-full
              ${startIcon ? "pl-11" : "px-4"}
              ${endIcon ? "pr-11" : "px-4"}
              rounded-lg
              border
              text-sm
              transition-colors
              placeholder:text-[var(--ink-400)]
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--cream-200)]/40
              ${variantStyles}
              ${error ? "border-red-500 focus:ring-red-400 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ink-500)] flex items-center justify-center w-4 h-4">
              {endIcon}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {helperText && !error && (
          <p className="text-[11px] text-[var(--ink-600)] leading-normal">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

