/**
 * @typedef {Object} Video
 * @property {string} id
 * @property {string} title
 * @property {string} link
 * @property {string} thumbnail
 * @property {string} duration
 * @property {string} source
 * @property {string} channel
 * @property {string} snippet
 * @property {string} date
 * @property {string} platform
 */

/**
 * Infers the hosting platform from a video link.
 * @param {string} link
 * @returns {string}
 */
function detectPlatform(link = "") {
  const l = link.toLowerCase();
  if (l.includes("youtube.com") || l.includes("youtu.be")) return "youtube";
  if (l.includes("vimeo.com")) return "vimeo";
  if (l.includes("dailymotion.com") || l.includes("dai.ly")) return "dailymotion";
  if (l.includes("tiktok.com")) return "tiktok";
  if (l.includes("facebook.com") || l.includes("fb.watch")) return "facebook";
  return "web";
}

/**
 * Cleans Google's displayed source ("www.site.com › path › ...") to the host.
 * @param {string} value
 * @returns {string}
 */
function cleanSource(value = "") {
  if (!value) return "";
  return value
    .split("›")[0]
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
}

/**
 * SerpApi thumbnails may be a string or an object — normalize to a URL.
 * @param {unknown} thumbnail
 * @returns {string}
 */
function pickThumbnail(thumbnail) {
  if (typeof thumbnail === "string") return thumbnail;
  if (thumbnail && typeof thumbnail === "object") {
    return thumbnail.static || thumbnail.rich || thumbnail.serpapi_link || "";
  }
  return "";
}

/**
 * Maps a single SerpApi video result to a stable shape.
 * @param {Record<string, any>} raw
 * @param {number} index
 * @returns {Video}
 */
function normalizeVideo(raw, index) {
  const link = raw.link || raw.url || "";
  return {
    id: link || `result-${raw.position ?? index}`,
    title: raw.title || "Sin título",
    link,
    thumbnail: pickThumbnail(raw.thumbnail),
    duration: raw.duration || "",
    source: cleanSource(raw.source || raw.displayed_link),
    channel: raw.channel || raw.author || raw.publisher || "",
    snippet: raw.snippet || raw.description || "",
    date: raw.date || raw.published_date || "",
    platform: detectPlatform(link),
  };
}

/**
 * Normalizes a full SerpApi response into the API contract.
 * @param {Record<string, any>} response
 * @param {{ query: string, page: number }} meta
 * @returns {{ query: string, page: number, hasMore: boolean, results: Video[] }}
 */
function normalizeResponse(response, { query, page }) {
  const raw = response.video_results || response.inline_videos || [];
  const results = raw.map(normalizeVideo);
  const hasMore = Boolean(response.serpapi_pagination && response.serpapi_pagination.next) && results.length > 0;
  return { query, page, hasMore, results };
}

module.exports = { normalizeResponse, normalizeVideo, detectPlatform };
