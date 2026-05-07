"use client";

import Link from "next/link";
import { useState } from "react";
import { useContent } from "@/hooks/useContent";

export default function Home() {
  const { items, loading, error } = useContent();
  const [query, setQuery] = useState("");

  const approved = items.filter((item) => item?.status === "approved");
  
  const filtered = approved.filter((item) => {
    const searchText = `${item?.title || ""} ${item?.subject || ""}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-slate-950">GurbPac Broadcast</Link>
            <p className="mt-1 text-sm text-slate-500">Approved classroom content, ready for students.</p>
          </div>
          <Link href="/auth" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Staff Login
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-950">Course Videos</h1>
              <p className="mt-1 text-sm text-slate-500">Poster par click karo, video slug page me open hoga.</p>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or subject"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 md:max-w-xs"
            />
          </div>

          {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : null}

          {!loading && filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Link key={item?._id || item?.slug} href={`/live/${item?.slug || item?._id}`}>
                  <article className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {item?.posterUrl ? (
                      <img
                        src={item.posterUrl}
                        alt={item?.title || "Course poster"}
                        className="aspect-video w-full bg-slate-100 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                        Poster unavailable
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 text-base font-bold text-slate-950">{item?.title || "Untitled"}</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {item?.subject || "Subject"} by {item?.teacherId?.name || item?.teacherId?.email || "Teacher"}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-800 ring-1 ring-emerald-200">active</span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-950">Watch video</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : null}

          {!loading && !filtered.length ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-base font-semibold text-slate-950">No content available</h3>
              <p className="mt-1 text-sm text-slate-500">Approved content will show here for students.</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
