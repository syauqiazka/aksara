import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const FORBIDDEN_PATTERN = /•|·|●|○|&bull;|&middot;|&#8226;|list-disc/;

function scanDir(dir, findings = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        scanDir(fullPath, findings);
      }
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      const content = readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (FORBIDDEN_PATTERN.test(line)) {
          findings.push({ file: fullPath, line: idx + 1, text: line.trim() });
        }
      });
    }
  }
  return findings;
}

const errors = scanDir("src");
if (errors.length > 0) {
  console.error(`❌ Terdeteksi ${errors.length} bullet dot / list-disc di kode sumber:`);
  errors.forEach((e) => console.error(`  ${e.file}:${e.line} -> ${e.text}`));
  process.exit(1);
} else {
  console.log("✅ Bebas dari karakter bullet dot (•, &bull;, dll) dan list-disc!");
}

