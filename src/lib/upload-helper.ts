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

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Gagal mengunggah foto ke storage");
  }

  const uploadedUrl = data.url as string;

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

