"use client";

import Link from "next/link";
import AuthPanel from "@/components/auth/AuthPanel";

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_460px]">
      <section className="flex flex-col justify-between p-6 md:p-10">
        <Link href="/" className="text-2xl font-bold text-slate-950">GurbPac Broadcast</Link>
        <div className="max-w-2xl py-12">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Education content workflow</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950 md:text-5xl">Upload, approve, and broadcast classroom videos.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">Teachers submit subject content, principals review it, and students watch approved videos from public slug pages.</p>
        </div>
      
      </section>
      <section className="flex items-center justify-center border-l border-slate-200 bg-white p-6">
        <div className="w-full max-w-md">
          <AuthPanel />
        </div>
      </section>
    </main>
  );
}
