// src/main.tsx
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

// Hydrates in the browser, and is the entry the prerenderer uses to render each
// route to static HTML at build time. Same code path, no second entry file.
export const createRoot = ViteReactSSG({ routes });
