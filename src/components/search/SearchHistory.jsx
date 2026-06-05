import { ClockIcon, CloseIcon, TrashIcon } from "../icons";
import styles from "./SearchHistory.module.css";

function SearchHistory({ items, onPick, onRemove, onClear }) {
  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span>Búsquedas recientes</span>
        <button type="button" className={styles.clearAll} onClick={onClear}>
          <TrashIcon width={15} height={15} /> Limpiar
        </button>
      </div>
      <ul className={styles.list}>
        {items.map((term) => (
          <li key={term} className={styles.item}>
            <button type="button" className={styles.pick} onClick={() => onPick(term)}>
              <ClockIcon width={16} height={16} className={styles.clock} />
              <span>{term}</span>
            </button>
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(term)}
              aria-label={`Eliminar "${term}" del historial`}
            >
              <CloseIcon width={15} height={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHistory;
