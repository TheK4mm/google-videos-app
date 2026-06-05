const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** Error type carrying a machine-readable code from the backend. */
export class ApiError extends Error {
  /** @param {string} message @param {string} code */
  constructor(message, code) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

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
 * Queries the backend for videos. URLSearchParams encodes the query safely.
 * @param {{ query: string, duration?: string, date?: string, sort?: string, page?: number, signal?: AbortSignal }} params
 * @returns {Promise<{ query: string, page: number, hasMore: boolean, results: Video[] }>}
 */
export async function searchVideos({ query, duration, date, sort, page = 1, signal }) {
  const params = new URLSearchParams({ q: query, page: String(page) });
  if (duration) params.set("duration", duration);
  if (date) params.set("date", date);
  if (sort && sort !== "relevance") params.set("sort", sort);

  let response;
  try {
    response = await fetch(`${API_BASE}/videos?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté encendido.",
      "NETWORK"
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON body handled below */
  }

  if (!response.ok) {
    const message = data?.error?.message || "Ocurrió un error al buscar videos.";
    const code = data?.error?.code || "HTTP_ERROR";
    throw new ApiError(message, code);
  }

  return data;
}
