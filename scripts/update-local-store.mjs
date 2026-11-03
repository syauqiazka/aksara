import fs from 'fs';

let content = fs.readFileSync('src/lib/db/local-store.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Rename seed lists to demo lists and set conditional isDemo
content = content.replace(
  '// Initial local seed state\nconst infakList: InfakDistribution[] = [',
  "// Mode Demo: hanya memuat data simulasi jika NEXT_PUBLIC_DEMO=true\nconst isDemo = process.env.NEXT_PUBLIC_DEMO === 'true';\n\nconst demoInfakList: InfakDistribution[] = ["
);

content = content.replace(
  'const geberList: GeberMasjidDistribution[] = [',
  'let infakList: InfakDistribution[] = isDemo ? demoInfakList : [];\n\nconst demoGeberList: GeberMasjidDistribution[] = ['
);

content = content.replace(
  'const reportList: Report[] = [',
  'let geberList: GeberMasjidDistribution[] = isDemo ? demoGeberList : [];\n\nconst demoReportList: Report[] = ['
);

content = content.replace(
  'const themedCampaignsList: ThemedCampaign[] = [',
  'let reportList: Report[] = isDemo ? demoReportList : [];\n\nconst themedCampaignsList: ThemedCampaign[] = ['
);

// 2. Empty bank accounts and clean contacts
const bankRegex = /let bankAccounts: BankAccount\[\] = \[\s*\{[\s\S]*?\}\s*\];/;
content = content.replace(bankRegex, 'let bankAccounts: BankAccount[] = [];');
content = content.replace(/whatsapp:\s*"\+6281234567890"/, 'whatsapp: ""');
content = content.replace(/phone:\s*"\+62215551234"/, 'phone: ""');

// 3. Set default donor name to Hamba Allah in demoInfakList
content = content.replace(/donor_name:\s*"Keluarga Bpk\. H\. Sutrisno"/g, 'donor_name: "Hamba Allah"');
content = content.replace(/donor_name:\s*"Ibu Hj\. Siti Rahmah"/g, 'donor_name: "Hamba Allah"');
content = content.replace(/donor_name:\s*"Dr\. Hendra Wijaya"/g, 'donor_name: "Hamba Allah"');

// 4. Add (Contoh) to demo recipient names
content = content.replace(/"Pondok Pesantren Al-Hikmah"/g, '"Pondok Pesantren Al-Hikmah (Contoh)"');
content = content.replace(/"Madrasah Diniyah Nurul Iman"/g, '"Madrasah Diniyah Nurul Iman (Contoh)"');
content = content.replace(/"Masjid Jami Al-Barkah"/g, '"Masjid Jami Al-Barkah (Contoh)"');
content = content.replace(/"Pesantren Tahfidz Darul Furqon"/g, '"Pesantren Tahfidz Darul Furqon (Contoh)"');
content = content.replace(/"Rumah Qur\'an As-Salam"/g, '"Rumah Qur\'an As-Salam (Contoh)"');
content = content.replace(/"Masjid Agung Al-Barkah"/g, '"Masjid Agung Al-Barkah (Contoh)"');
content = content.replace(/"Masjid Baiturrahim"/g, '"Masjid Baiturrahim (Contoh)"');
content = content.replace(/"Masjid At-Taqwa"/g, '"Masjid At-Taqwa (Contoh)"');
content = content.replace(/"Masjid Darussalam"/g, '"Masjid Darussalam (Contoh)"');

fs.writeFileSync('src/lib/db/local-store.ts', content, 'utf8');
console.log('local-store.ts successfully updated with isDemo and empty bank accounts!');

