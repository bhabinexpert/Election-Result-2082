// ----- Wikipedia Image Service -----
// Fetches candidate photos from Wikipedia with caching and fallback support.
// Tries English Wikipedia first, then Nepali Wikipedia, then falls back to placeholder avatar.

import { getAvatarUrl } from "./colors";

// ----- Constants -----

const WIKIPEDIA_API = {
  EN: "https://en.wikipedia.org/api/rest_v1/page/summary",
  NE: "https://ne.wikipedia.org/api/rest_v1/page/summary",
};

const API_USER_AGENT = "ElectionResult2082/1.0";

// In-memory cache to avoid redundant API calls during session
const imageCache = new Map();

// ----- Helper Functions -----

/**
 * Attempts to fetch an image from a specific Wikipedia language edition.
 * @param {string} url - Full Wikipedia API URL
 * @returns {Promise<string|null>} - Thumbnail URL or null if not found
 */
const fetchFromWikipedia = async (url) => {
  try {
    const response = await fetch(url, {
      headers: { "Api-User-Agent": API_USER_AGENT },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
};

// ----- Exported Functions -----

/**
 * Fetches candidate image from Wikipedia REST API.
 * Attempts English Wikipedia first, falls back to Nepali Wikipedia,
 * and finally returns a placeholder avatar if no image is found.
 *
 * @param {string} name - Candidate name to search
 * @param {number} size - Desired fallback avatar size (default: 200)
 * @returns {Promise<string>} - Image URL (Wikipedia photo or fallback avatar)
 */
export const getWikipediaImage = async (name, size = 200) => {
  // Return fallback immediately if no name provided
  if (!name) return getAvatarUrl(name, size);

  const encodedName = encodeURIComponent(name.trim());

  // Try English Wikipedia first
  const enImage = await fetchFromWikipedia(`${WIKIPEDIA_API.EN}/${encodedName}`);
  if (enImage) return enImage;

  // Try Nepali Wikipedia as fallback
  const neImage = await fetchFromWikipedia(`${WIKIPEDIA_API.NE}/${encodedName}`);
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
