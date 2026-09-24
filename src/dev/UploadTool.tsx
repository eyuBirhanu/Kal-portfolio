// src/dev/UploadTool.tsx
//
// DEVELOPMENT ONLY. The route that mounts this is wrapped in
// import.meta.env.DEV in routes.tsx, so Vite tree-shakes the whole file —
// and the Cloudinary credentials it reads — out of any production build.
//
// The old version of this page had a VITE_PIN "gate" that was inlined into the
// bundle and readable in devtools in about ten seconds. It has been removed
// rather than replaced: the fix is not shipping the tool at all.
//
// It also finishes the job the old one started. That one handed you a URL and
// you hand-wrote the rest of the entry, which is exactly where "Skill Bridge"
// vs "SkillBridge" and the duplicate slugs came from. This one reads the
// dimensions from Cloudinary's response, offers existing clients and tags as
// pickers, and emits a complete, valid entry.

import { useMemo, useState } from "react";
import { clients, projects } from "../lib/content";
import { Button } from "../components/primitives/Button";
import { Meta } from "../components/primitives/Meta";
import { CopyButton } from "../components/primitives/CopyButton";
import type { ProjectType } from "../types";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

type Uploaded = { url: string; width: number; height: number; name: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");

export default function UploadTool() {
  const [file, setFile] = useState<Uploaded | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState<ProjectType>("graphic");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState("");
  const [role, setRole] = useState("");
  const [tools, setTools] = useState("");
  const [tags, setTags] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const existingTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort(),
    []
  );

  const upload = async (f: File) => {
    if (!CLOUD || !PRESET) {
      setError("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", f);
      body.append("upload_preset", PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed");
      // width/height come back free — this is what kills the layout shift
      setFile({ url: data.secure_url, width: data.width, height: data.height, name: f.name });
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const entry = useMemo(() => {
    if (!file && type !== "video") return null;
    const slug = slugify(title || "untitled");
    const base = {
      id: `${type.slice(0, 3)}-${slug.slice(0, 20)}`,
      slug,
      type,
      title: title || "Untitled",
      clientId: clientId || null,
      date,
      year: Number(date.slice(0, 4)),
      summary,
      role: role.split(",").map((s) => s.trim()).filter(Boolean),
      tools: tools.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      featured,
      order: 0,
      thumbnail: {
        url: file?.url ?? "",
        width: file?.width ?? null,
        height: file?.height ?? null,
      },
      gallery: [],
      caseStudy: null,
      links: [],
    };
    const media =
      type === "video"
        ? { provider: "youtube", embedUrl: videoUrl, format: "widescreen" }
        : type === "graphic"
          ? { fullUrl: file?.url ?? "" }
          : { platform: "Instagram", link: "", stats: null };
    return { ...base, media };
  }, [file, title, clientId, type, date, summary, role, tools, tags, videoUrl, featured]);

  const json = entry ? JSON.stringify(entry, null, 2) : "";

  const downloadAll = () => {
    if (!entry) return;
    const merged = [entry, ...projects.map(({ client: _c, ...p }) => p)].map((p, i) => ({
      ...p,
      order: i,
    }));
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(a ? blob : blob);
    a.download = "projects.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="px-6 pb-24 pt-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Meta tone="accent">Development only</Meta>
          <h1 className="text-display-md">Add a project</h1>
          <p className="text-body-sm text-fg-muted">
            This page is stripped from production builds. Upload, fill in the
            fields, then paste the result into{" "}
            <code className="text-accent-ink">src/data/projects.json</code>.
          </p>
        </header>

        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-card border-2 border-dashed border-line bg-card px-6 py-14 text-center transition-colors hover:border-accent">
          <input
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {busy ? (
            <Meta tone="accent">Uploading…</Meta>
          ) : file ? (
            <>
              <img src={file.url} alt="" className="max-h-40 rounded-card" />
              <Meta>
                {file.name} · {file.width}×{file.height}
              </Meta>
            </>
          ) : (
            <>
              <Meta size="lg">Drop a file, or click to browse</Meta>
              <Meta>Dimensions are read automatically</Meta>
            </>
          )}
        </label>

        {error && (
          <p role="alert" className="text-body-sm text-red-400">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Title" value={title} onChange={setTitle} />
          <Select
            label="Client"
            value={clientId}
            onChange={setClientId}
            options={[
              { value: "", label: "— none —" },
              ...clients.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Select
            label="Type"
            value={type}
            onChange={(v) => setType(v as ProjectType)}
            options={[
              { value: "graphic", label: "Graphic" },
              { value: "video", label: "Video" },
              { value: "social", label: "Social" },
            ]}
          />
          <Text label="Date" value={date} onChange={setDate} type="date" />
          {type === "video" && (
            <Text
              label="YouTube embed URL"
              value={videoUrl}
              onChange={setVideoUrl}
              className="sm:col-span-2"
            />
          )}
          <Text label="Summary" value={summary} onChange={setSummary} className="sm:col-span-2" />
          <Text label="Role (comma separated)" value={role} onChange={setRole} />
          <Text label="Tools (comma separated)" value={tools} onChange={setTools} />
          <Text
            label="Tags (comma separated)"
            value={tags}
            onChange={setTags}
            className="sm:col-span-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Meta>Existing tags:</Meta>
          {existingTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTags((v) => (v ? `${v}, ${t}` : t))}
              className="rounded-pill border border-line px-3 py-1 font-mono text-meta uppercase text-fg-subtle hover:border-accent hover:text-accent-ink"
            >
              {t}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
          <Meta tone="fg">Featured — gets the full case-study layout</Meta>
        </label>

        {json && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Meta size="lg">Entry</Meta>
              <div className="flex gap-2">
                <CopyButton value={json} label="entry" />
                <Button size="sm" onClick={downloadAll}>
                  Download full projects.json
                </Button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-card border border-line bg-card p-5 font-mono text-meta text-fg">
              {json}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  const id = slugify(label);
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="font-mono text-meta uppercase text-fg-subtle">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-card border border-line bg-surface px-3 text-body-sm text-fg focus:border-accent"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = slugify(label);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-meta uppercase text-fg-subtle">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-card border border-line bg-surface px-3 text-body-sm text-fg focus:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
