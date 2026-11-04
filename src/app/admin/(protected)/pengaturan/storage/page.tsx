"use client";

import { useState } from "react";
import Link from "next/link";
import Select from "@/components/ui/Select";
import {
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Clock,
  HardDrive,
} from "lucide-react";

interface OrphanItem {
  url: string;
  pathname: string;
  sizeBytes: number;
  uploadedAt: string;
  ageHours: number;
}

export default function StorageOrphanCleanerPage() {
  const [minHours, setMinHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [orphans, setOrphans] = useState<OrphanItem[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleScan = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/upload?action=orphans&minHours=${minHours}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memindai file");
      setOrphans(data.orphans || []);
      // default select all
      setSelectedUrls(new Set((data.orphans || []).map((o: OrphanItem) => o.url)));
      setScanned(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memindai";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedUrls.size === orphans.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(orphans.map((o) => o.url)));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setMessage(null);
    try {
      const urls = Array.from(selectedUrls);
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus file");

      setMessage({
        type: "success",
        text: `Berhasil membersihkan ${data.deletedCount || urls.length} file tak terpakai dari penyimpanan.`,
      });
      setConfirmOpen(false);
      // Re-scan
      await handleScan();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus file";
      setMessage({ type: "error", text: msg });
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSelectedBytes = orphans
    .filter((o) => selectedUrls.has(o.url))
    .reduce((acc, o) => acc + o.sizeBytes, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pengaturan"
          className="p-2 rounded-xl text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--cream-100)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-900)]">
            Bersihkan File Tak Terpakai
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] mt-0.5">
            Pindai dan bersihkan berkas media yatim (orphan blobs) yang tidak terhubung ke data apa pun.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border ${
            message.type === "success"
              ? "bg-[var(--green-800)]/15 border-[var(--green-800)] text-[var(--green-800)]"
              : "bg-red-500/15 border-red-500 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Control Card */}
      <div className="p-6 rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[var(--ink-700)] whitespace-nowrap">
              Batas Usia Minimum:
            </span>
            <div className="w-64">
              <Select
                value={minHours.toString()}
                onChange={(e) => setMinHours(Number(e.target.value))}
              >
                <option value="0">Semua file yatim (0 jam)</option>
                <option value="1">Lebih dari 1 jam</option>
                <option value="24">Lebih dari 24 jam (Aman)</option>
                <option value="168">Lebih dari 7 hari</option>
              </Select>
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Memindai..." : "Pindai File Yatim (Dry-run)"}</span>
          </button>
        </div>

        <p className="text-[11px] text-[var(--ink-600)] leading-relaxed">
          <strong>Mode Dry-run:</strong> Pemindaian ini aman dan tidak akan menghapus berkas apa pun sampai Anda meninjau daftar dan mengonfirmasi penghapusan secara eksplisit.
        </p>
      </div>

      {/* Scan Results */}
      {scanned && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[var(--ink-700)]">
              Ditemukan: <span className="text-[var(--ink-900)] font-bold">{orphans.length} file</span>
              {orphans.length > 0 && (
                <span className="text-[var(--ink-600)]">
                  {" "}(Total terpilih: {formatSize(totalSelectedBytes)})
                </span>
              )}
            </div>

            {orphans.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAll}
                  className="px-3 py-1.5 rounded-lg border border-[var(--cream-200)] text-[11px] font-semibold text-[var(--ink-700)] hover:bg-[var(--cream-100)]"
                >
                  {selectedUrls.size === orphans.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={selectedUrls.size === 0}
                  className="px-4 py-1.5 rounded-full text-[11px] font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus ({selectedUrls.size})</span>
                </button>
              </div>
            )}
          </div>

          {orphans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--cream-100)] border border-[var(--cream-200)] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[var(--green-800)] mx-auto" />
              <p className="font-serif text-base font-bold text-[var(--ink-900)]">
                Penyimpanan Bersih
              </p>
              <p className="text-xs text-[var(--ink-600)] max-w-md mx-auto">
                Tidak ada file gambar yatim yang ditemukan dengan kriteria usia &gt; {minHours} jam. Semua berkas di penyimpanan terhubung ke data yayasan.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--cream-50)] border border-[var(--cream-200)] rounded-3xl overflow-hidden divide-y divide-[var(--cream-200)]">
              {orphans.map((item) => {
                const isSelected = selectedUrls.has(item.url);
                return (
                  <div
                    key={item.url}
                    onClick={() => handleToggle(item.url)}
                    className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--cream-100)]/60 transition-colors ${
                      isSelected ? "bg-[var(--cream-100)]/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(item.url)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded accent-[var(--green-800)] w-4 h-4"
                      />
                      <div className="w-10 h-10 rounded-lg bg-[var(--cream-200)] flex items-center justify-center shrink-0 overflow-hidden">
                        {item.url.startsWith("http") || item.url.startsWith("/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-[var(--ink-400)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-medium text-[var(--ink-900)] truncate">
                          {item.pathname}
                        </div>
                        <div className="text-[11px] text-[var(--ink-600)] flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {formatSize(item.sizeBytes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.ageHours.toFixed(1)} jam yang lalu
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-semibold text-[var(--green-800)] hover:underline shrink-0"
                    >
                      Buka File
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[var(--cream-50)] border border-[var(--cream-200)] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[var(--ink-900)]">
                Konfirmasi Penghapusan File
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-700)] leading-relaxed">
              Anda akan menghapus permanen <strong>{selectedUrls.size} berkas</strong> ({formatSize(totalSelectedBytes)}) dari penyimpanan cloud/server. Berkas yang sudah dihapus tidak dapat dipulihkan.
            </p>

            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--ink-700)] hover:bg-[var(--cream-200)]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? "Menghapus..." : "Ya, Hapus Sekarang"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

