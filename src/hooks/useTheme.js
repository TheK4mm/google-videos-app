import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

/** @returns {"light"|"dark"} */
function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

/**
 * Persistent light/dark theme. Defaults to the OS preference, then syncs the
 * choice to <html data-theme="..."> for the token system to react to.
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage("gv:theme", getSystemTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
