function VideoCard({ video, onSelect }) {
  return (
    <div className="video-card" onClick={() => onSelect(video)}>
      <img src={video.thumbnail} alt={video.title} />

      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>

   {(video.channel || video.source || video.publisher) && (
  <p className="video-channel">
    {video.channel || video.source || video.publisher}
  </p>
)}
        <p className="video-meta">
          ⏱ {video.duration || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default VideoCard;