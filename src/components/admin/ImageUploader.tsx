"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Link2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { compressImageClient } from "@/lib/client-image-compression";

interface ImageUploaderProps {
  label?: string;
  value?: string; // existing image URL
  onChange?: (url: string) => void;
  file?: File | null; // local pending file (Upload on Save)
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export default function ImageUploader({
  label = "Upload Foto",
  value = "",
  onChange,
  file = null,
  onFileChange,
  placeholder = "Pilih file gambar atau drag & drop ke sini",
  helperText,
  required = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Revoke object URL on unmount or change
  const setCleanPreview = (newUrl: string | null) => {
    if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = newUrl;
    setPreviewUrl(newUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Update preview when file changes or value changes
  useEffect(() => {
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setCleanPreview(objUrl);
    } else if (value) {
      setCleanPreview(value);
    } else {
      setCleanPreview(null);
    }
  }, [file, value]);

  const handleFileProcess = async (rawFile: File) => {
    setErrorMessage(null);

    // 1. Validation
    if (!rawFile.type.startsWith("image/")) {
      setErrorMessage("Harap pilih file gambar (JPG, PNG, atau WebP)");
      return;
    }
    if (rawFile.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar melebihi batas maksimal 5 MB");
      return;
    }

    try {
      // 2. Client-side WebP compression (max 2000px, target <= 300KB)
      const compressed = await compressImageClient(rawFile);

      // 3. Store in client state WITHOUT uploading yet (Upload on Save)
      if (onFileChange) {
        onFileChange(compressed);
      }
      if (onChange) {
        onChange(""); // Clear external URL since local file takes precedence
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses gambar";
      setErrorMessage(msg);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setCleanPreview(null);
    if (onFileChange) onFileChange(null);
    if (onChange) onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrorMessage(null);
  };

  const activeDisplay = previewUrl || value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[var(--ink-900)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-[11px] font-medium text-[var(--gold-700)] hover:underline flex items-center gap-1"
        >
          {mode === "upload" ? (
            <>
              <Link2 className="w-3 h-3" />
              <span>Gunakan URL Eksternal</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3 h-3" />
              <span>Pilih File Gambar</span>
            </>
          )}
        </button>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              if (onChange) onChange(e.target.value);
              if (onFileChange) onFileChange(null);
            }}
            placeholder="https://example.com/foto-kegiatan.jpg"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] text-xs text-[var(--ink-900)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)] font-mono"
          />
          <p className="text-[11px] text-[var(--ink-600)]">
            Masukkan tautan langsung gambar yang dapat diakses publik.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeDisplay ? (
            <div className="relative rounded-2xl border-2 border-[var(--cream-200)] bg-[var(--cream-100)] p-3 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--green-950)] flex-shrink-0 border border-[var(--gold-500)]/30">
                <Image
                  src={activeDisplay}
                  alt="Pratinjau Foto"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-900)] truncate">
                  {file ? (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">Foto Tersimpan</span>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-[var(--ink-600)] mt-0.5">
                  {file ? (
                    <span className="text-emerald-700 font-medium">
                      Siap diunggah saat data disimpan ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  ) : (
                    <span className="truncate block font-mono text-[10px] text-[var(--ink-400)]">
                      {value}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-[var(--gold-700)] hover:underline"
                  >
                    Ganti Foto
                  </button>
                  <span className="text-[var(--cream-300)]">&bull;</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[var(--gold-500)] bg-[var(--gold-500)]/10"
                  : "border-[var(--cream-300)] hover:border-[var(--gold-400)] bg-[var(--cream-50)]"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--cream-100)] flex items-center justify-center mx-auto mb-3 text-[var(--green-800)]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-[var(--ink-900)] mb-1">
                {placeholder}
              </div>
              <div className="text-[11px] text-[var(--ink-600)]">
                Maks. 5 MB &bull; Otomatis dikompres ke WebP saat formulir disimpan
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && !errorMessage && (
        <p className="text-[11px] text-[var(--ink-600)]">{helperText}</p>
      )}
    </div>
  );
}
