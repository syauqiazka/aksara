-- AKSARA — PRODUCTION MYSQL DDL SCHEMA (HOSTINGER MYSQL 8.0 / MARIADB 10.x)
-- Generated from prisma/schema.prisma

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. upload_ledger
CREATE TABLE IF NOT EXISTS `upload_ledger` (
    `id` CHAR(36) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `content_hash` VARCHAR(64) NOT NULL,
    `size_bytes` INTEGER NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `committed_at` DATETIME(3) NULL,
    UNIQUE INDEX `upload_ledger_url_key`(`url`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. infak_jinan
CREATE TABLE IF NOT EXISTS `infak_jinan` (
    `id` CHAR(36) NOT NULL,
    `mushaf_no` INTEGER NOT NULL,
    `donor_name` VARCHAR(255) NOT NULL,
    `show_donor_name` BOOLEAN NOT NULL DEFAULT false,
    `donor_origin` VARCHAR(255) NOT NULL,
    `donor_phone` VARCHAR(50) NULL,
    `dedication_name` VARCHAR(255) NOT NULL,
    `pesantren_name` VARCHAR(255) NOT NULL,
    `pesantren_province` VARCHAR(100) NULL,
    `pesantren_city` VARCHAR(100) NULL,
    `address` TEXT NOT NULL,
    `distributed_at` DATE NOT NULL,
    `maps_url` VARCHAR(500) NULL,
    `santri_name` VARCHAR(255) NULL,
    `santri_phone` VARCHAR(50) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `infak_jinan_mushaf_no_key`(`mushaf_no`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. infak_jinan_photos
CREATE TABLE IF NOT EXISTS `infak_jinan_photos` (
    `id` CHAR(36) NOT NULL,
    `infak_id` CHAR(36) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `infak_jinan_photos_infak_id_idx`(`infak_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `infak_jinan_photos_infak_id_fkey` FOREIGN KEY (`infak_id`) REFERENCES `infak_jinan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. infak_jinan_santri
CREATE TABLE IF NOT EXISTS `infak_jinan_santri` (
    `id` CHAR(36) NOT NULL,
    `infak_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX `infak_jinan_santri_infak_id_idx`(`infak_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `infak_jinan_santri_infak_id_fkey` FOREIGN KEY (`infak_id`) REFERENCES `infak_jinan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. santri_hafalan_updates
CREATE TABLE IF NOT EXISTS `santri_hafalan_updates` (
    `id` CHAR(36) NOT NULL,
    `santri_id` CHAR(36) NOT NULL,
    `updated_on` DATE NOT NULL,
    `surah_no` INTEGER NOT NULL,
    `surah_name` VARCHAR(100) NOT NULL,
    `ayat` INTEGER NOT NULL,
    `juz` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `santri_hafalan_updates_santri_id_idx`(`santri_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `santri_hafalan_updates_santri_id_fkey` FOREIGN KEY (`santri_id`) REFERENCES `infak_jinan_santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. geber_masjid_distributions
CREATE TABLE IF NOT EXISTS `geber_masjid_distributions` (
    `id` CHAR(36) NOT NULL,
    `mosque_name` VARCHAR(255) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `lat` DECIMAL(10, 8) NULL,
    `lng` DECIMAL(11, 8) NULL,
    `activity_date` DATE NOT NULL,
    `participants` INTEGER NOT NULL DEFAULT 0,
    `activity_notes` TEXT NULL,
    `photo_urls` JSON NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. buss_distributions
CREATE TABLE IF NOT EXISTS `buss_distributions` (
    `id` CHAR(36) NOT NULL,
    `year` INTEGER NOT NULL,
    `santri_name` VARCHAR(255) NOT NULL,
    `origin` VARCHAR(150) NOT NULL,
    `pesantren_name` VARCHAR(255) NOT NULL,
    `current_surah` VARCHAR(100) NOT NULL,
    `current_ayat` INTEGER NOT NULL,
    `juz` INTEGER NOT NULL,
    `donor_name` VARCHAR(255) NOT NULL,
    `show_donor_name` BOOLEAN NOT NULL DEFAULT false,
    `photo_urls` JSON NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. yatim_distributions
CREATE TABLE IF NOT EXISTS `yatim_distributions` (
    `id` CHAR(36) NOT NULL,
    `year` INTEGER NOT NULL,
    `activity_name` VARCHAR(255) NOT NULL,
    `organizer` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `photo_urls` JSON NOT NULL,
    `documentation_urls` JSON NOT NULL,
    `activity_date` DATE NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10. reports
CREATE TABLE IF NOT EXISTS `reports` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `program` VARCHAR(100) NOT NULL,
    `period_start` DATE NOT NULL,
    `period_end` DATE NOT NULL,
    `summary` TEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `beneficiaries` INTEGER NOT NULL DEFAULT 0,
    `amount_idr` BIGINT NULL,
    `cover_url` VARCHAR(500) NULL,
    `gallery_urls` JSON NOT NULL,
    `pdf_url` VARCHAR(500) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `reports_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 11. gallery_items
CREATE TABLE IF NOT EXISTS `gallery_items` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `program` VARCHAR(100) NOT NULL,
    `date` DATE NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `caption` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 12. themed_campaigns
CREATE TABLE IF NOT EXISTS `themed_campaigns` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `disaster_type` VARCHAR(100) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'aktif',
    `description` TEXT NOT NULL,
    `cover_url` VARCHAR(500) NULL,
    `target_idr` BIGINT NOT NULL DEFAULT 0,
    `collected_idr` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 13. infak_distributions
CREATE TABLE IF NOT EXISTS `infak_distributions` (
    `id` CHAR(36) NOT NULL,
    `mushaf_no` INTEGER NOT NULL,
    `donor_name` VARCHAR(255) NOT NULL,
    `show_donor_name` BOOLEAN NOT NULL DEFAULT false,
    `recipient_name` VARCHAR(255) NOT NULL,
    `recipient_type` VARCHAR(50) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `lat` DECIMAL(10, 8) NULL,
    `lng` DECIMAL(11, 8) NULL,
    `distributed_at` DATE NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `photo_url` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `infak_distributions_mushaf_no_key`(`mushaf_no`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
