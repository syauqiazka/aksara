/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const tables = [
  'site_settings',
  'upload_ledger',
  'infak_jinan',
  'infak_jinan_photos',
  'infak_jinan_santri',
  'santri_hafalan_updates',
  'buss_distributions',
  'yatim_distributions',
  'geber_masjid_distributions',
  'reports',
  'gallery_items',
  'themed_campaigns',
  'infak_distributions',
  'admin_users'
];

async function checkAll() {
  console.log('=== CHECKING SUPABASE PRODUCTION TABLES ===');
  const results = {};
  for (const t of tables) {
    try {
      const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' });
      if (error) {
        results[t] = { status: 'ERROR', error: error.message, code: error.code };
        console.log(`[${t}]: ERROR - ${error.message} (${error.code})`);
      } else {
        results[t] = {
          status: 'EXISTS',
          rowCount: data.length,
          columns: data[0] ? Object.keys(data[0]) : [],
          sample: data[0] || null
        };
        console.log(`[${t}]: EXISTS, count = ${data.length}, cols = ${data[0] ? Object.keys(data[0]).join(', ') : '(empty table)'}`);
      }
    } catch (e) {
      results[t] = { status: 'EXCEPTION', error: e.message };
      console.log(`[${t}]: EXCEPTION - ${e.message}`);
    }
  }

  fs.writeFileSync('scripts/supabase-audit-dump.json', JSON.stringify(results, null, 2));
  console.log('\nAudit written to scripts/supabase-audit-dump.json');
}

checkAll();
