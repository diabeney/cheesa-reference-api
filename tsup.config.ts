import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["esm"],
  splitting: false,
  target: "esnext",
  minifySyntax: true,
  minifyWhitespace: true,
});
