// src/lib/links.ts

/**
 * True for an absolute http(s) URL, false for a site-relative path.
 *
 * Exists because the `download` attribute is same-origin only — browsers
 * ignore it on a cross-origin href and navigate instead. Anything pointing at
 * Google Drive, Dropbox or a CDN therefore has to open in a new tab rather
 * than pretend to download, and the CV lives in whichever of those two worlds
 * `profile.resumeUrl` currently points at.
 */
export const isRemoteHref = (href: string) => /^https?:\/\//i.test(href);