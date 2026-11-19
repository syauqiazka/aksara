"use client";

import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface SearchableOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, selectedOption?: SearchableOption) => void;
  options: (SearchableOption | string)[];
  required?: boolean;
  disabled?: boolean;
  allowCustom?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
}

export default function SearchableSelect({
  label,
  placeholder = "-- Ketik untuk mencari atau scroll --",
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  allowCustom = true,
  helperText,
  error,
  className = "",
  id,
  name,
}: SearchableSelectProps) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  // Normalize options into SearchableOption[]
  const normalizedOptions: SearchableOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync internal query when external value prop changes
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!query || query.trim() === "") {
      return normalizedOptions;
    }
    const qLower = query.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(qLower);
      const matchSub = opt.sublabel?.toLowerCase().includes(qLower);
      const matchVal = opt.value.toLowerCase().includes(qLower);
      return matchLabel || matchSub || matchVal;
    });
  }, [normalizedOptions, query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If user typed something custom and allowCustom is on, commit it
        if (allowCustom && query && query !== value) {
          onChange(query);
        } else if (!allowCustom && query !== value) {
          // Revert to current value
          setQuery(value || "");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [allowCustom, onChange, query, value]);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && listRef.current.children[highlightedIndex]) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement;
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelectOption = (opt: SearchableOption) => {
    setQuery(opt.value);
    onChange(opt.value, opt);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setHighlightedIndex(0);
    if (!isOpen) setIsOpen(true);
    if (allowCustom) {
      onChange(val);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    onChange("");
    setHighlightedIndex(0);
    inputRef.current?.focus();
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0 && filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      } else if (allowCustom && query) {
        onChange(query);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setQuery(value || "");
    } else if (e.key === "Tab") {
      setIsOpen(false);
      if (allowCustom && query) {
        onChange(query);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-900)] mb-1"
        >
          {label.replace(/\s*\*$/, "")} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required && !value}
          autoComplete="off"
          className={`w-full pl-9 pr-14 py-2.5 rounded-xl bg-[var(--cream-50)] border text-sm text-[var(--ink-900)] transition-all placeholder:text-[var(--ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] ${
            error
              ? "border-red-400 focus:border-red-500"
              : isOpen
              ? "border-[var(--gold-500)] shadow-sm bg-white"
              : "border-[var(--cream-200)] hover:border-[var(--cream-300)]"
          } ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : "cursor-text"}`}
        />

        {/* Left search icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ink-400)]">
          <Search className="w-4 h-4" />
        </div>

        {/* Right buttons: Clear & Chevron */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-[var(--ink-400)] hover:text-[var(--ink-700)] hover:bg-[var(--cream-200)] transition-colors"
              title="Hapus pilihan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                inputRef.current?.focus();
              }
            }}
            tabIndex={-1}
            className="p-1 text-[var(--ink-500)] hover:text-[var(--ink-800)] transition-transform duration-200"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[var(--gold-600)]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu (Scrollable + Searchable) */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-hidden rounded-2xl bg-white border border-[var(--cream-200)] shadow-2xl flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 bg-[var(--cream-100)]/70 border-b border-[var(--cream-200)] flex items-center justify-between text-[11px] text-[var(--ink-500)]">
            <span>
              Menampilkan <strong>{filteredOptions.length}</strong> hasil
            </span>
            <span className="text-[10px] text-[var(--ink-400)]">
              Ketik untuk memfilter &mdash; Scroll untuk memilih
            </span>
          </div>

          <ul
            ref={listRef}
            className="overflow-y-auto max-h-52 divide-y divide-[var(--cream-100)] p-1 focus:outline-none"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs text-[var(--ink-500)]">
                <p className="font-semibold text-[var(--ink-700)]">
                  Tidak ditemukan &ldquo;{query}&rdquo;
                </p>
                {allowCustom && (
                  <p className="text-[11px] text-[var(--gold-700)] mt-1">
                    Tekan <strong>Enter</strong> atau klik di luar untuk tetap menggunakan &ldquo;{query}&rdquo;.
                  </p>
                )}
              </li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected =
                  opt.value.toLowerCase() === (value || "").toLowerCase();
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={`${opt.value}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3.5 py-2.5 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? "bg-[var(--cream-100)] text-[var(--ink-900)] font-medium"
                        : "text-[var(--ink-800)] hover:bg-[var(--cream-50)]"
                    } ${isSelected ? "bg-[var(--green-900)]/10 text-[var(--green-950)] font-bold" : ""}`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-[var(--ink-500)] truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--green-800)] flex-shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-[var(--ink-500)]">{helperText}</p>
      )}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
