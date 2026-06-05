const { getJson } = require("serpapi");
const config = require("../config");

// Filters map to Google's native `tbs` parameter, kept intact through SerpApi.
const DURATION_MAP = { short: "dur:s", medium: "dur:m", long: "dur:l" };
const DATE_MAP = { hour: "qdr:h", day: "qdr:d", week: "qdr:w", month: "qdr:m", year: "qdr:y" };

/**
 * Builds the Google `tbs` value from the supported filter options.
 * @param {{ duration?: string, date?: string, sort?: string }} filters
 * @returns {string}
 */
function buildTbs({ duration, date, sort } = {}) {
  const parts = [];
  if (DURATION_MAP[duration]) parts.push(DURATION_MAP[duration]);
  if (DATE_MAP[date]) parts.push(DATE_MAP[date]);
  if (sort === "date") parts.push("sbd:1");
  return parts.join(",");
}

/**
 * Queries SerpApi's `google_videos` engine.
 * @param {{ query: string, duration?: string, date?: string, sort?: string, page: number }} params
 * @returns {Promise<object>} raw SerpApi response
 */
async function fetchVideos({ query, duration, date, sort, page }) {
  const pageSize = config.defaults.pageSize;

  /** @type {Record<string, string | number>} */
  const params = {
    engine: "google_videos",
    q: query,
    hl: config.defaults.hl,
    gl: config.defaults.gl,
    start: (page - 1) * pageSize,
    num: pageSize,
    api_key: config.serpApiKey,
  };

  const tbs = buildTbs({ duration, date, sort });
  if (tbs) params.tbs = tbs;

  return getJson(params);
}

module.exports = { fetchVideos, buildTbs };
