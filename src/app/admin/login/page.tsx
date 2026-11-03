"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Email atau kata sandi salah");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--green-950)] text-[var(--cream-50)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-stars opacity-20 pointer-events-none" />

      <section className="relative z-10 w-full max-w-md bg-[var(--green-900)] border border-[var(--gold-500)]/40 rounded-2xl p-7 sm:p-9 shadow-2xl">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold-500)] mx-auto mb-5 bg-[var(--green-950)]">
            <Image
              src="/images/logo-sahabat-aksara.jpg"
              alt="Logo Sahabat Aksara"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[11px] text-[var(--gold-300)] uppercase tracking-[0.18em] font-semibold mb-2">
            Sahabat Aksara
          </p>
          <h1 className="font-serif text-3xl font-bold text-[var(--cream-50)]">
            Masuk Pengelola
          </h1>
          <p className="text-sm text-[var(--cream-200)]/80 mt-2 leading-relaxed">
            Gunakan akun pengurus yang telah diberikan oleh administrator yayasan.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-[var(--danger)]/15 border border-[var(--danger)]/40 text-sm text-[var(--cream-50)] flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-[var(--cream-100)] mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sage-300)]" />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@organisasi.id"
                className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-[var(--green-950)] border border-[var(--gold-500)]/30 text-sm text-[var(--cream-50)] placeholder:text-[var(--sage-500)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-300)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-[var(--cream-100)] mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sage-300)]" />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-[var(--green-950)] border border-[var(--gold-500)]/30 text-sm text-[var(--cream-50)] placeholder:text-[var(--sage-500)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-300)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 px-5 rounded-lg text-sm font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-900)]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
          </button>
        </form>

        <p className="mt-7 pt-5 border-t border-[var(--gold-500)]/20 text-center text-xs text-[var(--sage-300)]">
          Halaman ini hanya dapat diakses oleh pengurus yang berwenang.
        </p>
      </section>
    </main>
  );
}
