import { useEffect, useRef } from "react";
import { CloseIcon } from "../icons";
import { getEmbedUrl } from "../../lib/embed";
import { platformLabel } from "../../lib/format";
import VideoDetail from "./VideoDetail";
import styles from "./VideoModal.module.css";

function VideoModal({ video, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!video) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = getEmbedUrl(video);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        ref={dialogRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </button>

        <div className={styles.player}>
          {embedUrl ? (
            <iframe
              className={styles.iframe}
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className={styles.fallback}
              style={video.thumbnail ? { backgroundImage: `url(${video.thumbnail})` } : undefined}
            >
              <div className={styles.fallbackInner}>
                <p>Esta fuente no permite reproducción incrustada.</p>
                <a className={styles.fallbackBtn} href={video.link} target="_blank" rel="noreferrer">
                  Ver en {platformLabel(video.platform)}
                </a>
              </div>
            </div>
          )}
        </div>

        <VideoDetail video={video} />
      </div>
    </div>
  );
}

export default VideoModal;
