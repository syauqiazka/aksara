-- Migration 20261107000001_fix_infak_jinan_santri_name_nullable.sql
-- Memastikan kolom santri_name dan santri_phone pada tabel infak_jinan bersifat opsional (nullable)
-- karena data santri dikelola di tabel terelasi infak_jinan_santri (arsitektur dua tingkat).

ALTER TABLE public.infak_jinan 
  ALTER COLUMN santri_name DROP NOT NULL,
  ALTER COLUMN santri_phone DROP NOT NULL;

-- Pastikan izin penuh untuk operasional database backend
GRANT ALL ON public.infak_jinan TO postgres, service_role;
GRANT ALL ON public.infak_jinan_santri TO postgres, service_role;
GRANT ALL ON public.infak_jinan_photos TO postgres, service_role;
GRANT ALL ON public.santri_hafalan_updates TO postgres, service_role;

