// src/components/home/Toolbox.tsx
//
// Icons are local SVGs, in full brand colour at rest.
//
// The previous version fetched two images per tile from cdn.simpleicons.org —
// fourteen third-party requests — and tinted the resting one grey so colour
// only appeared on hover, which meant no colour at all on touch. It also
// didn't work: Simple Icons carries no Adobe, Canva or CapCut mark, so six of
// seven requests 404'd into a grey letter.
//
// Colour is now carried by the icon alone. Tile chrome stays in the site
// palette, and the brand hue appears again only on the hover edge, so seven
// saturated marks sit inside the design instead of fighting it.
//
// Two groups side by side, equal tiles within each. The flat treatment is
// deliberate — these are tools, not projects, and ranking them by tile size
// would give the section more weight than it deserves against the work.

import profile from "../../data/profile.json";
import { Meta } from "../primitives/Meta";
import { Reveal } from "../primitives/Reveal";
import { SectionHeader } from "../primitives/SectionHeader";
import { ToolIcon } from "../primitives/ToolIcon";

type Tool = {
  name: string;
  slug: string;
  group: string;
  note?: string;
  /** Brand hex. Used for the icon fallback and the hover edge. */
  color: string;
  mono?: string;
  /** Present in the data but unused by this layout. */
  label?: string;
  featured?: boolean;
  dimOnLight?: boolean;
};

const GROUPS = [
  { id: "video", label: "For the cut", unit: "tools" },
  { id: "design", label: "For everything else", unit: "tools" },
] as const;

export function Toolbox() {
  const tools = profile.tools as Tool[];

  return (
    <section className="border-t border-line px-6 py-section-lg">
      <div className="mx-auto flex max-w-shell flex-col gap-16">
        <SectionHeader
          index="04"
          label="Toolbox"
          before="The tools I reach for"
          emphasis="daily."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {GROUPS.map((group) => {
            const items = tools.filter((t) => t.group === group.id);
            if (items.length === 0) return null;

            return (
              <div key={group.id} className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between border-b border-line pb-4">
                  <h3 className="text-display-xs">{group.label}</h3>
                  <Meta>
                    {String(items.length).padStart(2, "0")} {group.unit}
                  </Meta>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {items.map((tool, i) => (
                    <Reveal key={tool.slug} delay={Math.min(i, 4) * 50}>
                      <ToolTile tool={tool} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ToolTile({ tool }: { tool: Tool }) {
  return (
    <div
      className="group flex h-full flex-col gap-3 rounded-card border border-line bg-card p-4 transition-colors duration-300 hover:border-(--tool-edge)"
      style={
        {
          "--tool-edge": `color-mix(in srgb, ${tool.color} 55%, transparent)`,
        } as React.CSSProperties
      }
    >
      <ToolIcon
        slug={tool.slug}
        name={tool.name}
        color={tool.color}
        mono={tool.mono}
        dimOnLight={tool.dimOnLight}
      />

      <div className="flex flex-col gap-1">
        <span className="font-display text-body-sm font-bold text-fg">{tool.name}</span>
        {tool.note && (
          <span className="text-meta leading-relaxed text-fg-subtle">{tool.note}</span>
        )}
      </div>
    </div>
  );
}