import { AlertIcon } from "../icons";
import styles from "./ErrorState.module.css";

function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error}>
      <div className={styles.icon}>
        <AlertIcon width={38} height={38} />
      </div>
      <h2 className={styles.title}>Algo salió mal</h2>
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorState;
