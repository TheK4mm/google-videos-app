import styles from "./SkeletonGrid.module.css";

function SkeletonGrid({ count = 8 }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.thumb} />
          <div className={styles.line} />
          <div className={`${styles.line} ${styles.short}`} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonGrid;
