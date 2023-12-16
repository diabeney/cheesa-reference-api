import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["cjs"],
  splitting: false,
  target: "esnext",
  minify: true,
});
