// src/pages/ProjectPage.tsx
//
// The modal is the primary way people look at work. This page exists so that
// every project has a real URL with its own title, description and share
// image baked into static HTML — which is what link previews and search
// engines read, and the reason prerendering is in this project at all.
//
// So it is built for that job and no more. The previous version was a
// case-study chassis: a two-column grid with a sticky metadata slate down the
// right. Twelve of fourteen projects have no case study, no gallery, no role,
// no tools and no links, so that layout rendered a pinned sidebar next to a
// single sentence, with a column of dead space under it.
//
// This is a centred plate instead. Work first, one line of context under it,
// and a way onward. Everything optional renders only when it exists, so the
// page gets richer as the data does rather than announcing what is missing.

import { Link, useParams } from "react-router-dom";
import {
  getProjectBySlug,
  getProjectNeighbours,
  getRelatedProjects,
} from "../lib/content";
import { FILTER_LABELS } from "../types";
import { ProjectMedia } from "../components/project/ProjectMedia";
import { ProjectMeta } from "../components/project/ProjectMeta";
import { ProjectGallery } from "../components/project/ProjectGallery";
import { CaseStudy } from "../components/project/CaseStudy";
import { ProjectNav } from "../components/project/ProjectNav";
import { RelatedWork } from "../components/project/RelatedWork";
import { Meta } from "../components/primitives/Meta";
import { Pill } from "../components/primitives/Pill";
import { ButtonExternal } from "../components/primitives/Button";
import NotFoundPage from "./NotFoundPage";
import { Seo, creativeWorkJsonLd, ogImage } from "../lib/seo";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <NotFoundPage />;

  const { prev, next } = getProjectNeighbours(slug);
  const related = getRelatedProjects(slug);
  const sharesClient =
    related.length > 0 && related[0].clientId === project.clientId && !!project.client;

  return (
    <article className="px-6 pb-section-lg pt-28">
      <Seo
        title={project.title}
        description={
          project.summary ||
          `${project.title} — ${project.client?.name ?? "project"}, ${project.year}.`
        }
        // Shared helper rather than an inline cld() call, so the forced JPEG
        // and the 1200x630 box can never drift from the width/height hints
        // the meta tags advertise.
        image={ogImage(project.thumbnail.url)}
        imageAlt={`${project.title}${project.client ? ` for ${project.client.name}` : ""}`}
        path={`/works/${project.slug}`}
        type="article"
        jsonLd={creativeWorkJsonLd(project)}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <Link
          to="/works"
          className="group inline-flex w-fit items-center gap-2 text-fg-subtle transition-colors hover:text-accent-ink"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          <Meta>All work</Meta>
        </Link>

        {/* Title block sits above the work, centred, like a plate caption
            moved to the top. Client, year and kind are the whole context most
            of these pieces need. */}
        <header className="flex flex-col items-center gap-4 text-center">
          <Meta size="lg" tone="accent">
            {project.client && (
              <>
                <Link
                  to={`/works?q=${encodeURIComponent(project.client.name)}`}
                  className="underline-offset-4 hover:underline"
                >
                  {project.client.name}
                </Link>
                {" · "}
              </>
            )}
            {project.year} · {FILTER_LABELS[project.type]}
          </Meta>

          <h1 className="text-display-lg">{project.title}</h1>

          {project.subtitle && (
            <p className="max-w-2xl font-display text-display-sm font-bold text-fg-subtle">
              {project.subtitle}
            </p>
          )}
        </header>

        <ProjectMedia project={project} />

        {project.summary && (
          <p className="mx-auto max-w-prose text-center text-body-lg text-fg-muted">
            {project.summary}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {project.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        )}

        {/* Credits. Renders nothing at all unless there is something beyond
            the client and year already shown above. */}
        <ProjectMeta project={project} />

        {/* Case study, when there is one. Single column at reading width —
            the sticky sidebar it used to sit beside is gone. */}
        {project.caseStudy && (
          <div className="mx-auto w-full max-w-prose">
            <CaseStudy data={project.caseStudy} />
          </div>
        )}

        {(project.links.length > 0 || project.type === "social") && (
          <div className="flex flex-wrap justify-center gap-3">
            {project.links.map((l) => (
              <ButtonExternal key={l.url} href={l.url} size="sm">
                {l.label}
              </ButtonExternal>
            ))}
            {project.type === "social" && (
              <ButtonExternal href={project.media.link} variant="accent" size="sm">
                View on {project.media.platform}
              </ButtonExternal>
            )}
          </div>
        )}

        <ProjectGallery items={project.gallery} />

        <RelatedWork
          projects={related}
          clientName={sharesClient ? project.client!.name : undefined}
        />

        <ProjectNav prev={prev} next={next} />
      </div>
    </article>
  );
}