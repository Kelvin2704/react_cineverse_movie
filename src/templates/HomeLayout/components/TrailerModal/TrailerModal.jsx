import React, { useEffect, useState } from "react";
import tmdpApi from "../../../../api/tmdbApi";
import "./TrailerModal.scss";

const TrailerModal = ({ cate, id, onClose }) => {
  const [video, setVideo] = useState(null);
    const [visible, setVisible] = useState(false);
  // console.log(cate,id);
  useEffect(() => {
    const fetchTrailerVideo = async () => {
      try {
        const response = await tmdpApi.getVideo(cate, id);
        const videoData = response.results[0];
        // console.log(response)
        setVideo(videoData);
      } catch (error) {
        console.log("Fetching error", error);
      }
    };
    fetchTrailerVideo();
  }, [cate, id]);
  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };
  return (
    <div className={`video-modal ${visible ? "visible" : "hidden"}`}>
      <div className="video-modal__overlay" onClick={handleClose}></div>
      <div className="video-modal__content">
        <button className="video-modal__close" onClick={handleClose}>
          &times;
        </button>
        {video ? (
          <iframe
            title="video"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
