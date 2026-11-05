export interface ProvinceInfo {
  name: string;
  islandId: "sumatra" | "jawa" | "kalimantan" | "sulawesi" | "maluku-papua" | "bali-nusa";
}

export const PROVINCES_38: ProvinceInfo[] = [
  // Sumatra
  { name: "Aceh", islandId: "sumatra" },
  { name: "Sumatera Utara", islandId: "sumatra" },
  { name: "Sumatera Barat", islandId: "sumatra" },
  { name: "Riau", islandId: "sumatra" },
  { name: "Kepulauan Riau", islandId: "sumatra" },
  { name: "Jambi", islandId: "sumatra" },
  { name: "Sumatera Selatan", islandId: "sumatra" },
  { name: "Kepulauan Bangka Belitung", islandId: "sumatra" },
  { name: "Bengkulu", islandId: "sumatra" },
  { name: "Lampung", islandId: "sumatra" },

  // Jawa
  { name: "DKI Jakarta", islandId: "jawa" },
  { name: "Jawa Barat", islandId: "jawa" },
  { name: "Banten", islandId: "jawa" },
  { name: "Jawa Tengah", islandId: "jawa" },
  { name: "DI Yogyakarta", islandId: "jawa" },
  { name: "Jawa Timur", islandId: "jawa" },

  // Bali & Nusa Tenggara
  { name: "Bali", islandId: "bali-nusa" },
  { name: "Nusa Tenggara Barat", islandId: "bali-nusa" },
  { name: "Nusa Tenggara Timur", islandId: "bali-nusa" },

  // Kalimantan
  { name: "Kalimantan Barat", islandId: "kalimantan" },
  { name: "Kalimantan Tengah", islandId: "kalimantan" },
  { name: "Kalimantan Selatan", islandId: "kalimantan" },
  { name: "Kalimantan Timur", islandId: "kalimantan" },
  { name: "Kalimantan Utara", islandId: "kalimantan" },

  // Sulawesi
  { name: "Sulawesi Utara", islandId: "sulawesi" },
  { name: "Gorontalo", islandId: "sulawesi" },
  { name: "Sulawesi Tengah", islandId: "sulawesi" },
  { name: "Sulawesi Barat", islandId: "sulawesi" },
  { name: "Sulawesi Selatan", islandId: "sulawesi" },
  { name: "Sulawesi Tenggara", islandId: "sulawesi" },

  // Maluku & Papua
  { name: "Maluku", islandId: "maluku-papua" },
  { name: "Maluku Utara", islandId: "maluku-papua" },
  { name: "Papua", islandId: "maluku-papua" },
  { name: "Papua Barat", islandId: "maluku-papua" },
  { name: "Papua Selatan", islandId: "maluku-papua" },
  { name: "Papua Tengah", islandId: "maluku-papua" },
  { name: "Papua Pegunungan", islandId: "maluku-papua" },
  { name: "Papua Barat Daya", islandId: "maluku-papua" },
];

export function getIslandByProvince(provinceName?: string | null): ProvinceInfo["islandId"] | null {
  if (!provinceName) return null;
  const p = PROVINCES_38.find(
    (item) => item.name.toLowerCase() === provinceName.trim().toLowerCase()
  );
  return p ? p.islandId : null;
}

