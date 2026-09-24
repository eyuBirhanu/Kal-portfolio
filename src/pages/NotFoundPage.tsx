// src/pages/NotFoundPage.tsx
import { ButtonLink } from "../components/primitives/Button";
import { Meta } from "../components/primitives/Meta";
import { Seo } from "../lib/seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Not found" path="/404" />
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 text-center">
      <Meta size="lg">Error 404</Meta>
      <h1 className="text-display-lg">
        This page doesn&rsquo;t <em className="accent-italic">exist</em>.
      </h1>
      <p className="max-w-prose text-fg-muted">
        The link may be out of date, or the project may have been renamed.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <ButtonLink to="/" variant="solid">
          Back home
        </ButtonLink>
        <ButtonLink to="/works">See the work</ButtonLink>
      </div>
    </section>
    </>
  );
}
