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

