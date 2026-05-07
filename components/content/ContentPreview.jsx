"use client";

export default function ContentPreview({ item, className = "" }) {
  const poster = item?.posterUrl;
  const video = item?.videoUrl;

  if (video) {
    return (
      <video
        className={`aspect-video w-full rounded-lg bg-slate-900 object-cover ${className}`}
        src={video}
        poster={poster}
        controls
        preload="metadata"
      />
    );
  }

  if (poster) {
    return (
      <img
        className={`aspect-video w-full rounded-lg bg-slate-100 object-cover ${className}`}
        src={poster}
        alt={item?.title || "Content preview"}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 ${className}`}>
      Preview unavailable
    </div>
  );
}
