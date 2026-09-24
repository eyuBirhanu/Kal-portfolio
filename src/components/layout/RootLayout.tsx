// src/components/layout/RootLayout.tsx
import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

/**
 * Scrolls to #contact / #about / #work when the location carries a hash.
 *
 * Needed because ScrollRestoration's key deliberately ignores the hash, and
 * because React Router does not scroll to an anchor on its own the way a
 * plain <a href="#id"> does. Without this, clicking Contact from the home
 * page produced a navigation that changed the URL and moved nothing.
 *
 * No `behavior` is passed on purpose: index.css sets scroll-behavior: smooth
 * on html and flips it to auto under prefers-reduced-motion, so the CSS stays
 * the single place that decides. The rAF lets the incoming route paint first,
 * so the target element exists and is measured before we scroll to it.
 */
function useHashScroll() {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));

    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      // scroll-margin-top on the section (scroll-mt-24) and scroll-padding-top
      // on html both apply here, so the fixed header doesn't cover the
      // heading we just scrolled to.
      el?.scrollIntoView({ block: "start" });
    });

    return () => cancelAnimationFrame(frame);
    // `key` changes on every navigation, so clicking Contact a second time
    // from further down the page scrolls again instead of going inert.
  }, [hash, key]);
}

export default function RootLayout() {
  useHashScroll();

  return (
    <div id="top" className="flex min-h-screen flex-col bg-bg">
      <Nav />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/*
        Restores scroll position on back/forward, and jumps to top on a new
        route — except when there's a hash, so /#contact still lands correctly.

        The hash is part of the key. It used to be pathname + search only,
        which meant "/" and "/#contact" shared one entry: navigating to the
        anchor found a saved position for "/" and restored that instead, so
        the Contact button changed the URL and left the page where it was.
      */}
      <ScrollRestoration
        getKey={(location) =>
          location.pathname + location.search + location.hash
        }
      />
    </div>
  );
}