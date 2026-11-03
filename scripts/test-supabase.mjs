import { createClient } from "@supabase/supabase-js";

const url = "https://soazxbajyhfdnouhbdvo.supabase.co";
const key = "sb_publishable_3yFmFfGjYQN76ZN6Vz1Whw_Q6tAeOpm";

console.log("Menguji koneksi ke Supabase...");
console.log("URL:", url);
console.log("Key:", key.substring(0, 15) + "...");

const supabase = createClient(url, key);

async function testConnection() {
  try {
    // 1. Tes ping auth / health
    console.log("\n1. Menguji Auth / API Ping...");
    const { data: sessionData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log("⚠️ Auth getSession error:", authError.message);
    } else {
      console.log("✓ Auth service merespons dengan sukses.");
    }

    // 2. Menguji tabel-tabel utama
    const tables = [
      "infak_distributions",
      "geber_masjid_distributions",
      "reports",
      "gallery_items",
      "themed_campaigns",
      "site_settings",
      "admin_users"
    ];

    console.log("\n2. Menguji ketersediaan tabel pada database...");
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        console.log(`❌ Tabel '${table}': Gagal (${error.code} - ${error.message})`);
      } else {
        console.log(`✓ Tabel '${table}': Tersedia (baris ditemukan: ${data.length})`);
      }
    }
  } catch (err) {
    console.error("Terjadi kesalahan fatal saat menguji:", err);
  }
}

testConnection();

