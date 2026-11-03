"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

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
      setError("Email atau kata sandi salah");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--green-950)] text-[var(--cream-50)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-stars opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[var(--green-900)]/90 backdrop-blur-md border-2 border-[var(--gold-500)]/40 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold-500)] mx-auto mb-4 bg-[var(--green-950)]">
            <Image
              src="/images/logo-sahabat-aksara.jpg"
              alt="Logo Sahabat Aksara"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cream-50)]">
            Portal Kelola Yayasan
          </h1>
          <p className="text-xs text-[var(--gold-400)] mt-1 uppercase tracking-widest font-sans">
            Akses Khusus Pengurus Sahabat Aksara
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[var(--danger)]/20 border border-[var(--danger)]/40 text-xs text-[var(--cream-50)] flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--cream-100)] uppercase tracking-wider mb-2">
              Alamat Email Pengurus
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sage-300)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sahabataksara.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--green-950)] border border-[var(--gold-500)]/30 text-sm text-[var(--cream-50)] placeholder:text-[var(--ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--cream-100)] uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sage-300)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--green-950)] border border-[var(--gold-500)]/30 text-sm text-[var(--cream-50)] placeholder:text-[var(--ink-400)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-400)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-sm font-semibold bg-gold-gradient text-[var(--green-950)] hover:brightness-110 shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--green-950)]" />
            <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--gold-500)]/20 text-center text-xs text-[var(--sage-300)]">
          <p>Kredensial Default Pengurus:</p>
          <p className="font-mono text-[var(--gold-300)] mt-1">
            admin@sahabataksara.id / aksaramulia2026
          </p>
        </div>
      </div>
    </div>
  );
}

