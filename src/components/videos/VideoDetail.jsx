import { ExternalIcon } from "../icons";
import { hostFromUrl, platformLabel } from "../../lib/format";
import styles from "./VideoDetail.module.css";

function VideoDetail({ video }) {
  const metaItems = [video.channel || video.source, video.date, video.duration].filter(Boolean);
  const host = hostFromUrl(video.link);

  return (
    <div className={styles.detail}>
      <h2 className={styles.title}>{video.title}</h2>

      <div className={styles.metaRow}>
        <span className={styles.badge}>{platformLabel(video.platform)}</span>
        {metaItems.map((item) => (
          <span key={item} className={styles.metaItem}>
            {item}
          </span>
        ))}
      </div>

      {video.snippet && <p className={styles.snippet}>{video.snippet}</p>}

      <a className={styles.link} href={video.link} target="_blank" rel="noreferrer">
        <ExternalIcon width={18} height={18} />
        {host ? `Ver original en ${host}` : "Ver original"}
      </a>
    </div>
  );
}

export default VideoDetail;
