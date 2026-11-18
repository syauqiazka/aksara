# AKSARA — MYSQL SCHEMA MAPPING & PRISMA SPECIFICATION

> **Dokumen**: Pemetaan Skema Database & Spesifikasi Skema Prisma MySQL  
> **Aplikasi**: Web Portal & Backoffice Yayasan Sahabat Aksara Semesta  
> **Provider**: `mysql` (Hostinger MySQL 8.0 / MariaDB 10.x)  
> **Status**: Desain Skema Produksi Terverifikasi  

---

## 1. ATURAN PEMETAAN TIPE DATA (POSTGRESQL -> MYSQL)

| Tipe Data PostgreSQL | Tipe Data MySQL | Anotasi Prisma MySQL | Keterangan & Penanganan Nilai |
|---|---|---|---|
| `uuid` (128-bit) | `CHAR(36)` | `String @id @default(uuid()) @db.Char(36)` | Nilai UUID dipertahankan utuh dalam representasi string 36 karakter bertanda hubung (*hyphenated format*). |
| `text[]` (Array String) | `JSON` | `Json @default("[]")` | MySQL tidak memiliki tipe data array skalar native. Prisma menyimpannya sebagai JSON array `["url1", "url2"]`. Lapisan TypeScript tetap menerima dan mengembalikan `string[]`. |
| `jsonb` | `JSON` | `Json` | MySQL 5.7+ dan 8.0 mendukung tipe data JSON biner native secara optimal. |
| `bigint` | `BIGINT` | `BigInt` / `BigInt?` | Mendukung nilai numerik rupiah hingga 9.223.372.036.854.775.807 tanpa kehilangan presisi. |
| `numeric` / `decimal` | `DECIMAL(10, 8)` / `DECIMAL(11, 8)` | `Decimal? @db.Decimal(10, 8)` | Presisi koordinat lintang/bujur GPS peta sebaran hingga 8 angka di belakang koma (akurasi milimeter). |
| `date` | `DATE` | `DateTime @db.Date` | Menyimpan tanggal kegiatan (YYYY-MM-DD) tanpa komponen jam. |
| `timestamptz` | `DATETIME(3)` | `DateTime @default(now()) @db.DateTime(3)` | Menyimpan timestamp presisi milidetik dalam format standar ISO UTC. |
| `text` (Panjang Bebas) | `VARCHAR(191)` / `TEXT` / `LONGTEXT` | `String` / `@db.Text` | String pendek/slug memakai `VARCHAR(191)` dengan index; isi artikel/laporan memakai `@db.Text`. |
| `boolean` | `TINYINT(1)` | `Boolean @default(false)` | Dipetakan otomatis oleh MySQL dan Prisma ke `TINYINT(1)` (0 = false, 1 = true). |
| `integer` | `INT` | `Int` | Integer bertanda 32-bit. |

---

## 2. PEMETAAN TABEL DEMI TABEL

### 2.1. Model `SiteSetting` (`site_settings`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `key` | `text` PK | `VARCHAR(191)` PK | `key String @id @db.VarChar(191)` |
| `value` | `jsonb` | `JSON` | `value Json` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |

