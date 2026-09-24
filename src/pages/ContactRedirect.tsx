// src/pages/ContactRedirect.tsx
import { Navigate } from "react-router-dom";

/** Contact now lives on the home page. Old links keep working. */
export default function ContactRedirect() {
  return <Navigate to="/#contact" replace />;
}
