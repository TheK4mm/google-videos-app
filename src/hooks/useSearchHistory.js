import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const MAX_HISTORY = 8;

/**
 * Persists recent search terms (most recent first, deduped, capped).
 */
export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage("gv:history", /** @type {string[]} */ ([]));

  const addToHistory = useCallback(
    (term) => {
      const value = term.trim();
      if (!value) return;
      setHistory((prev) => {
        const without = prev.filter((t) => t.toLowerCase() !== value.toLowerCase());
        return [value, ...without].slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const removeFromHistory = useCallback(
    (term) => setHistory((prev) => prev.filter((t) => t !== term)),
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
