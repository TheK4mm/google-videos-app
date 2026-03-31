import { useState } from "react";
import Navbar from "./components/Navbar";
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import VideoDetail from "./components/VideoDetail";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchVideos = async (query) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/videos?q=${query}`
      );

      const data = await response.json();

      setVideos(data);
      setSelectedVideo(data[0] || null);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar onSearch={searchVideos} />

      {loading && <Loader />}

      {!loading && (
        <div className="main">
          
          <VideoList videos={videos} onSelect={setSelectedVideo} />

          
          <div className="content">
            <VideoPlayer video={selectedVideo} />
            <VideoDetail video={selectedVideo} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;