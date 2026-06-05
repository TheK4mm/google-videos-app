import VideoCard from "./VideoCard";
import styles from "./VideoGrid.module.css";

function VideoGrid({ videos, onSelect }) {
  return (
    <div className={styles.grid}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default VideoGrid;
