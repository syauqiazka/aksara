import sharp from "sharp";
import { existsSync } from "fs";
import path from "path";

const imagesToProcess = [
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794007619670_a17edd21.jpg",
    destWebp: "public/images/portfolio/sapawargaqu.webp",
    destJpg: "public/images/portfolio/sapawargaqu.jpg",
    maxWidth: 800,
  },
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794007621893_ccc5273a.jpg",
    destWebp: "public/images/portfolio/dkm-masjidqu.webp",
    destJpg: "public/images/portfolio/dkm-masjidqu.jpg",
    maxWidth: 800,
  },
];

async function run() {
  for (const img of imagesToProcess) {
    if (!existsSync(img.src)) {
      console.error("File not found:", img.src);
      continue;
    }
    const meta = await sharp(img.src).metadata();
    console.log(`Processing ${path.basename(img.src)} (${meta.width}x${meta.height})...`);

    // Optimize to WebP
    let pipeline = sharp(img.src);
    if (meta.width && meta.width > img.maxWidth) {
      pipeline = pipeline.resize({ width: img.maxWidth, withoutEnlargement: true });
    }
    await pipeline.webp({ quality: 88 }).toFile(img.destWebp);

    // Save as JPG fallback
    let pipelineJpg = sharp(img.src);
    if (meta.width && meta.width > img.maxWidth) {
      pipelineJpg = pipelineJpg.resize({ width: img.maxWidth, withoutEnlargement: true });
    }
    await pipelineJpg.jpeg({ quality: 88 }).toFile(img.destJpg);

    console.log(`Saved: ${img.destWebp} and ${img.destJpg}`);
  }
}

run().catch(console.error);

