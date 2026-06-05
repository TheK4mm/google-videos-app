import { FilmIcon } from "../icons";
import SearchBar from "../search/SearchBar";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

function Header({ onSearch, history, onRemoveHistory, onClearHistory, theme, onToggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/">
          <span className={styles.logo}>
            <FilmIcon width={22} height={22} />
          </span>
          <span>Vidora</span>
        </a>

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
