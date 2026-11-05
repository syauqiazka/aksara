-- Tambahkan kolom lokasi terstruktur pesantren pada tabel infak_jinan
ALTER TABLE public.infak_jinan
ADD COLUMN IF NOT EXISTS pesantren_province TEXT,
ADD COLUMN IF NOT EXISTS pesantren_city TEXT;

-- Index untuk percepat query agregat sebaran provinsi
CREATE INDEX IF NOT EXISTS idx_infak_jinan_pesantren_province ON public.infak_jinan (pesantren_province);

-- Update data historis yang ada: jika address mengandung 'Jawa Barat' atau 'Cirebon', isi default
UPDATE public.infak_jinan
SET 
  pesantren_province = COALESCE(pesantren_province, 'Jawa Barat'),
  pesantren_city = COALESCE(pesantren_city, 'Cirebon')
WHERE address ILIKE '%Cirebon%' OR address ILIKE '%Jawa Barat%';

