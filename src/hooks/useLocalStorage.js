import { useEffect, useState } from "react";

/**
 * State synced to localStorage, resilient to JSON / availability errors.
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, import("react").Dispatch<import("react").SetStateAction<T>>]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (e.g. private mode) — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
