// src/components/home/ClientMarquee.tsx
import { marqueeClients } from "../../lib/content";
import { Meta } from "../primitives/Meta";

/**
 * Only clients with a real logo appear here — `showInMarquee` is false for the
 * rest. The old build scrolled four placehold.co placeholders alongside real
 * marks, and advertised three clients that had no work behind them at all.
 *
 * Logos are rendered with a brightness/contrast filter rather than being
 * pre-made white, so one asset works on both the dark and the cream ground.
 */
export function ClientMarquee() {
  if (marqueeClients.length === 0) return null;

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marqueeClients.map((c) => (
        <div key={c.id} className="mx-10 flex w-28 items-center justify-center sm:mx-14">
          <img
            src={c.logoUrl!}
            alt={hidden ? "" : `${c.name} logo`}
            loading="lazy"
            decoding="async"
            className="h-8 w-auto max-w-full object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="border-b border-line py-14" aria-label="Clients">
      <div className="mb-8 flex justify-center">
        <Meta>Trusted by</Meta>
      </div>
      <div className="edge-fade pause-on-hover relative flex overflow-hidden">
        <div className="flex animate-marquee-slow">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
