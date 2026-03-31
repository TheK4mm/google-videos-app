function VideoPlayer({ video }) {
  if (!video) return <p>Selecciona un video</p>;

  return (
    <div className="video-player">
      <div className="video-container">
        <img src={video.thumbnail} alt={video.title} />

        {video.duration && (
          <span className="video-duration">
            {video.duration}
          </span>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;