/**
 * Minimal in-memory cache with per-entry TTL and an LRU-style size cap.
 * Avoids repeated SerpApi calls for identical queries within the TTL window.
 */
class TtlCache {
  /** @param {{ ttlMs: number, maxEntries: number }} options */
  constructor({ ttlMs, maxEntries }) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    /** @type {Map<string, { value: unknown, expires: number }>} */
    this.store = new Map();
  }

  /**
   * @param {string} key
   * @returns {unknown | undefined}
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return undefined;
    }
    // Refresh recency (Map keeps insertion order).
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  /**
   * @param {string} key
   * @param {unknown} value
   */
  set(key, value) {
    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
    if (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value;
      this.store.delete(oldest);
    }
  }
}

module.exports = { TtlCache };
