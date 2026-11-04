"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export default function ImageUploader({
  label = "Upload Foto",
  value,
  onChange,
  placeholder = "Pilih file gambar atau drag & drop ke sini",
  helperText,
  required = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Harap pilih file gambar (JPG, PNG, WebP, GIF)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar terlalu besar (maksimal 8MB)");
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    setUploadNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      onChange(data.url);
      if (data.provider === "vercel-blob") {
        setUploadNotice("Berhasil diunggah ke Vercel Blob");
      } else {
        setUploadNotice(data.message || "Tersimpan di penyimpanan lokal");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan upload";
      setErrorMessage(msg);
    } finally {
      setUploading(false);
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[var(--ink-700)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-[11px] text-[var(--gold-600)] hover:underline flex items-center gap-1 font-medium"
        >
          {mode === "upload" ? (
            <>
              <Link2 className="w-3 h-3" />
              <span>Gunakan URL Luar</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3 h-3" />
              <span>Upload dari Storage</span>
            </>
          )}
        </button>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /images/..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--cream-200)] focus:ring-2 focus:ring-[var(--gold-500)] focus:outline-none font-mono"
          />
          {value && (
            <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)]">
              <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Active Image Preview */}
          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-[var(--cream-200)] bg-[var(--green-950)]/90 p-2 group">
              <div className="relative h-44 w-full rounded-xl overflow-hidden">
                <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
              </div>
              <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-[var(--cream-100)]">
                <span className="truncate max-w-[260px] font-mono text-[10px] opacity-80">{value}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-2.5 py-1 rounded-lg bg-[var(--gold-500)] text-[var(--green-950)] font-bold text-[10px] hover:brightness-110"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setUploadNotice(null);
                    }}
                    className="p-1 text-red-300 hover:text-red-100 rounded-lg hover:bg-red-500/20"
                    title="Hapus Foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? "border-[var(--gold-500)] bg-[var(--gold-50)]/30 scale-[1.01]"
                  : "border-[var(--cream-200)] hover:border-[var(--gold-400)] bg-[var(--cream-50)]/50 hover:bg-[var(--cream-100)]/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)]">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--gold-600)]" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>

                <div className="text-xs">
                  <span className="font-semibold text-[var(--ink-900)]">
                    {uploading ? "Sedang mengunggah..." : "Klik untuk upload"}
                  </span>{" "}
                  {!uploading && (
                    <span className="text-[var(--ink-500)]">atau tarik (drag & drop) gambar ke sini</span>
                  )}
                </div>

                <p className="text-[10px] text-[var(--ink-400)]">
                  Mendukung JPG, PNG, WebP, GIF (Maks. 8MB) &bull; Otomatis tersimpan ke Vercel Blob
                </p>
              </div>
            </div>
          )}

          {/* Hidden input for replace action when value exists */}
          {value && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          )}
        </div>
      )}

      {/* Notices & Errors */}
      {uploadNotice && (
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--green-800)] font-medium bg-[var(--green-50)] px-3 py-1.5 rounded-lg border border-[var(--green-200)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-700 font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && <p className="text-[10px] text-[var(--ink-400)]">{helperText}</p>}
    </div>
  );
}

