"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContentPreview from "@/components/content/ContentPreview";
import { contentService } from "@/services/content.service";

export default function LivePage() {
  const { slug } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError("");
      try {
        const data = await contentService.getBySlug(slug);
        if (mounted) setContent(data);
      } catch (err) {
        if (mounted) setError(err?.message || "Unable to load live content");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug) load();
    const timer = setInterval(load, 30000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [slug]);

  const visible = content?.status === "approved";
  const teacherName = content?.teacherId?.name || content?.teacherId?.email || "Teacher";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">GurbPac Live</Link>
          <span className="text-xs text-slate-400">Auto refresh: 30s</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : null}
        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {!loading && !error && !visible ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
            <h3 className="text-base font-semibold text-white">No content available</h3>
            <p className="mt-1 text-sm text-slate-400">This live page has no approved active content right now.</p>
          </div>
        ) : null}
        {visible ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <ContentPreview item={content} />
            <aside className="rounded-lg border border-white/10 bg-white/10 p-5">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-800 ring-1 ring-emerald-200">active</span>
              <h1 className="mt-4 text-3xl font-bold">{content?.title}</h1>
              <p className="mt-2 text-slate-300">{content?.subject}</p>
              <p className="mt-1 text-sm text-slate-400">Teacher: {teacherName}</p>
              {content?.description ? <p className="mt-5 text-sm leading-6 text-slate-300">{content.description}</p> : null}
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}
