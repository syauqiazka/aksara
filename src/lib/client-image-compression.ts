/**
 * Client-side image compression utility
 * Resizes image so longest side is at most 2000px and converts to WebP targeting <= 300KB.
 */
export async function compressImageClient(file: File): Promise<File> {
  // If not an image, return original (will be rejected by validation)
  if (!file.type.startsWith("image/")) return file;

  // Max 5MB hard limit check
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran file melebihi batas maksimal 5 MB.");
  }

  // Allowed formats
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error("Format gambar harus berupa JPEG, PNG, atau WebP.");
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let { width, height } = img;
        const maxDimension = 2000;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality reduction loop targeting <= 300KB
        const attemptCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // If size is <= 300KB or quality is already low (0.5), resolve
              if (blob.size <= 300 * 1024 || quality <= 0.5) {
                const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const compressedFile = new File([blob], cleanName, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Try lower quality
                attemptCompress(quality - 0.15);
              }
            },
            "image/webp",
            quality
          );
        };

        attemptCompress(0.82);
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

