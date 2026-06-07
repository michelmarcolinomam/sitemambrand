import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // Our SSR error wrapper lives in src/server.ts
      server: { entry: "server" },
    }),
    // Nitro builds the server output. On Vercel it auto-detects the
    // platform and emits .vercel/output (Vercel Functions). Locally it
    // falls back to a Node server build.
    nitro(),
    viteReact(),
  ],
});
