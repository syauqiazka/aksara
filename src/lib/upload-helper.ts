/**
 * Helper to handle Upload-on-Save with automatic compensating rollback.
 */
export async function uploadPendingFileOnSave(
  file: File | null
): Promise<{
  url: string | null;
  rollback: () => Promise<void>;
  commit: () => Promise<void>;
}> {
  if (!file) {
    return {
      url: null,
      rollback: async () => {},
      commit: async () => {},
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  let res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok && res.status === 404) {
    // Fallback to /api/admin/upload if needed
    res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
  }

  let data: Record<string, unknown> | null = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Sesi admin Anda telah berakhir. Silakan buka tab baru dan login kembali di /admin/login.");
    }
    const errorMsg =
      (data?.error as string) ||
      (data?.message as string) ||
      `Gagal mengunggah foto ke server (Status: ${res.status})`;
    throw new Error(errorMsg);
  }

  const uploadedUrl = (data?.url as string) || "";
  if (!uploadedUrl) {
    throw new Error("URL gambar tidak diterima dari server");
  }

  // Compensation rollback function
  const rollback = async () => {
    try {
      await fetch(`/api/admin/upload?url=${encodeURIComponent(uploadedUrl)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Gagal menjalankan kompensasi rollback upload:", err);
    }
  };

  // Commit function
  const commit = async () => {
    try {
      await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadedUrl, action: "commit" }),
      });
    } catch (err) {
      console.warn("Gagal menandai committed pada upload ledger:", err);
    }
  };

  return { url: uploadedUrl, rollback, commit };
}

/**
 * Safely deletes old blob from storage when updated or replaced.
 * Protects permanent static assets (e.g. /images/...) from accidental deletion.
 */
export async function deleteOldBlobAfterUpdate(
  oldUrl?: string | null,
  newUrl?: string | null
): Promise<void> {
  if (!oldUrl || oldUrl === newUrl) return;

  // Only delete uploaded blobs (Vercel Blob or /uploads/), not repo static images (/images/...)
  const isStorageBlob =
    oldUrl.startsWith("http") ||
    (oldUrl.startsWith("/uploads/") && !oldUrl.startsWith("/images/"));

  if (isStorageBlob) {
    try {
      await fetch(`/api/admin/upload?url=${encodeURIComponent(oldUrl)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Gagal menghapus blob lama:", err);
    }
  }
}

export interface UploadProgressInfo {
  current: number;
  total: number;
  percentage: number;
  etaSeconds: number | null;
  currentFileName: string;
}

/**
 * Uploads a list of pending files sequentially while emitting granular progress & ETA info.
 * Provides collective rollback if any item fails.
 */
export async function uploadBatchWithProgress(
  files: (File | null)[],
  onProgress?: (info: UploadProgressInfo) => void
): Promise<{
  urls: (string | null)[];
  rollbacks: (() => Promise<void>)[];
  commits: (() => Promise<void>)[];
}> {
  const validItems = files
    .map((file, originalIndex) => ({ file, originalIndex }))
    .filter((item): item is { file: File; originalIndex: number } => Boolean(item.file));

  const total = validItems.length;
  const results = new Array<string | null>(files.length).fill(null);
  const rollbacks: (() => Promise<void>)[] = [];
  const commits: (() => Promise<void>)[] = [];

  if (total === 0) {
    return { urls: results, rollbacks, commits };
  }

  const startTime = Date.now();

  for (let i = 0; i < total; i++) {
    const item = validItems[i];
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    // Calculate adaptive average duration per file
    const avgPerItem = i > 0 ? elapsedSeconds / i : 1.5;
    const remainingItems = total - i;
    const etaSeconds = Math.max(1, Math.round(avgPerItem * remainingItems));
    const percentage = Math.round((i / total) * 100);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage,
        etaSeconds,
        currentFileName: item.file.name,
      });
    }

    try {
      const { url, rollback, commit } = await uploadPendingFileOnSave(item.file);
      results[item.originalIndex] = url;
      rollbacks.push(rollback);
      commits.push(commit);
    } catch (err) {
      // Auto-compensate by rolling back files already uploaded in this batch
      await Promise.all(rollbacks.map((r) => r()));
      throw err;
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 100,
      etaSeconds: 0,
      currentFileName: "Selesai",
    });
  }

  return { urls: results, rollbacks, commits };
}