### 2.2. Model `UploadLedger` (`upload_ledger`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `url` | `text` Unique | `VARCHAR(500)` Unique | `url String @unique @db.VarChar(500)` |
| `content_hash` | `text` | `VARCHAR(64)` | `content_hash String @db.VarChar(64)` |
| `size_bytes` | `integer` | `INT` | `size_bytes Int` |
| `mime_type` | `text` | `VARCHAR(100)` | `mime_type String @db.VarChar(100)` |
| `status` | `text` | `VARCHAR(50)` | `status String @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `committed_at` | `timestamptz` | `DATETIME(3)` | `committed_at DateTime? @db.DateTime(3)` |

### 2.3. Model `InfakJinan` (`infak_jinan`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `mushaf_no` | `integer` Unique | `INT` Unique | `mushaf_no Int @unique` |
| `donor_name` | `text` | `VARCHAR(255)` | `donor_name String @db.VarChar(255)` |
| `show_donor_name` | `boolean` | `TINYINT(1)` | `show_donor_name Boolean @default(false)` |
| `donor_origin` | `text` | `VARCHAR(255)` | `donor_origin String @db.VarChar(255)` |
| `donor_phone` | `text` | `VARCHAR(50)` | `donor_phone String? @db.VarChar(50)` |
| `dedication_name` | `text` | `VARCHAR(255)` | `dedication_name String @db.VarChar(255)` |
| `pesantren_name` | `text` | `VARCHAR(255)` | `pesantren_name String @db.VarChar(255)` |
| `pesantren_province`| `text` | `VARCHAR(100)` | `pesantren_province String? @db.VarChar(100)` |
| `pesantren_city` | `text` | `VARCHAR(100)` | `pesantren_city String? @db.VarChar(100)` |
| `address` | `text` | `TEXT` | `address String @db.Text` |
| `distributed_at` | `date` | `DATE` | `distributed_at DateTime @db.Date` |
| `maps_url` | `text` | `VARCHAR(500)` | `maps_url String? @db.VarChar(500)` |
| `santri_name` | `text` | `VARCHAR(255)` | `santri_name String? @db.VarChar(255)` |
| `santri_phone` | `text` | `VARCHAR(50)` | `santri_phone String? @db.VarChar(50)` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |

### 2.4. Model `InfakJinanPhoto` (`infak_jinan_photos`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `infak_id` | `uuid` FK | `CHAR(36)` FK | `infak_id String @db.Char(36)` |
| `url` | `text` | `VARCHAR(500)` | `url String @db.VarChar(500)` |
| `caption` | `text` | `VARCHAR(255)` | `caption String? @db.VarChar(255)` |
| `sort` | `integer` | `INT` | `sort Int @default(0)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| *Relasi* | `references infak_jinan(id) on delete cascade` | Engine InnoDB FK Cascade | `infak InfakJinan @relation(fields: [infak_id], references: [id], onDelete: Cascade)` |

### 2.5. Model `InfakJinanSantri` (`infak_jinan_santri`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `infak_id` | `uuid` FK | `CHAR(36)` FK | `infak_id String @db.Char(36)` |
| `name` | `text` | `VARCHAR(255)` | `name String @db.VarChar(255)` |
| `phone` | `text` | `VARCHAR(50)` | `phone String? @db.VarChar(50)` |
| `sort` | `integer` | `INT` | `sort Int @default(0)` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |
| *Relasi* | `references infak_jinan(id) on delete cascade` | Engine InnoDB FK Cascade | `infak InfakJinan @relation(fields: [infak_id], references: [id], onDelete: Cascade)` |

### 2.6. Model `SantriHafalanUpdate` (`santri_hafalan_updates`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `santri_id` | `uuid` FK | `CHAR(36)` FK | `santri_id String @db.Char(36)` |
| `updated_on` | `date` | `DATE` | `updated_on DateTime @db.Date` |
| `surah_no` | `integer` | `INT` | `surah_no Int` |
| `surah_name` | `text` | `VARCHAR(100)` | `surah_name String @db.VarChar(100)` |
| `ayat` | `integer` | `INT` | `ayat Int` |
| `juz` | `integer` | `INT` | `juz Int` |
| `notes` | `text` | `TEXT` | `notes String? @db.Text` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| *Relasi* | `references infak_jinan_santri(id) on delete cascade` | Engine InnoDB FK Cascade | `santri InfakJinanSantri @relation(fields: [santri_id], references: [id], onDelete: Cascade)` |

### 2.7. Model `GeberMasjidDistribution` (`geber_masjid_distributions`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `mosque_name` | `text` | `VARCHAR(255)` | `mosque_name String @db.VarChar(255)` |
| `province` | `text` | `VARCHAR(100)` | `province String @db.VarChar(100)` |
| `city` | `text` | `VARCHAR(100)` | `city String @db.VarChar(100)` |
| `district` | `text` | `VARCHAR(100)` | `district String @db.VarChar(100)` |
| `address` | `text` | `TEXT` | `address String @db.Text` |
| `lat` | `numeric` | `DECIMAL(10,8)` | `lat Decimal? @db.Decimal(10, 8)` |
| `lng` | `numeric` | `DECIMAL(11,8)` | `lng Decimal? @db.Decimal(11, 8)` |
| `activity_date` | `date` | `DATE` | `activity_date DateTime @db.Date` |
| `participants` | `integer` | `INT` | `participants Int @default(0)` |
| `activity_notes` | `text` | `TEXT` | `activity_notes String? @db.Text` |
| **`photo_urls`** | `text[]` | **`JSON`** | **`photo_urls Json`** (menyimpan `string[]`) |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |

