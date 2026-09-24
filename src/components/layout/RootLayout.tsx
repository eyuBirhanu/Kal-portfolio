// src/components/layout/RootLayout.tsx
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export default function RootLayout() {
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
        The old build only did window.scrollTo(0,0) on one page.
      */}
      <ScrollRestoration
        getKey={(location) => location.pathname + location.search}
      />
    </div>
  );
}
