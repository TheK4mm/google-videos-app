import VideoCard from "./VideoCard";

function VideoList({ videos, onSelect }) {
  return (
    <div className="video-list">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default VideoList;