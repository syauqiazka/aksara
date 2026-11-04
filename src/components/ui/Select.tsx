import React, { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  variant?: "default" | "cream" | "dark";
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      children,
      className = "",
      id,
      name,
      value,
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

    const isPlaceholder = value === "" || value === undefined;

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
          <select
            ref={ref}
            id={inputId}
            name={name}
            value={value}
            disabled={disabled}
            required={required}
            className={`
              appearance-none
              h-12
              w-full
              pl-4 pr-11
              rounded-lg
              border
              text-sm
              font-medium
              transition-colors
              cursor-pointer
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--cream-200)]/40
              ${variantStyles}
              ${error ? "border-red-500 focus:ring-red-400 focus:border-red-500" : ""}
              ${isPlaceholder ? "text-[var(--ink-500)]" : "text-[var(--ink-900)]"}
              ${className}
            `}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[var(--cream-50)] text-[var(--ink-900)] py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Dedicated Chevron Indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-[var(--ink-600)]">
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          </div>
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

Select.displayName = "Select";

export default Select;

