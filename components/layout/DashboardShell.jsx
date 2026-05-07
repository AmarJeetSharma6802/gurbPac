"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = {
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/teacher/upload", label: "Upload" },
    { href: "/teacher/content", label: "My Content" },
  ],
  principal: [
    { href: "/principal/dashboard", label: "Dashboard" },
    { href: "/principal/approvals", label: "Approvals" },
    { href: "/principal/content", label: "All Content" },
  ],
};

export default function DashboardShell({ role, title, subtitle, children }) {
  const pathname = usePathname();

  const { user, logout } = useAuth();
  
  const links = navItems[role] || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="text-xl font-bold text-slate-950">GurbPac</Link>
        <p className="mt-1 text-sm capitalize text-slate-500">{role} workspace</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-3 py-2 text-sm font-semibold ${active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-950">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-100"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${pathname === link.href ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
