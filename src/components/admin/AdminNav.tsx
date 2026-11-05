"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  FileText,
  HeartHandshake,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
} from "lucide-react";

interface AdminNavProps {
  adminEmail: string;
}

const adminMenu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/infak", label: "Infak Al-Qur'an", icon: BookOpen },
  { href: "/admin/geber-masjid", label: "Geber Masjid", icon: Building2 },
  { href: "/admin/laporan", label: "Laporan Penyaluran", icon: FileText },
  { href: "/admin/donasi-tematik", label: "Donasi Tematik", icon: HeartHandshake },
  { href: "/admin/dokumentasi", label: "Galeri Foto", icon: ImageIcon },
  { href: "/admin/pengaturan", label: "Pengaturan & Rekening", icon: Settings },
  { href: "/admin/pengaturan/storage", label: "Pembersih Storage", icon: Database },
];

export default function AdminNav({ adminEmail }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-[var(--green-950)] text-white px-4 py-3 border-b border-[var(--gold-500)]/30 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--gold-400)] bg-[var(--green-900)] flex-shrink-0">
            <Image
              src="/images/logo-sahabat-aksara.jpg"
              alt="Logo Sahabat Aksara"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-fraunces font-bold text-sm leading-tight block">
              Sahabat Aksara
            </span>
            <span className="text-[10px] text-[var(--gold-400)] uppercase tracking-wider block">
              Backoffice
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          type="button"
          aria-label={mobileOpen ? "Tutup Menu" : "Buka Menu"}
          className="p-2 rounded-lg bg-[var(--green-900)] text-[var(--cream-100)] border border-[var(--gold-500)]/30 cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar Desktop + Drawer Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-30 w-64 bg-[var(--green-950)] text-[var(--cream-50)] border-r border-[var(--gold-500)]/30 flex-shrink-0 flex flex-col justify-between p-5 h-screen overflow-y-auto transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header Desktop */}
          <div className="hidden md:flex items-center gap-3 pb-5 mb-5 border-b border-[var(--gold-500)]/20">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--gold-400)] bg-[var(--green-900)] flex-shrink-0">
              <Image
                src="/images/logo-sahabat-aksara.jpg"
                alt="Logo Sahabat Aksara"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-fraunces font-bold text-base leading-tight">
                Sahabat Aksara
              </div>
              <div className="text-[10px] text-[var(--gold-400)] uppercase tracking-wider font-semibold">
                Sistem Pengurus
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Menu Admin">
            {adminMenu.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/40 font-semibold shadow-inner"
                      : "text-[var(--cream-100)]/80 hover:bg-[var(--green-900)]/50 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? "text-[var(--gold-400)]" : "text-[var(--sage-300)]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin User Info & Actions */}
        <div className="pt-5 border-t border-[var(--gold-500)]/20 space-y-3.5">
          <div className="text-xs text-[var(--sage-300)] bg-[var(--green-900)]/40 p-2.5 rounded-xl border border-[var(--gold-500)]/15">
            <p className="text-[10px] uppercase tracking-wider text-[var(--gold-400)] font-semibold">
              Pengurus Terautentikasi
            </p>
            <p className="font-mono text-[var(--cream-100)] truncate mt-0.5 text-[11px]" title={adminEmail}>
              {adminEmail}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--green-900)]/40 text-xs text-[var(--cream-100)] hover:text-[var(--gold-300)] hover:bg-[var(--green-900)] transition-colors cursor-pointer"
            >
              <span className="font-medium">Lihat Situs Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            </Link>

            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
