import { FilmIcon, VideoOffIcon } from "../icons";
import styles from "./EmptyState.module.css";

function EmptyState({ variant = "initial", query }) {
  const isNoResults = variant === "noResults";

  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        {isNoResults ? <VideoOffIcon width={40} height={40} /> : <FilmIcon width={40} height={40} />}
      </div>
      <h2 className={styles.title}>
        {isNoResults ? "Sin resultados" : "Busca videos en tiempo real"}
      </h2>
      <p className={styles.text}>
        {isNoResults ? (
          <>
            No encontramos videos para <strong>“{query}”</strong>. Prueba con otros términos o ajusta
            los filtros.
          </>
        ) : (
          "Escribe lo que quieras encontrar y explora resultados de Google Videos al instante."
        )}
      </p>
    </div>
  );
}

export default EmptyState;
