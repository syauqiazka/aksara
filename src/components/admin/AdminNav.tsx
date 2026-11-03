"use client";

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
} from "lucide-react";

interface AdminNavProps {
  adminEmail: string;
}

const adminMenu = [
  { href: "/admin", label: "Dashboard Ringkas", icon: LayoutDashboard },
  { href: "/admin/infak", label: "Data Infak Al-Qur'an", icon: BookOpen },
  { href: "/admin/geber-masjid", label: "Data Geber Masjid", icon: Building2 },
  { href: "/admin/laporan", label: "Laporan Penyaluran", icon: FileText },
  { href: "/admin/donasi-tematik", label: "Donasi Tematik", icon: HeartHandshake },
  { href: "/admin/dokumentasi", label: "Galeri Dokumentasi", icon: ImageIcon },
  { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: Settings },
];

export default function AdminNav({ adminEmail }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-64 bg-[var(--green-950)] text-[var(--cream-50)] border-r border-[var(--gold-500)]/30 flex-shrink-0 flex flex-col justify-between p-6 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[var(--gold-500)]/20">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--gold-400)] bg-[var(--green-900)]">
            <Image
              src="/images/logo-sahabat-aksara.jpg"
              alt="Logo Sahabat Aksara"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-serif font-bold text-base leading-tight">
              Sahabat Aksara
            </div>
            <div className="text-[10px] text-[var(--gold-400)] uppercase tracking-wider">
              Admin Backoffice
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Menu Admin">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--green-900)] text-[var(--gold-300)] border border-[var(--gold-500)]/40 font-semibold"
                    : "text-[var(--cream-100)]/80 hover:bg-[var(--green-900)]/50 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-[var(--gold-400)]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Info & Actions */}
      <div className="pt-6 border-t border-[var(--gold-500)]/20 space-y-4">
        <div className="text-xs text-[var(--sage-300)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--gold-400)]">Login Sebagai:</p>
          <p className="font-mono text-[var(--cream-100)] truncate mt-0.5">{adminEmail}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--green-900)]/40 text-xs text-[var(--cream-100)] hover:text-[var(--gold-300)] transition-colors"
          >
            <span>Buka Situs Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--gold-400)]" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--terracotta-500)] hover:bg-[var(--terracotta-500)]/15 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

