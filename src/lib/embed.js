/**
 * Extracts a YouTube video id from common URL shapes.
 * @param {string} url
 * @returns {string|null}
 */
function youtubeId(url) {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extracts a Vimeo video id.
 * @param {string} url
 * @returns {string|null}
 */
function vimeoId(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Returns an embeddable iframe URL for a video, or null when the source
 * cannot be embedded (the UI then falls back to "open original").
 * @param {{ link?: string }} video
 * @returns {string|null}
 */
export function getEmbedUrl(video) {
  if (!video?.link) return null;
  const { link } = video;

  const yt = youtubeId(link);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`;

  const vm = vimeoId(link);
  if (vm) return `https://player.vimeo.com/video/${vm}?autoplay=1`;

  return null;
}
