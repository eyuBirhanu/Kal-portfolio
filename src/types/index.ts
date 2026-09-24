// src/types/index.ts
//
// The old build did `projectsData as Project[]` — a cast, not a check. A typo
// in the JSON compiled fine and crashed the browser. These schemas parse the
// data at startup instead, so a bad entry fails loudly in the terminal with
// the offending field named.

import { z } from "zod";

// ── Client ───────────────────────────────────────────────────────────────────

export const ClientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** null = no real logo yet; such clients are excluded from the marquee. */
  logoUrl: z.string().nullable(),
  showInMarquee: z.boolean(),
});

export type Client = z.infer<typeof ClientSchema>;

// ── Shared project fields ────────────────────────────────────────────────────

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const ThumbnailSchema = z.object({
  url: z.string().url(),
  /** Intrinsic size, so the grid can reserve space and stop layout shift.
   *  null until the upload tool or a backfill fills it in. */
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});

/** Extra images beyond the hero — process shots, variants, a campaign set. */
const GalleryItemSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().int().positive().nullable().default(null),
  height: z.number().int().positive().nullable().default(null),
});

/**
 * Only featured work carries this. Twelve thin case studies read worse than
 * two real ones, so the field is optional and stays null for archive pieces.
 */
const CaseStudySchema = z.object({
  brief: z.string(),
  approach: z.string(),
  outcome: z.string().optional(),
});

const ExternalLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;

const BaseProjectSchema = z.object({
  id: z.string().min(1),
  /** URL segment for /works/:slug — unique across all projects. */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  /** Must match a Client.id. Cross-checked in loadContent(). */
  clientId: z.string().nullable(),
  date: z.string().regex(ISO_DATE, "date must be YYYY-MM-DD"),
  year: z.number().int().min(2000).max(2100),
  summary: z.string(),
  /** What you actually did. Drives the credits line on the project page. */
  role: z.array(z.string()),
  /** Software used. Renders as mono metadata, like a camera data slate. */
  tools: z.array(z.string()),
  tags: z.array(z.string()),
  /** Featured work gets the full case-study layout and top billing. */
  featured: z.boolean(),
  /** Explicit display order. Lower sorts first. */
  order: z.number().int(),
  thumbnail: ThumbnailSchema,
  /* All three default, so existing entries need no migration. */
  gallery: z.array(GalleryItemSchema).default([]),
  caseStudy: CaseStudySchema.nullable().default(null),
  links: z.array(ExternalLinkSchema).default([]),
});

// ── The three project kinds ──────────────────────────────────────────────────

export const VideoProjectSchema = BaseProjectSchema.extend({
  type: z.literal("video"),
  media: z.object({
    provider: z.literal("youtube"),
    embedUrl: z.string().url(),
    format: z.enum(["widescreen", "portrait", "square"]),
  }),
});

export const GraphicProjectSchema = BaseProjectSchema.extend({
  type: z.literal("graphic"),
  media: z.object({
    fullUrl: z.string().url(),
  }),
});

export const SocialProjectSchema = BaseProjectSchema.extend({
  type: z.literal("social"),
  media: z.object({
    platform: z.enum(["LinkedIn", "Instagram", "Telegram", "TikTok", "YouTube"]),
    link: z.string().url(),
    stats: z.string().nullable().optional(),
  }),
});

export const ProjectSchema = z.discriminatedUnion("type", [
  VideoProjectSchema,
  GraphicProjectSchema,
  SocialProjectSchema,
]);

export type Project = z.infer<typeof ProjectSchema>;
export type VideoProject = z.infer<typeof VideoProjectSchema>;
export type GraphicProject = z.infer<typeof GraphicProjectSchema>;
export type SocialProject = z.infer<typeof SocialProjectSchema>;
export type ProjectType = Project["type"];

/** A project with its client resolved — what components actually receive. */
export type ResolvedProject = Project & { client: Client | null };

// ── Filters ──────────────────────────────────────────────────────────────────

export const FILTERS = ["all", "video", "graphic", "social"] as const;
export type Filter = (typeof FILTERS)[number];

export const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  video: "Video",
  graphic: "Design",
  social: "Social",
};
