import { useCallback, useRef, useState } from "react";
import { searchVideos } from "../lib/api";

/** @typedef {"idle"|"loading"|"loadingMore"|"success"|"error"} Status */

export const DEFAULT_FILTERS = { duration: "", date: "", sort: "relevance" };

/**
 * Owns all search state: query, filters, paginated results and request
 * lifecycle. Stale requests are aborted; appended pages are deduped by id.
 */
export function useVideoSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(/** @type {Status} */ ("idle"));
  const [error, setError] = useState(/** @type {string|null} */ (null));
  const [hasMore, setHasMore] = useState(false);

  const pageRef = useRef(1);
  const abortRef = useRef(/** @type {AbortController|null} */ (null));
  // Params of the last committed search, reused by loadMore / retry.
  const lastSearchRef = useRef({ query: "", filters: DEFAULT_FILTERS });

  const runSearch = useCallback(async ({ q, searchFilters, page, append }) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus(append ? "loadingMore" : "loading");
    setError(null);
    if (!append) setResults([]);

    try {
      const data = await searchVideos({
        query: q,
        duration: searchFilters.duration || undefined,
        date: searchFilters.date || undefined,
        sort: searchFilters.sort,
        page,
        signal: controller.signal,
      });

      pageRef.current = page;
      setHasMore(Boolean(data.hasMore));
      setResults((prev) => {
        if (!append) return data.results;
        const seen = new Set(prev.map((v) => v.id));
        return [...prev, ...data.results.filter((v) => !seen.has(v.id))];
      });
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError") return; // superseded by a newer search
      setError(err.message || "Error inesperado.");
      setStatus("error");
    }
  }, []);

  const search = useCallback(
    (rawQuery, overrideFilters) => {
      const trimmed = rawQuery.trim();
      if (!trimmed) return;
      const effectiveFilters = overrideFilters || filters;
      lastSearchRef.current = { query: trimmed, filters: effectiveFilters };
      setQuery(trimmed);
      runSearch({ q: trimmed, searchFilters: effectiveFilters, page: 1, append: false });
    },
    [filters, runSearch]
  );

  const applyFilters = useCallback(
    (nextFilters) => {
      setFilters(nextFilters);
      const q = lastSearchRef.current.query;
      if (q) {
        lastSearchRef.current = { query: q, filters: nextFilters };
        runSearch({ q, searchFilters: nextFilters, page: 1, append: false });
      }
    },
    [runSearch]
  );

  const loadMore = useCallback(() => {
    if (status === "loading" || status === "loadingMore" || !hasMore) return;
    const { query: q, filters: f } = lastSearchRef.current;
    if (!q) return;
    runSearch({ q, searchFilters: f, page: pageRef.current + 1, append: true });
  }, [status, hasMore, runSearch]);

  const retry = useCallback(() => {
    const { query: q, filters: f } = lastSearchRef.current;
    if (q) runSearch({ q, searchFilters: f, page: 1, append: false });
  }, [runSearch]);

  return {
    query,
    filters,
    results,
    status,
    error,
    hasMore,
    search,
    applyFilters,
    loadMore,
    retry,
  };
}
