// src/components/project/ProjectGallery.tsx
import type { GalleryItem } from "../../types";
import { Image } from "../primitives/Image";
import { Meta } from "../primitives/Meta";
import { Reveal } from "../primitives/Reveal";

/**
 * Stacked large rather than a thumbnail grid that opens a modal. On a case
 * study you want people scrolling *through* the work, not clicking into it —
 * every extra click is a place to drop off.
 */
export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <Meta>
        Gallery — {String(items.length).padStart(2, "0")}{" "}
        {items.length === 1 ? "image" : "images"}
      </Meta>

      <div className="flex flex-col gap-10">
        {items.map((item, i) => (
          <Reveal key={item.url} delay={Math.min(i, 3) * 60}>
            <figure className="flex flex-col gap-3">
              <Image
                src={item.url}
                alt={item.alt}
                width={item.width}
                height={item.height}
                targetWidth={1600}
                sizes="(min-width: 1280px) 72rem, 100vw"
                className="rounded-card border border-line"
              />
              {item.caption && (
                <figcaption className="text-body-sm text-fg-subtle">{item.caption}</figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
