import { getAvatarUrl } from "./colors";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const logoCache = new Map();

const fetchLogoByTitle = async (title, size) => {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "pageimages",
    format: "json",
    pithumbsize: String(size),
    redirects: "1",
    origin: "*",
  });

  const response = await fetch(`${WIKI_API}?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const pages = data.query?.pages;
  if (!pages) return null;

  const pageId = Object.keys(pages)[0];
  if (pageId === "-1") return null;

  return pages[pageId]?.thumbnail?.source || null;
};

export const getPartyLogo = async (partyName, size = 220) => {
  if (!partyName) return getAvatarUrl("Party", size);
  if (partyName.toLowerCase().includes("rastriya swatantra party")) {
    // Requested branding: blue bell style placeholder for RSP
    return "https://ui-avatars.com/api/?name=%F0%9F%94%94&size=220&background=1d4ed8&color=ffffff&bold=true&format=svg";
  }
  const key = `${partyName}-${size}`;
  if (logoCache.has(key)) return logoCache.get(key);

  const candidates = [
    partyName,
    `${partyName} Nepal`,
    `${partyName} (Nepal)`,
  ];

  for (const title of candidates) {
    try {
      const logo = await fetchLogoByTitle(title, size);
      if (logo) {
        logoCache.set(key, logo);
        return logo;
      }
    } catch {
      // fall through to next candidate
    }
  }

  const fallback = getAvatarUrl(partyName, size);
  logoCache.set(key, fallback);
  return fallback;
};

