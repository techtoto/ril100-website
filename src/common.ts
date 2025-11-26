if("serviceWorker" in navigator && navigator.onLine && !["127.0.0.1", "[::1]", "localhost"].includes(window.location.hostname)) {
    try {
        navigator.serviceWorker.register("./sw.js");
    } catch(e) {}
}
