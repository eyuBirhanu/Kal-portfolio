// src/components/primitives/Image.tsx
import { useState } from "react";
import { cld, cldSrcSet, cldBlurUrl } from "../../lib/media";
import { cn } from "../../lib/cn";

/**
 * Every image in the site goes through here.
 *
 * Three fixes over the old <img src={thumbnailUrl}>:
 *  1. Cloudinary transforms — full-res PNGs were being served as 600px thumbs
 *  2. Intrinsic width/height, so the masonry grid stops jumping as images land
 *  3. A blurred 24px placeholder that cross-fades to the real image
 *
 * `fit` decides whether the frame crops the image or the image sits inside
 * the frame. Posters and campaign graphics arrive in a dozen different
 * ratios, and cropping them to one tile shape cuts the artwork — usually the
 * type at the top or bottom, which is the part worth seeing. With
 * `fit="contain"` the blurred placeholder stays behind the image instead of
 * fading out, so the leftover space reads as a soft backdrop drawn from the
 * artwork's own colours rather than as empty bars.
 */
export function Image({
  src,
  alt,
  width,
  height,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  targetWidth = 800,
  crop,
  fit = "cover",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sizes?: string;
  targetWidth?: number;
  crop?: "fill" | "limit";
  /** "cover" crops to the frame, "contain" shows the whole image inside it. */
  fit?: "cover" | "contain";
  className?: string;
  /** Skips lazy-loading for above-the-fold media. */
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const blur = cldBlurUrl(src);
  const contain = fit === "contain";

  return (
    <div
      className={cn("relative overflow-hidden bg-card", className)}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {blur && (!loaded || contain) && (
        <img
          src={blur}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full scale-110 object-cover blur-xl",
            // Behind a contained image it's scenery, not a placeholder, so it
            // sits back rather than competing with the artwork.
            contain && loaded && "opacity-60"
          )}
        />
      )}
      <img
        src={cld(src, { width: targetWidth, crop })}
        srcSet={cldSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width ?? undefined}
        height={height ?? undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "relative h-full w-full transition-opacity duration-500 ease-out",
          contain ? "object-contain" : "object-cover",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}