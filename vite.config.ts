import { fileURLToPath } from "url"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL("./index.html", import.meta.url)),
                glossary: fileURLToPath(new URL("./glossary.html", import.meta.url)),
            },
        },
        manifest: "serviceworker-manifest.json",
    },
    base: "./",
});
