// src/pages/HomePage.tsx
import { Hero } from "../components/home/Hero";
import { KeywordMarquee } from "../components/home/KeywordMarquee";
import { ClientMarquee } from "../components/home/ClientMarquee";
import { WorkSection } from "../components/work/WorkSection";
import { Timeline } from "../components/home/Timeline";
import { Toolbox } from "../components/home/Toolbox";
import { ContactSection } from "../components/home/ContactSection";
import { Seo, personJsonLd } from "../lib/seo";
import profile from "../data/profile.json";

export default function HomePage() {
  return (
    <>
      {/* Prerendered into this route's static HTML at build time. */}
      <Seo path="/" jsonLd={personJsonLd(profile)} />

      <Hero />
      <KeywordMarquee />
      <ClientMarquee />

      <WorkSection />
      <Timeline />
      <Toolbox />
      <ContactSection />
    </>
  );
}
