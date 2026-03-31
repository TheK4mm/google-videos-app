function VideoDetail({ video }) {
  if (!video) return null;

  return (
    <div className="video-detail">
      <h2 className="detail-title">{video.title}</h2>

      <p className="detail-description">
        {video.snippet}
      </p>

      <a href={video.link} target="_blank" rel="noreferrer">
        🔗 Ver video original
      </a>
    </div>
  );
}

export default VideoDetail;