import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import path from "path";

const imagesToProcess = [
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794006601111_2df8ef5b.jpg",
    destWebp: "public/images/geber-masjid-kegiatan.webp",
    destJpg: "public/images/geber-masjid-kegiatan.jpg",
    maxWidth: 1600,
  },
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794006631583_395334e5.jpg",
    destWebp: "public/images/program-buss-alquran.webp",
    destJpg: "public/images/program-buss-alquran.jpg",
    maxWidth: 1200,
  },
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794006705081_ac3163b9.jpg",
    destWebp: "public/images/portfolio/banksaku.webp",
    destJpg: "public/images/portfolio/banksaku.jpg",
    maxWidth: 800,
  },
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794006709519_0fc714ca.jpg",
    destWebp: "public/images/portfolio/diaryqu.webp",
    destJpg: "public/images/portfolio/diaryqu.jpg",
    maxWidth: 800,
  },
  {
    src: "C:/Users/user/.gemini/antigravity/brain/07871385-e643-48bd-b302-99b18c9cbef4/.user_uploaded/media_1794006712675_4b209b4e.jpg",
    destWebp: "public/images/portfolio/kajianqu.webp",
    destJpg: "public/images/portfolio/kajianqu.jpg",
    maxWidth: 800,
  },
];

mkdirSync("public/images/portfolio", { recursive: true });

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