### 2.8. Model `Report` (`reports`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `slug` | `text` Unique | `VARCHAR(191)` Unique | `slug String @unique @db.VarChar(191)` |
| `title` | `text` | `VARCHAR(255)` | `title String @db.VarChar(255)` |
| `program` | `text` | `VARCHAR(100)` | `program String @db.VarChar(100)` |
| `period_start` | `date` | `DATE` | `period_start DateTime @db.Date` |
| `period_end` | `date` | `DATE` | `period_end DateTime @db.Date` |
| `summary` | `text` | `TEXT` | `summary String @db.Text` |
| `body` | `text` | `LONGTEXT` | `body String @db.LongText` |
| `beneficiaries` | `integer` | `INT` | `beneficiaries Int @default(0)` |
| `amount_idr` | `bigint` | `BIGINT` | `amount_idr BigInt?` |
| `cover_url` | `text` | `VARCHAR(500)` | `cover_url String? @db.VarChar(500)` |
| **`gallery_urls`** | `text[]` | **`JSON`** | **`gallery_urls Json`** (menyimpan `string[]`) |
| `pdf_url` | `text` | `VARCHAR(500)` | `pdf_url String? @db.VarChar(500)` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |

### 2.9. Model `GalleryItem` (`gallery_items`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `title` | `text` | `VARCHAR(255)` | `title String @db.VarChar(255)` |
| `program` | `text` | `VARCHAR(100)` | `program String @db.VarChar(100)` |
| `date` | `date` | `DATE` | `date DateTime @db.Date` |
| `image_url` | `text` | `VARCHAR(500)` | `image_url String @db.VarChar(500)` |
| `caption` | `text` | `TEXT` | `caption String? @db.Text` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |

### 2.10. Model `ThemedCampaign` (`themed_campaigns`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `title` | `text` | `VARCHAR(255)` | `title String @db.VarChar(255)` |
| `disaster_type` | `text` | `VARCHAR(100)` | `disaster_type String @db.VarChar(100)` |
| `location` | `text` | `VARCHAR(150)` | `location String @db.VarChar(150)` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("aktif") @db.VarChar(50)` |
| `description` | `text` | `TEXT` | `description String @db.Text` |
| `cover_url` | `text` | `VARCHAR(500)` | `cover_url String? @db.VarChar(500)` |
| `target_idr` | `bigint` | `BIGINT` | `target_idr BigInt @default(0)` |
| `collected_idr` | `bigint` | `BIGINT` | `collected_idr BigInt @default(0)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |

### 2.11. Model `BussDistribution` (`buss_distributions`)
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `year` | `integer` | `INT` | `year Int` |
| `santri_name` | `text` | `VARCHAR(255)` | `santri_name String @db.VarChar(255)` |
| `origin` | `text` | `VARCHAR(150)` | `origin String @db.VarChar(150)` |
| `pesantren_name` | `text` | `VARCHAR(255)` | `pesantren_name String @db.VarChar(255)` |
| `current_surah` | `text` | `VARCHAR(100)` | `current_surah String @db.VarChar(100)` |
| `current_ayat` | `integer` | `INT` | `current_ayat Int` |
| `juz` | `integer` | `INT` | `juz Int` |
| `donor_name` | `text` | `VARCHAR(255)` | `donor_name String @db.VarChar(255)` |
| `show_donor_name` | `boolean` | `TINYINT(1)` | `show_donor_name Boolean @default(false)` |
| **`photo_urls`** | `text[]` | **`JSON`** | **`photo_urls Json`** (menyimpan `string[]`) |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |

