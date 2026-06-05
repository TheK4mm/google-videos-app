const { Router } = require("express");
const config = require("../config");
const { fetchVideos } = require("../services/serpapi");
const { normalizeResponse } = require("../services/normalize");
const { TtlCache } = require("../lib/cache");

const router = Router();
const cache = new TtlCache(config.cache);

const VALID_DURATION = new Set(["short", "medium", "long"]);
const VALID_DATE = new Set(["hour", "day", "week", "month", "year"]);
const VALID_SORT = new Set(["relevance", "date"]);

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

router.get("/videos", async (req, res, next) => {
  try {
    const query = (req.query.q || "").toString().trim();
    if (!query) {
      const err = new Error("Debes enviar el parámetro 'q' con tu búsqueda.");
      err.status = 400;
      err.code = "MISSING_QUERY";
      throw err;
    }

    const duration = VALID_DURATION.has(req.query.duration) ? req.query.duration : undefined;
    const date = VALID_DATE.has(req.query.date) ? req.query.date : undefined;
    const sort = VALID_SORT.has(req.query.sort) ? req.query.sort : "relevance";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const cacheKey = JSON.stringify({ query, duration, date, sort, page });
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const response = await fetchVideos({ query, duration, date, sort, page });
    const payload = normalizeResponse(response, { query, page });

    cache.set(cacheKey, payload);
    res.set("X-Cache", "MISS");
    res.json(payload);
  } catch (error) {
    // Validation errors already carry a status; anything else is upstream/SerpApi.
    if (!error.status) {
      console.error("[serpapi] error:", error.message);
      error.status = 502;
      error.code = "UPSTREAM_ERROR";
      error.message = "No se pudieron obtener los videos desde SerpApi.";
    }
    next(error);
  }
});

module.exports = router;
