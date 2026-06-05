import { useState } from "react";
import Header from "./components/layout/Header";
import Filters from "./components/search/Filters";
import VideoGrid from "./components/videos/VideoGrid";
import VideoModal from "./components/videos/VideoModal";
import SkeletonGrid from "./components/feedback/SkeletonGrid";
import EmptyState from "./components/feedback/EmptyState";
import ErrorState from "./components/feedback/ErrorState";
import { useVideoSearch } from "./hooks/useVideoSearch";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useTheme } from "./hooks/useTheme";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import styles from "./App.module.css";

function App() {
  const { query, filters, results, status, error, hasMore, search, applyFilters, loadMore, retry } =
    useVideoSearch();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { theme, toggleTheme } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = (term) => {
    addToHistory(term);
    search(term);
  };

  const hasResults = results.length > 0;
  const sentinelRef = useInfiniteScroll({
    enabled: status === "success" && hasMore,
    onLoadMore: loadMore,
  });

  const showToolbar = hasResults || status === "loading";

  return (
    <div className={styles.app}>
      <Header
        onSearch={handleSearch}
        history={history}
        onRemoveHistory={removeFromHistory}
        onClearHistory={clearHistory}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className={styles.main}>
        {showToolbar && (
          <div className={styles.toolbar}>
            {query && <h1 className={styles.queryTitle}>Resultados para “{query}”</h1>}
            <Filters filters={filters} onChange={applyFilters} disabled={status === "loading"} />
          </div>
        )}

        {status === "idle" && <EmptyState variant="initial" />}
        {status === "loading" && <SkeletonGrid count={8} />}
        {status === "error" && !hasResults && <ErrorState message={error} onRetry={retry} />}
        {status === "success" && !hasResults && <EmptyState variant="noResults" query={query} />}

        {hasResults && (
          <>
            <VideoGrid videos={results} onSelect={setSelectedVideo} />

            {status === "loadingMore" && (
              <p className={styles.loadingMore}>Cargando más videos…</p>
            )}

            {status === "error" && (
              <p className={styles.inlineError}>
                No se pudieron cargar más videos.{" "}
                <button type="button" className={styles.inlineRetry} onClick={loadMore}>
                  Reintentar
                </button>
              </p>
            )}

            {status === "success" && hasMore && (
              <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
            )}

            {status === "success" && !hasMore && (
              <p className={styles.end}>Has llegado al final de los resultados.</p>
            )}
          </>
        )}
      </main>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}

export default App;
