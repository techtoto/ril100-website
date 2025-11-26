import { getRil100Data, type Ril100Data } from "./ril100data";
import { getSearchQuery } from "./search";

let ril100Data: ExtendedRil100Data[] = [];

doRil100DataFetch().then(() => {
    refreshList(getSearchQuery());
})

const DEFAULT_ENTRY_LIMIT = 100;

const container = document.getElementById("data")!;
const footer = document.getElementById("footer-not-all-entries")!;
const showAllButton = document.getElementById("showAllButton")!;

type ExtendedRil100Data = Ril100Data & {
    lowercaseName: string,
    isMainStation: boolean,
    isInactive: boolean,
}

export function refreshList(query = "", showAll = false) {
    query = query.trim();

    const lowercaseQuery = query.toLowerCase();
    const uppercaseQuery = query.toUpperCase();
    
    const filteredData = ril100Data!.filter((item) => {
        const name = item.lowercaseName;
        const code = item["RL100-Code"];

        return code.includes(uppercaseQuery) || name.includes(lowercaseQuery);
    });

    filteredData.sort((a, b) => {
        const aName = a.lowercaseName;
        const bName = b.lowercaseName;

        const aCode = a["RL100-Code"];
        const bCode = b["RL100-Code"];

        const aType = a["Typ-Kurz"];
        const bType = b["Typ-Kurz"];

        if (aName === lowercaseQuery && bName !== lowercaseQuery) {
            return -1;
        } else if (aName !== lowercaseQuery && bName === lowercaseQuery) {
            return 1;
        }

        if (aCode === uppercaseQuery && bCode !== uppercaseQuery) {
            return -1;
        } else if (aCode !== uppercaseQuery && bCode === uppercaseQuery) {
            return 1;
        }

        // the algorithm used to only compare "ehemals" and "a.B." directly, but ig it is also okay to assume they are the same
        if (!a.isInactive && b.isInactive) {
            return -1;
        } else if (a.isInactive && !b.isInactive) {
            return 1;
        }

        if (aType === "Bf" && bType !== "Bf") {
            return -1;
        } else if (aType !== "Bf" && bType === "Bf") {
            return 1;
        }

        if (aType === "Hp" && bType !== "Hp") {
            return -1;
        } else if (aType !== "Hp" && bType === "Hp") {
            return 1;
        }

        if (a.isMainStation && !b.isMainStation) {
            return -1;
        } else if (!a.isMainStation && b.isMainStation) {
            return 1;
        }


        if (aName.startsWith(lowercaseQuery) && !bName.startsWith(lowercaseQuery)) {
            return -1;
        } else if (!aName.startsWith(lowercaseQuery) && bName.startsWith(lowercaseQuery)) {
            return 1;
        }

        if (aCode.startsWith(uppercaseQuery) && !bCode.startsWith(uppercaseQuery)) {
            return -1;
        } else if (!aCode.startsWith(uppercaseQuery) && bCode.startsWith(uppercaseQuery)) {
            return 1;
        }

        return 0;
    });

    const items = showAll ? filteredData : filteredData.slice(0, DEFAULT_ENTRY_LIMIT);

    updateListInDom(items, filteredData.length);
}

function updateListInDom(items: ExtendedRil100Data[], realLength: number) {
    container.innerHTML = "";

    if (realLength > items.length) {
        showAllButton.textContent = `Alle ${realLength} Einträge anzeigen`;
        footer.classList.remove("hidden");
    } else {
        footer.classList.add("hidden");
    }

    items.forEach((item) => {
        const entryRow = document.createElement("tr");
        entryRow.className = "entry";

        if (item.isInactive) {
            entryRow.className += " inactive";
        }

        const rl100CodeContainer = document.createElement("td");
        rl100CodeContainer.className = "rl100Code";

        const rl100CodeLink = document.createElement("a");
        rl100CodeLink.textContent = item["RL100-Code"];
        rl100CodeLink.href = `https://trassenfinder.de/apn/${encodeURIComponent(item["RL100-Code"].replaceAll(" ", "_"))}`;
        rl100CodeLink.target = "_blank";

        rl100CodeContainer.appendChild(rl100CodeLink);

        const rl100LongName = document.createElement("td");
        rl100LongName.className = "rl100LongName";
        rl100LongName.textContent = item["RL100-Langname"];

        const rl100TypeLong = document.createElement("td");
        rl100TypeLong.className = "rl100TypeLong";
        rl100TypeLong.textContent = item["Typ-Kurz"];

        entryRow.appendChild(rl100CodeContainer);
        entryRow.appendChild(rl100LongName);
        entryRow.appendChild(rl100TypeLong);
        container.appendChild(entryRow);
    });
}

async function doRil100DataFetch() {
    const data = await getRil100Data();

    ril100Data = preprocessRil100Data(data);
}

function preprocessRil100Data(data: Ril100Data[]): ExtendedRil100Data[] {
    return data.map(item => {
        const lowercaseName = item["RL100-Langname"].toLowerCase();

        return {
            ...item,
            lowercaseName,
            isMainStation: lowercaseName.includes("hbf"),
            isInactive: item["Betriebszustand"] === "a.B." || item["Betriebszustand"] === "ehemals",
        }
    });
}

showAllButton.addEventListener("click", () => {
    const query = getSearchQuery();
    refreshList(query, true);
})
