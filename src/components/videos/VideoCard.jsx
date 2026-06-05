import { PlayIcon } from "../icons";
import { platformLabel } from "../../lib/format";
import styles from "./VideoCard.module.css";

function VideoCard({ video, onSelect }) {
  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => onSelect(video)}
        aria-label={`Reproducir: ${video.title}`}
      >
        <div className={styles.thumb}>
          {video.thumbnail ? (
            <img src={video.thumbnail} alt="" loading="lazy" />
          ) : (
            <div className={styles.thumbFallback} aria-hidden="true" />
          )}
          <span className={styles.play}>
            <PlayIcon width={22} height={22} />
          </span>
          {video.duration && <span className={styles.duration}>{video.duration}</span>}
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{video.title}</h3>
          <div className={styles.meta}>
            <span className={styles.platform}>{platformLabel(video.platform)}</span>
            {(video.channel || video.source) && (
              <span className={styles.source}>{video.channel || video.source}</span>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}

export default VideoCard;
