// src/routes.tsx
//
// One route table. The app renders from it and the prerenderer walks it at
// build time, so a route can never exist in one place and not the other.

import type { RouteRecord } from "vite-react-ssg";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import WorksPage from "./pages/WorksPage";
import ProjectPage from "./pages/ProjectPage";
import ContactRedirect from "./pages/ContactRedirect";
import NotFoundPage from "./pages/NotFoundPage";
import { projects } from "./lib/content";

/**
 * The upload tool exists only in development. `import.meta.env.DEV` is a
 * compile-time constant, so in a production build this array is empty and the
 * module — including the Cloudinary credentials it reads — is dropped by
 * tree-shaking. There is nothing to hide, because nothing is shipped.
 */
const devRoutes: RouteRecord[] = import.meta.env.DEV
  ? [
      {
        path: "upload",
        lazy: async () => ({ Component: (await import("./dev/UploadTool")).default }),
      },
    ]
  : [];

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />, entry: "src/pages/HomePage.tsx" },
      { path: "works", element: <WorksPage />, entry: "src/pages/WorksPage.tsx" },
      {
        path: "works/:slug",
        element: <ProjectPage />,
        entry: "src/pages/ProjectPage.tsx",
        // Every project becomes a real HTML file with its own title,
        // description and share image.
        getStaticPaths: () => projects.map((p) => `/works/${p.slug}`),
      },
      // The CV and anything already linking to /contact keeps working.
      { path: "contact", element: <ContactRedirect /> },
      ...devRoutes,
      // Prerendered so hosts have a real 404.html to serve.
      { path: "404", element: <NotFoundPage />, entry: "src/pages/NotFoundPage.tsx" },
      { path: "*", element: <NotFoundPage />, entry: "src/pages/NotFoundPage.tsx" },
    ],
  },
];