### 2.12. Model `YatimDistribution` (`yatim_distributions`) — *Dibuat Baru di MySQL*
| Kolom | Tipe MySQL | Prisma Field Definition | Keterangan |
|---|---|---|---|
| `id` | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` | UUID |
| `year` | `INT` | `year Int` | Tahun kegiatan |
| `activity_name` | `VARCHAR(255)` | `activity_name String @db.VarChar(255)` | Nama santunan/pelatihan |
| `organizer` | `VARCHAR(255)` | `organizer String @db.VarChar(255)` | Penyelenggara |
| `description` | `TEXT` | `description String @db.Text` | Deskripsi program |
| **`photo_urls`** | **`JSON`** | **`photo_urls Json`** | Foto kegiatan (`string[]`) |
| **`documentation_urls`** | **`JSON`** | **`documentation_urls Json`** | Berkas dokumentasi (`string[]`) |
| `activity_date` | `DATE` | `activity_date DateTime? @db.Date` | Tanggal kegiatan |
| `status` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` | Status publikasi |
| `created_at` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` | Waktu dibuat |

### 2.13. Model `InfakDistribution` (`infak_distributions`) — *Legacy Single-Tier*
| Kolom | Tipe PostgreSQL | Tipe MySQL | Prisma Field Definition |
|---|---|---|---|
| `id` | `uuid` PK | `CHAR(36)` PK | `id String @id @default(uuid()) @db.Char(36)` |
| `mushaf_no` | `integer` Unique | `INT` Unique | `mushaf_no Int @unique` |
| `donor_name` | `text` | `VARCHAR(255)` | `donor_name String @db.VarChar(255)` |
| `show_donor_name` | `boolean` | `TINYINT(1)` | `show_donor_name Boolean @default(false)` |
| `recipient_name` | `text` | `VARCHAR(255)` | `recipient_name String @db.VarChar(255)` |
| `recipient_type` | `text` | `VARCHAR(50)` | `recipient_type String @db.VarChar(50)` |
| `province` | `text` | `VARCHAR(100)` | `province String @db.VarChar(100)` |
| `city` | `text` | `VARCHAR(100)` | `city String @db.VarChar(100)` |
| `district` | `text` | `VARCHAR(100)` | `district String @db.VarChar(100)` |
| `lat` | `numeric` | `DECIMAL(10,8)` | `lat Decimal? @db.Decimal(10, 8)` |
| `lng` | `numeric` | `DECIMAL(11,8)` | `lng Decimal? @db.Decimal(11, 8)` |
| `distributed_at` | `date` | `DATE` | `distributed_at DateTime @db.Date` |
| `quantity` | `integer` | `INT` | `quantity Int @default(1)` |
| `photo_url` | `text` | `VARCHAR(500)` | `photo_url String? @db.VarChar(500)` |
| `notes` | `text` | `TEXT` | `notes String? @db.Text` |
| `status` | `text` | `VARCHAR(50)` | `status String @default("published") @db.VarChar(50)` |
| `created_at` | `timestamptz` | `DATETIME(3)` | `created_at DateTime @default(now()) @db.DateTime(3)` |
| `updated_at` | `timestamptz` | `DATETIME(3)` | `updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)` |

---

## 3. PROPOSED `prisma/schema.prisma` LENGKAP UNTUK MYSQL

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// 1. Site Settings (Bank BCA & Kontak Narahubung)
model SiteSetting {
  key        String   @id @db.VarChar(191)
  value      Json
  updated_at DateTime @default(now()) @updatedAt @db.DateTime(3)

  @@map("site_settings")
}

// 2. Upload Ledger (Deduplikasi Hash Foto)
model UploadLedger {
  id           String    @id @default(uuid()) @db.Char(36)
  url          String    @unique @db.VarChar(500)
  content_hash String    @db.VarChar(64)
  size_bytes   Int
  mime_type    String    @db.VarChar(100)
  status       String    @db.VarChar(50)
  created_at   DateTime  @default(now()) @db.DateTime(3)
  committed_at DateTime? @db.DateTime(3)

  @@map("upload_ledger")
}

// 3. Infak Al-Qur'an Jinan (Tingkat 1 - Induk Mushaf)
model InfakJinan {
  id                 String               @id @default(uuid()) @db.Char(36)
  mushaf_no          Int                  @unique
  donor_name         String               @db.VarChar(255)
  show_donor_name    Boolean              @default(false)
  donor_origin       String               @db.VarChar(255)
  donor_phone        String?              @db.VarChar(50)
  dedication_name    String               @db.VarChar(255)
  pesantren_name     String               @db.VarChar(255)
  pesantren_province String?              @db.VarChar(100)
  pesantren_city     String?              @db.VarChar(100)
  address            String               @db.Text
  distributed_at     DateTime             @db.Date
  maps_url           String?              @db.VarChar(500)
  santri_name        String?              @db.VarChar(255)
  santri_phone       String?              @db.VarChar(50)
  status             String               @default("published") @db.VarChar(50)
  created_at         DateTime             @default(now()) @db.DateTime(3)
  updated_at         DateTime             @default(now()) @updatedAt @db.DateTime(3)
  photos             InfakJinanPhoto[]
  santri_list        InfakJinanSantri[]

  @@map("infak_jinan")
}

// 4. Foto Serah Terima Infak Jinan
model InfakJinanPhoto {
  id         String     @id @default(uuid()) @db.Char(36)
  infak_id   String     @db.Char(36)
  url        String     @db.VarChar(500)
  caption    String?    @db.VarChar(255)
  sort       Int        @default(0)
  created_at DateTime   @default(now()) @db.DateTime(3)
  infak      InfakJinan @relation(fields: [infak_id], references: [id], onDelete: Cascade)

  @@index([infak_id])
  @@map("infak_jinan_photos")
}

// 5. Santri Binaan Infak Jinan (Tingkat 2)
model InfakJinanSantri {
  id              String                 @id @default(uuid()) @db.Char(36)
  infak_id        String                 @db.Char(36)
  name            String                 @db.VarChar(255)
  phone           String?                @db.VarChar(50)
  sort            Int                    @default(0)
  status          String                 @default("published") @db.VarChar(50)
  created_at      DateTime               @default(now()) @db.DateTime(3)
  updated_at      DateTime               @default(now()) @updatedAt @db.DateTime(3)
  infak           InfakJinan             @relation(fields: [infak_id], references: [id], onDelete: Cascade)
  hafalan_updates SantriHafalanUpdate[]

  @@index([infak_id])
  @@map("infak_jinan_santri")
}

// 6. Progres Hafalan Santri
model SantriHafalanUpdate {
  id         String           @id @default(uuid()) @db.Char(36)
  santri_id  String           @db.Char(36)
  updated_on DateTime         @db.Date
  surah_no   Int
  surah_name String           @db.VarChar(100)
  ayat       Int
  juz        Int
  notes      String?          @db.Text
  created_at DateTime         @default(now()) @db.DateTime(3)
  santri     InfakJinanSantri @relation(fields: [santri_id], references: [id], onDelete: Cascade)

  @@index([santri_id])
  @@map("santri_hafalan_updates")
}

// 7. Geber Bersih Masjid
model GeberMasjidDistribution {
  id             String   @id @default(uuid()) @db.Char(36)
  mosque_name    String   @db.VarChar(255)
  province       String   @db.VarChar(100)
  city           String   @db.VarChar(100)
  district       String   @db.VarChar(100)
  address        String   @db.Text
  lat            Decimal? @db.Decimal(10, 8)
  lng            Decimal? @db.Decimal(11, 8)
  activity_date  DateTime @db.Date
  participants   Int      @default(0)
  activity_notes String?  @db.Text
  photo_urls     Json     // JSON Array string[]: ["url1", "url2"]
  status         String   @default("published") @db.VarChar(50)
  created_at     DateTime @default(now()) @db.DateTime(3)
  updated_at     DateTime @default(now()) @updatedAt @db.DateTime(3)

  @@map("geber_masjid_distributions")
}

// 8. BUSS Al-Qur'an
model BussDistribution {
  id              String   @id @default(uuid()) @db.Char(36)
  year            Int
  santri_name     String   @db.VarChar(255)
  origin          String   @db.VarChar(150)
  pesantren_name  String   @db.VarChar(255)
  current_surah   String   @db.VarChar(100)
  current_ayat    Int
  juz             Int
  donor_name      String   @db.VarChar(255)
  show_donor_name Boolean  @default(false)
  photo_urls      Json     // JSON Array string[]
  status          String   @default("published") @db.VarChar(50)
  created_at      DateTime @default(now()) @db.DateTime(3)

  @@map("buss_distributions")
}

// 9. Yatim Berdikari (Aktif di MySQL)
model YatimDistribution {
  id                 String    @id @default(uuid()) @db.Char(36)
  year               Int
  activity_name      String    @db.VarChar(255)
  organizer          String    @db.VarChar(255)
  description        String    @db.Text
  photo_urls         Json      // JSON Array string[]
  documentation_urls Json      // JSON Array string[]
  activity_date      DateTime? @db.Date
  status             String    @default("published") @db.VarChar(50)
  created_at         DateTime  @default(now()) @db.DateTime(3)

  @@map("yatim_distributions")
}

// 10. Laporan Penyaluran Resmi
model Report {
  id            String   @id @default(uuid()) @db.Char(36)
  slug          String   @unique @db.VarChar(191)
  title         String   @db.VarChar(255)
  program       String   @db.VarChar(100)
  period_start  DateTime @db.Date
  period_end    DateTime @db.Date
  summary       String   @db.Text
  body          String   @db.LongText
  beneficiaries Int      @default(0)
  amount_idr    BigInt?
  cover_url     String?  @db.VarChar(500)
  gallery_urls  Json     // JSON Array string[]
  pdf_url       String?  @db.VarChar(500)
  status        String   @default("published") @db.VarChar(50)
  created_at    DateTime @default(now()) @db.DateTime(3)
  updated_at    DateTime @default(now()) @updatedAt @db.DateTime(3)

  @@map("reports")
}

// 11. Galeri Foto Dokumentasi Kegiatan
model GalleryItem {
  id         String   @id @default(uuid()) @db.Char(36)
  title      String   @db.VarChar(255)
  program    String   @db.VarChar(100)
  date       DateTime @db.Date
  image_url  String   @db.VarChar(500)
  caption    String?  @db.Text
  status     String   @default("published") @db.VarChar(50)
  created_at DateTime @default(now()) @db.DateTime(3)

  @@map("gallery_items")
}

// 12. Donasi Tematik Bencana
model ThemedCampaign {
  id            String   @id @default(uuid()) @db.Char(36)
  title         String   @db.VarChar(255)
  disaster_type String   @db.VarChar(100)
  location      String   @db.VarChar(150)
  status        String   @default("aktif") @db.VarChar(50)
  description   String   @db.Text
  cover_url     String?  @db.VarChar(500)
  target_idr    BigInt   @default(0)
  collected_idr BigInt   @default(0)
  created_at    DateTime @default(now()) @db.DateTime(3)

  @@map("themed_campaigns")
}

// 13. Infak Single-Tier (Legacy & Impor CSV)
model InfakDistribution {
  id              String   @id @default(uuid()) @db.Char(36)
  mushaf_no       Int      @unique
  donor_name      String   @db.VarChar(255)
  show_donor_name Boolean  @default(false)
  recipient_name  String   @db.VarChar(255)
  recipient_type  String   @db.VarChar(50)
  province        String   @db.VarChar(100)
  city            String   @db.VarChar(100)
  district        String   @db.VarChar(100)
  lat             Decimal? @db.Decimal(10, 8)
  lng             Decimal? @db.Decimal(11, 8)
  distributed_at  DateTime @db.Date
  quantity        Int      @default(1)
  photo_url       String?  @db.VarChar(500)
  notes           String?  @db.Text
  status          String   @default("published") @db.VarChar(50)
  created_at      DateTime @default(now()) @db.DateTime(3)
  updated_at      DateTime @default(now()) @updatedAt @db.DateTime(3)

  @@map("infak_distributions")
}
```
