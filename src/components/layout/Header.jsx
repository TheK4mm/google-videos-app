import SearchBar from "../search/SearchBar";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

function Header({ onSearch, history, onRemoveHistory, onClearHistory, theme, onToggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.search}>
          <SearchBar
            onSearch={onSearch}
            history={history}
            onRemoveHistory={onRemoveHistory}
            onClearHistory={onClearHistory}
          />
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

export default Header;
