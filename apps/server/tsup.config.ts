import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  outDir: "dist",
  tsconfig: "./tsconfig.json",
  esbuildOptions(options: any) {
    options.alias = {
      "@": path.resolve(__dirname, "./src"),
      "@user": path.resolve(__dirname, "./src/modules/user"),
      "@question": path.resolve(__dirname, "./src/modules/question"),
      "@quiz": path.resolve(__dirname, "./src/modules/quiz"),
    };
  },
});
