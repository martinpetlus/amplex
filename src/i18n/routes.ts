import type { Lang } from "./ui";

/**
 * Localized slugs for each page, keyed by a stable route key.
 * Single source of truth for building locale-aware links.
 */
export const routes = {
  home: { sk: "", en: "" },
  services: { sk: "sluzby", en: "services" },
  about: { sk: "o-nas", en: "about" },
  contact: { sk: "kontakt", en: "contact" },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;
