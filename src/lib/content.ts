// src/lib/content.ts
//
// The single entry point for all portfolio content. Parses both JSON files,
// resolves clientId → Client, and fails loudly on bad data. Nothing else in
// the app should import the raw JSON.

import clientsJson from "../data/clients.json";
import projectsJson from "../data/projects.json";
import {
  ClientSchema,
  ProjectSchema,
  type Client,
  type Filter,
  type Project,
  type ResolvedProject,
  type Thumbnail,
} from "../types";
import { youTubeThumbnail, YOUTUBE_THUMB_SIZE } from "./media";
import { z } from "zod";

function parseOrThrow<T>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  data: unknown,
  label: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Vite surfaces this in the terminal and the browser overlay, with the
    // exact path of the bad field.
    console.error(`[content] ${label} failed validation:`, result.error.format());
    throw new Error(`Invalid ${label}. See console for the offending field.`);
  }
  return result.data;
}

export const clients: Client[] = parseOrThrow(
  z.array(ClientSchema),
  clientsJson,
  "clients.json"
);

const clientsById = new Map(clients.map((c) => [c.id, c]));

const rawProjects = parseOrThrow(
  z.array(ProjectSchema),
  projectsJson,
  "projects.json"
);

// Referential integrity: a clientId pointing at nothing is the bug that made
// the marquee advertise clients with no work behind them.
for (const p of rawProjects) {
  if (p.clientId && !clientsById.has(p.clientId)) {
    throw new Error(
      `Project "${p.id}" references unknown clientId "${p.clientId}".`
    );
  }
}

const slugs = new Set<string>();
for (const p of rawProjects) {
  if (slugs.has(p.slug)) throw new Error(`Duplicate project slug "${p.slug}".`);
  slugs.add(p.slug);
}

/**
 * Video projects take their still from YouTube.
 *
 * YouTube renders one for every video, so uploading a copy by hand is work
 * that buys nothing — and it went wrong exactly the way hand-copied data
 * does: both video entries were pointing at the same Cloudinary file, so the
 * two cards in the archive were the same picture.
 *
 * An explicit `thumbnail` in the JSON still wins, which is the escape hatch
 * for a video whose maxresdefault doesn't exist or whose auto-still is an
 * unflattering frame.
 */
function resolveThumbnail(p: Project): Thumbnail {
  if (p.thumbnail) return p.thumbnail;

  if (p.type === "video") {
    const url = youTubeThumbnail(p.media.embedUrl);
    if (url) return { url, ...YOUTUBE_THUMB_SIZE };
    throw new Error(
      `Project "${p.id}" has no thumbnail and no readable YouTube id in ` +
        `embedUrl "${p.media.embedUrl}". Add a thumbnail, or fix the URL.`
    );
  }

  throw new Error(
    `Project "${p.id}" (${p.type}) needs a thumbnail. Only video projects ` +
      `can derive one automatically.`
  );
}

export const projects: ResolvedProject[] = rawProjects
  .map((p) => ({
    ...p,
    thumbnail: resolveThumbnail(p),
    client: p.clientId ? clientsById.get(p.clientId)! : null,
  }))
  .sort((a, b) => a.order - b.order) as ResolvedProject[];

// ── Selectors ────────────────────────────────────────────────────────────────

export const featuredProjects = projects.filter((p) => p.featured);

/** Everything not featured — the dense archive grid. */
export const archiveProjects = projects.filter((p) => !p.featured);

export const marqueeClients = clients.filter((c) => c.showInMarquee);

export function getProjectBySlug(slug: string): ResolvedProject | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Adjacent projects for prev/next navigation on a project page. */
export function getProjectNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}

export function filterProjects(
  list: ResolvedProject[],
  filter: Filter,
  query: string
): ResolvedProject[] {
  const q = query.trim().toLowerCase();
  return list.filter((p) => {
    if (filter !== "all" && p.type !== filter) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.client?.name.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

/**
 * Work to show at the bottom of a project page: same client first, because
 * "three more things I made for A2SV" is a stronger signal than "three more
 * posters", then same type to fill the row.
 */
export function getRelatedProjects(slug: string, limit = 3): ResolvedProject[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const others = projects.filter((p) => p.slug !== slug);
  const sameClient = current.clientId
    ? others.filter((p) => p.clientId === current.clientId)
    : [];
  const sameType = others.filter(
    (p) => p.type === current.type && !sameClient.includes(p)
  );

  return [...sameClient, ...sameType].slice(0, limit);
}

/** Years present in the data, newest first — for a year filter. */
export const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

/** Clients that actually have work, for a client filter and client pages. */
export const clientsWithWork = clients.filter((c) =>
  projects.some((p) => p.clientId === c.id)
);