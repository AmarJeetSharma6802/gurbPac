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


      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              AS
            </div>
            <div>
              <p className="font-semibold text-slate-950">Amarjeet Sharma</p>
              <p className="text-sm text-slate-500">Full stack developer</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://portfolio-beta-dusky-34.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4.93" />
                <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19.07" />
              </svg>
              Portfolio
            </a>
            <a
              href="https://github.com/AmarJeetSharma6802"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.67.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/amarjeet-sharma-full-stack/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.42 8.02h4.16V23H.42V8.02ZM8.02 8.02H12v2.05h.06c.55-1.04 1.9-2.14 3.91-2.14 4.18 0 4.95 2.75 4.95 6.32V23h-4.16v-7.76c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.98 2.02-2.98 4.1V23H8.02V8.02Z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
