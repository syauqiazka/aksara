import { writeFileSync, mkdirSync } from "fs";

// Generates an authentic seamless Islamic 8-pointed star (Girih / Khatam) geometric tile.
// Size: 120x120 px.
// Geometrically, the 8-pointed star tessellation connects center stars with corner stars
// through interlacing strapwork lines, regular octagons, and crossed diamonds.

const size = 120;
const half = size / 2;
const rOuter = size * 0.28; // ~33.6px
const rInner = rOuter * 0.41421356; // ~13.92px ((sqrt(2)-1) * rOuter)

function getStarPoints(cx, cy, rOut, rIn) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? rOut : rIn;
    const px = (cx + r * Math.cos(angle)).toFixed(2);
    const py = (cy + r * Math.sin(angle)).toFixed(2);
    pts.push(`${px},${py}`);
  }
  return pts.join(" ");
}

const centerStar = getStarPoints(half, half, rOuter, rInner);
const tlStar = getStarPoints(0, 0, rOuter, rInner);
const trStar = getStarPoints(size, 0, rOuter, rInner);
const blStar = getStarPoints(0, size, rOuter, rInner);
const brStar = getStarPoints(size, size, rOuter, rInner);

// Secondary 8-pointed star rotated by 22.5 deg for sacred geometry complexity
const centerStarInner = getStarPoints(half, half, rOuter * 0.65, rInner * 0.65);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <style>
      .primary-stroke {
        stroke: #D4AF37;
        stroke-width: 1.25;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        opacity: 0.35;
      }
      .secondary-stroke {
        stroke: #D4AF37;
        stroke-width: 0.75;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        opacity: 0.22;
      }
      .fine-grid {
        stroke: #1B4D3E;
        stroke-width: 0.5;
        fill: none;
        opacity: 0.4;
      }
      .star-fill {
        fill: #D4AF37;
        fill-opacity: 0.035;
      }
      .core-fill {
        fill: #0F382A;
        fill-opacity: 0.5;
      }
    </style>
  </defs>

  <!-- Structural Framework Grid -->
  <line x1="0" y1="0" x2="${size}" y2="${size}" class="fine-grid" />
  <line x1="${size}" y1="0" x2="0" y2="${size}" class="fine-grid" />
  <line x1="${half}" y1="0" x2="${half}" y2="${size}" class="fine-grid" />
  <line x1="0" y1="${half}" x2="${size}" y2="${half}" class="fine-grid" />

  <!-- Diagonal Octagonal Interlaced Connectors -->
  <!-- Top <-> Center -->
  <line x1="${half}" y1="0" x2="${half - rInner * 1.4}" y2="${rInner * 1.4}" class="secondary-stroke" />
  <line x1="${half}" y1="0" x2="${half + rInner * 1.4}" y2="${rInner * 1.4}" class="secondary-stroke" />
  <!-- Bottom <-> Center -->
  <line x1="${half}" y1="${size}" x2="${half - rInner * 1.4}" y2="${size - rInner * 1.4}" class="secondary-stroke" />
  <line x1="${half}" y1="${size}" x2="${half + rInner * 1.4}" y2="${size - rInner * 1.4}" class="secondary-stroke" />
  <!-- Left <-> Center -->
  <line x1="0" y1="${half}" x2="${rInner * 1.4}" y2="${half - rInner * 1.4}" class="secondary-stroke" />
  <line x1="0" y1="${half}" x2="${rInner * 1.4}" y2="${half + rInner * 1.4}" class="secondary-stroke" />
  <!-- Right <-> Center -->
  <line x1="${size}" y1="${half}" x2="${size - rInner * 1.4}" y2="${half - rInner * 1.4}" class="secondary-stroke" />
  <line x1="${size}" y1="${half}" x2="${size - rInner * 1.4}" y2="${half + rInner * 1.4}" class="secondary-stroke" />

  <!-- Center Star Shamsa -->
  <polygon points="${centerStar}" class="primary-stroke star-fill" />
  <polygon points="${centerStarInner}" class="secondary-stroke core-fill" />
  <circle cx="${half}" cy="${half}" r="${rInner * 0.75}" class="secondary-stroke" />
  <circle cx="${half}" cy="${half}" r="2" fill="#D4AF37" fill-opacity="0.4" />

  <!-- Corner Quarter Stars -->
  <polygon points="${tlStar}" class="primary-stroke star-fill" />
  <polygon points="${trStar}" class="primary-stroke star-fill" />
  <polygon points="${blStar}" class="primary-stroke star-fill" />
  <polygon points="${brStar}" class="primary-stroke star-fill" />

  <!-- Diamond & Octagram Petals -->
  <rect x="${half - 12}" y="${half - 12}" width="24" height="24" transform="rotate(45 ${half} ${half})" class="secondary-stroke" />
  <rect x="${half - 12}" y="${half - 12}" width="24" height="24" class="secondary-stroke" />
</svg>`;

mkdirSync("public/images/ornaments", { recursive: true });
writeFileSync("public/images/ornaments/islamic-pattern.svg", svg);
console.log("✅ Berhasil membuat public/images/ornaments/islamic-pattern.svg");
