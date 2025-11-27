import { refreshList } from "./list";

const searchBar = document.getElementById("search")! as HTMLInputElement;

export function getSearchQuery() {
    return searchBar.value;
}

searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    const url = new URL(window.location.href);

    refreshList();
    
    if (query === "") {
        url.hash = "";
    } else {
        url.hash = `#q=${encodeURIComponent(query)}`;
    }

    history.replaceState({}, "", url);
});

function readSearchQueryFromURL() {
    const params = new URLSearchParams(document.location.hash.substring(1));
    const query = params.get("q") || "";
    
    searchBar.value = query;

    refreshList();
}

readSearchQueryFromURL();
window.addEventListener("hashchange", readSearchQueryFromURL);
