// @ts-check

const CACHE_ID = "swcache";
const CACHE_VERSION = String(4);

const CACHE_NAME = CACHE_ID + "-" + CACHE_VERSION;

const BASE_URL = "./";

const additionalFilesToCache = [
    "",
    "manifest.json",
    "favicon.svg",
    "favicon-black.svg",
    "favicon-512x512.png",
];

async function deleteOldCaches() {
    for (const cacheName of await caches.keys()) {
        if (cacheName.startsWith(CACHE_ID) && cacheName !== CACHE_NAME) {
            await caches.delete(cacheName);
        }
    }
}

/** @param {string[]} files */
async function addToCache(files) {
    const cache = await caches.open(CACHE_NAME);

    await cache.addAll(files.map(url => new Request(url, { cache: "no-cache" })));
}

async function buildCache() {
    const fileResponse = await fetch("./serviceworker-manifest.json", { cache: "no-cache" });
    const fileJson = await fileResponse.json();

    /** @type {string[]} */
    const staticFiles = Object.values(fileJson)
        .flatMap(file => (
            [
                file.file,
                ...(file.css || []),
                file.src?.endsWith(".html") ? file.src : null,
            ]
        ))
        .concat(additionalFilesToCache)
        .filter(file => file !== null && file !== undefined);

    const filesToCache = staticFiles
        .filter((file, index) => staticFiles.indexOf(file) === index)
        .map(relativeFile => BASE_URL + relativeFile);

    await addToCache(filesToCache);
}

self.addEventListener("install", /** @param {ExtendableEvent} event */ (event) => {
    event.waitUntil((async () => {
        await buildCache();
    })());
});

self.addEventListener("activate", /** @param {ExtendableEvent} event */ (event) => {
    event.waitUntil((async () => {
        await deleteOldCaches();
    })());
});

self.addEventListener("fetch", /** @param {FetchEvent} event */ (event) => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return await fetch(event.request);
    })());
});
