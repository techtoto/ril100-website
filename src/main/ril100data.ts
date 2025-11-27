const RIL100_CSV_URL = "./ril100.csv";

export type CSVData = {
    [key: string]: string,
};

export type Ril100Data = {
    "RL100-Langname": string,
    "RL100-Code": string,
    "Typ-Kurz": string,
    "Betriebszustand": string,
};

export async function getRil100Data(): Promise<Ril100Data[]> {
    const csvText = await getRil100CSV();

    return parseFile(csvText) as Ril100Data[];
}

async function getRil100CSV() {
    try {
        const freshData = await fetchFreshRil100Data();

        requestIdleCallback(async () => {
            if(!window.caches) return

            const cache = await caches.open("ril100data");

            await cache.put(RIL100_CSV_URL, freshData);
        }, { timeout: 500 })

        return await freshData.clone().text();
    } catch(e) {
        console.warn("Failed to fetch fresh ril 100 data", e);

        const cache = await caches.open("ril100data");
        const cachedData = await cache.match(RIL100_CSV_URL);

        if(cachedData) {
            return await cachedData.text();
        } else {
            throw new Error("Unable to find cached ril 100 data");
        }
    }
}

async function fetchFreshRil100Data(): Promise<Response> {
    const response = await fetch(RIL100_CSV_URL, { cache: "no-cache" /* force browser to at least revalidate ril100 file */ });

    if(!response.ok) {
        throw new Error("Response not okay");
    }

    return response;
}

function parseFile(text: string): CSVData[] {
    const lines = text.trim().split("\n");

    const headers = parseLine(lines.shift() || "");

    if(!headers) {
        return [];
    }

    const otherLines = lines
        .filter(line => line.length !== 0)
        .map(parseLine);

    const objs = otherLines
        .map(values => {
            if(values.length !== headers.length) {
                throw new Error("Column count mismatch");
            }

            const object: CSVData = {};

            for(let i = 0; i < headers.length; i++) {
                object[headers[i]] = values[i];
            }

            return object;
        })

    return objs;
}

function parseLine(line: string): string[] {
    // use quick and dirty algorithm if possible
    if(!line.includes("\"")) {
        return line.split(",");
    }

    let inString = false;
    const result: string[] = [];
    let currentString = "";

    for(const char of line) {
        if(char === "\"") {
            inString = !inString;
        } else if(char === "," && !inString) {
            result.push(currentString);
            currentString = "";
        } else {
            currentString += char;
        }
    }

    if(inString) {
        throw new Error("Unterminated string");
    }

    result.push(currentString);

    return result;
}
