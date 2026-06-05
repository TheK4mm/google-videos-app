const PLATFORM_LABELS = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  dailymotion: "Dailymotion",
  tiktok: "TikTok",
  facebook: "Facebook",
  web: "Web",
};

/**
 * Human-friendly label for a platform key.
 * @param {string} platform
 * @returns {string}
 */
export function platformLabel(platform) {
  return PLATFORM_LABELS[platform] || "Web";
}

/**
 * Readable hostname from a URL (without the leading "www.").
 * @param {string} url
 * @returns {string}
 */
export function hostFromUrl(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
