// vite.config.ts
import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
	test: { environment: "jsdom" },
	plugins: [
		AutoImport({
			imports: ["vitest"],
			dts: true, // generate TypeScript declaration
		}),
	],
});
