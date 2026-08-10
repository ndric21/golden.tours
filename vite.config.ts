// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import csp from "vite-plugin-csp";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  plugins: [
    csp({
      // Development CSP – allows eval for Vite HMR
      policy: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://cdn.botpress.cloud", "https://files.bpcontent.cloud"],
        "style-src": ["'self'", "'unsafe-inline'", "https://cdn.botpress.cloud", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:", "https://cdn.botpress.cloud", "https://files.bpcontent.cloud"],
        "connect-src": ["'self'", "https://cdn.botpress.cloud", "https://chat.botpress.cloud", "https://files.bpcontent.cloud"],
        "frame-src": ["'self'", "https://cdn.botpress.cloud"],
      },
      dev: true,
      prod: false,
    }),
  ],
  tanstackStart: {
    server: { entry: "server" },
  },
});
