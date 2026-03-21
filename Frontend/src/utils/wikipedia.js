// ----- Wikipedia Image Service -----
// Fetches candidate photos from Wikipedia with caching and fallback support.
// Tries English Wikipedia first, then Nepali Wikipedia, then falls back to placeholder avatar.
// Uses MediaWiki Action API to prevent 404 errors in console for missing pages.

import { getAvatarUrl } from "./colors";

// ----- Constants -----

const WIKIPEDIA_API = {
  EN: "https://en.wikipedia.org/w/api.php",
  NE: "https://ne.wikipedia.org/w/api.php",
};

// In-memory cache to avoid redundant API calls during session
const imageCache = new Map();

// ----- Helper Functions -----

/**
 * Attempts to fetch an image from a specific Wikipedia language edition using the Action API.
 * This API returns 200 OK even if the page is missing, preventing 404 console errors.
 * 
 * @param {string} baseUrl - Wikipedia Action API URL
 * @param {string} title - Page title to search
 * @param {number} size - Thumbnail size
 * @returns {Promise<string|null>} - Thumbnail URL or null if not found
 */
const fetchFromWikipedia = async (baseUrl, title, size) => {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: title,
      prop: "pageimages",
      format: "json",
      pithumbsize: size,
      origin: "*", // Required for CORS
      redirects: "1" // Automatically follow redirects
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) return null;

    // The API returns an object with page IDs as keys. "-1" means missing.
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;

    return pages[pageId].thumbnail?.source || null;
  } catch {
    // Silently fail on network errors to avoid disrupting the UI
    return null;
  }
};

// ----- Exported Functions -----

/**
 * Fetches candidate image from Wikipedia Action API.
 * Attempts English Wikipedia first, falls back to Nepali Wikipedia,
 * and finally returns a placeholder avatar if no image is found.
 *
 * @param {string} name - Candidate name to search
 * @param {number} size - Desired fallback avatar size (default: 200)
 * @returns {Promise<string>} - Image URL (Wikipedia photo or fallback avatar)
 */
const getWikipediaImage = async (name, size = 200) => {
  // Return fallback immediately if no name provided
  if (!name) return getAvatarUrl(name, size);

  // Try English Wikipedia first
  const enImage = await fetchFromWikipedia(WIKIPEDIA_API.EN, name, size);
  if (enImage) return enImage;

  // Try Nepali Wikipedia as fallback
  const neImage = await fetchFromWikipedia(WIKIPEDIA_API.NE, name, size);
  if (neImage) return neImage;

  // No Wikipedia image found, return placeholder avatar
  return getAvatarUrl(name, size);
};

/**
 * Cached wrapper for getWikipediaImage.
 * Stores results in memory to avoid repeated API calls for the same candidate.
 *
 * @param {string} name - Candidate name to search
 * @param {number} size - Desired fallback avatar size (default: 200)
 * @returns {Promise<string>} - Cached image URL
 */
export const getCachedWikipediaImage = async (name, size = 200) => {
  const cacheKey = `${name}-${size}`;

  // Return cached result if available
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  // Fetch, cache, and return
  const imageUrl = await getWikipediaImage(name, size);
  imageCache.set(cacheKey, imageUrl);
  return imageUrl;
};
