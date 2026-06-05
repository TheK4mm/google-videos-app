import { useEffect, useRef } from "react";

/**
 * Invokes onLoadMore when the returned sentinel element scrolls into view.
 * @param {{ enabled: boolean, onLoadMore: () => void }} options
 * @returns {import("react").RefObject<HTMLDivElement>}
 */
export function useInfiniteScroll({ enabled, onLoadMore }) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  // Keep the latest callback without re-creating the observer.
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
