import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "../icons";
import SearchHistory from "./SearchHistory";
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch, history, onRemoveHistory, onClearHistory }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the history dropdown when clicking outside.
  useEffect(() => {
    function handleClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const submit = (term) => {
    const query = term.trim();
    if (!query) return;
    setValue(query);
    setOpen(false);
    onSearch(query);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(value);
  };

  const normalized = value.trim().toLowerCase();
  const filteredHistory = normalized
    ? history.filter((t) => t.toLowerCase().includes(normalized) && t.toLowerCase() !== normalized)
    : history;
  const showHistory = open && filteredHistory.length > 0;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <form className={styles.form} onSubmit={handleSubmit} role="search">
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          className={styles.input}
          placeholder="Buscar videos…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setOpen(true)}
          aria-label="Buscar videos"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setValue("")}
            aria-label="Limpiar búsqueda"
          >
            <CloseIcon width={18} height={18} />
          </button>
        )}
        <button type="submit" className={styles.submit}>
          Buscar
        </button>
      </form>

      {showHistory && (
        <SearchHistory
          items={filteredHistory}
          onPick={submit}
          onRemove={onRemoveHistory}
          onClear={onClearHistory}
        />
      )}
    </div>
  );
}

export default SearchBar;
