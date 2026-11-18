// VEON demo base: technical setup only. Visual design comes from design/concept.md of each client.
// CSS is inlined so that relative asset paths (fonts/, img/) work when the demo is published in a sub-folder.
import { defineConfig } from "astro/config";

export default defineConfig({
  build: { inlineStylesheets: "always" },
  compressHTML: true,
  devToolbar: { enabled: false },
});
