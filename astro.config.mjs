// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Custom domain served from the site root.
  site: "https://ampert.sk",

  base: "/",

  i18n: {
    defaultLocale: "sk",
    locales: ["sk", "en"],
    routing: {
      // Slovak (default) lives at the root; English is served under /en.
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "sk",
        locales: {
          sk: "sk",
          en: "en",
        },
      },
    }),
  ],
});
