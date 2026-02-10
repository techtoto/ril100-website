import "../styles/global.css";
import "../styles/glossary.css";

import "../common";

const abbrContainer = document.getElementById("abbreviations")!;
const typesContainer = document.getElementById("type")!;

type DetailedEntry = { name: string, heading: string, bold?: boolean };
type Entry = string | DetailedEntry;

const firstLetters: Entry[] = [
    {
        name: "Hamburg",
        heading: "A"
    },
    "Berlin",
    "Dresden",
    "Essen",
    "Frankfurt",
    "Hannover",
    {
        name: "16,7-Hz-Anlagen",
        heading: "I",
        bold: false
    },
    "Köln",
    {
        name: "Halle",
        heading: "L"
    },
    "München",
    "Nürnberg",
    {
        name: "50-Hz-Anlagen",
        heading: "Q",
        bold: false
    },
    {
        name: "Karlsruhe",
        heading: "R"
    },
    "Saarbrücken",
    {
        name: "Stuttgart",
        heading: "T"
    },
    {
        name: "Erfurt",
        heading: "U"
    },
    {
        name: "Tankanlagen für Verbrennungsfahrzeuge",
        heading: "V"
    },
    {
        name: "Schwerin",
        heading: "W"
    },
    {
        name: "Ausland",
        heading: "X",
        bold: false
    },
    {
        name: "Streckenwechsel",
        heading: "Y",
        bold: false
    },
    {
        name: "Ausland",
        heading: "Z",
        bold: false
    }
]

/* unbekannte Typen (in der csv drin, aber nicht in den Quellen):
    Quellen:
    https://de.wikipedia.org/wiki/Betriebsstellenverzeichnis
    https://de.wikipedia.org/wiki/Liste_von_Abk%C3%BCrzungen_im_Eisenbahnwesen
    https://www-docs.b-tu.de/fg-eisenbahn/public/0-2BegriffeAbk.pdf

    Ats
    BZ (Betriebszentrale ist es nicht, aber irgendwelche Stellwerke)
    CGbf
    dUw (wohl irgendein Unterwerk)
    ES (evtl. Erdungsschalter, aber nicht sicher)
    fb-* (-GW)
    fBKA
    fGUw
    fUw
    GEGr
    GKs
    GSp
    Hst (Haltestelle?)
    Ks
    Kw
    (NE-) Tpg, Tpp
    Psw
    SaSt (evtl. auch Schaltstelle?)
    Sbk
    ST
    tGUw
*/
const types: Entry[] = [
    {
        name: "Abnehmeranlage",
        heading: "AA"
    },
    {
        name: "Abzweigstelle",
        heading: "Abzw"
    },
    {
        name: "Anschlussstelle",
        heading: "Anst"
    },
    {
        name: "Ausweichanschlussstelle",
        heading: "Awanst"
    },
    {
        name: "Bahnhof",
        heading: "Bf"
    },
    {
        name: "Bahnhofsteil",
        heading: "Bft"
    },
    {
        name: "Blockstelle",
        heading: "Bk"
    },
    {
        name: "Brechpunkt",
        heading: "Brchpk"
    },
    {
        name: "Bedienstandort",
        heading: "BSO"
    },
    {
        name: "Bushaltestelle",
        heading: "Bush"
    },
    {
        name: "Einsatzstelle Geschäftsbereich Cargo",
        heading: "CEst"
    },
    {
        name: "Deckungsstelle",
        heading: "Dkst"
    },
    {
        name: "Empfangsstelle",
        heading: "Emst"
    },
    {
        name: "Einsatzstelle für Zugpersonal",
        heading: "Est"
    },
    {
        name: "Fernwirkstelle",
        heading: "Fwst"
    },
    {
        name: "Grenzpunkt",
        heading: "Gp"
    },
    {
        name: "Gleichrichter-Unterwerk",
        heading: "Guw"
    },
    {
        name: "Haltepunkt",
        heading: "Hp"
    },
    {
        name: "Landesgrenze",
        heading: "LGr"
    },
    {
        name: "Laufweg",
        heading: "LW"
    },
    {
        name: "Museumsbahnhof",
        heading: "Museum"
    },
    {
        name: "Netzleitzentrale",
        heading: "NLZ"
    },
    {
        name: "Parkeisenbahn",
        heading: "Park"
    },
    {
        name: "Produktionsdurchführungsgrenze",
        heading: "PDGr"
    },
    {
        name: "Regionalbereichsgrenze",
        heading: "RBGr"
    },
    {
        name: "Selbsttätige Blockstelle",
        heading: "Sbk"
    },
    {
        name: "Schutzstrecke",
        heading: "Schstr"
    },
    {
        name: "Schiffslandestelle",
        heading: "Slst"
    },
    {
        name: "Schaltposten",
        heading: "Sp"
    },
    {
        name: "Sammelstelle",
        heading: "Sst"
    },
    {
        name: "Streckenwechsel",
        heading: "Strw"
    },
    {
        name: "Schaltwerk",
        heading: "Sw"
    },
    {
        name: "Tankstelle",
        heading: "Tank"
    },
    {
        name: "Tunnelbegegnungsverbot",
        heading: "Tbv"
    },
    {
        name: "Tarifpunkt",
        heading: "Tp"
    },
    {
        name: "Trafostation",
        heading: "TrSt"
    },
    {
        name: "Trennschalter",
        heading: "TS"
    },
    {
        name: "Technikstandort",
        heading: "TSO"
    },
    {
        name: "Umrichterwerk",
        heading: "Urw"
    },
    {
        name: "Unterwerk",
        heading: "Uw"
    },
    {
        name: "Überleitstelle",
        heading: "Üst"
    },
    {
        name: "Werk",
        heading: "Werk"
    },
    {
        name: "Zentralschaltstelle",
        heading: "Zes"
    },
    {
        name: "Nichtbundeseigene Eisenbahn",
        heading: "NE-*"
    },
    {
        name: "verpachtet",
        heading: "vp-*"
    }
]

function createBoldTextElement(text: string) {
    const textElement = document.createElement("span");
    textElement.className = "bold";
    textElement.textContent = text;
    return textElement;
}

function createWebsiteEntries(list: Entry[], container: HTMLElement, boldByDefault = false) {
    for (const item of list) {
        const isStringEntry = typeof item === "string";
        const normalizedItem = isStringEntry ? { name: item, heading: item[0] } : item;

        const entry = document.createElement("div");
        entry.className = "abbreviation-entry";
    
        const headingElement = document.createElement("span");
        headingElement.className = "capitalLetter";

        const heading = normalizedItem.heading;
        headingElement.textContent = heading;
    
        const nameElement = document.createElement("p");
        const name = normalizedItem.name;

        if (normalizedItem.bold ?? boldByDefault) {
            const boldCharIndex = name.toLowerCase().indexOf(heading.toLowerCase());

            if (boldCharIndex !== 0) {
                nameElement.appendChild(document.createTextNode(name.substring(0, boldCharIndex)));
            }
            nameElement.appendChild(createBoldTextElement(name[boldCharIndex] ?? ""));
            nameElement.appendChild(document.createTextNode(name.substring(boldCharIndex + 1)));
        } else {
            nameElement.appendChild(document.createTextNode(name));
        }
    
        entry.appendChild(headingElement);
        entry.appendChild(nameElement);

        container.appendChild(entry);
    }
}

createWebsiteEntries(firstLetters, abbrContainer, true);
createWebsiteEntries(types, typesContainer, false);
