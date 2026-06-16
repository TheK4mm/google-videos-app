import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.tagline}>
          Buscador y reproductor de videos de Google en tiempo real.
        </p>

        <nav className={styles.meta} aria-label="Información del sitio">
          <span>
            Datos por{" "}
            <a
              className={styles.link}
              href="https://serpapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SerpApi
            </a>{" "}
            · Google Videos
          </span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <span>Hecho con React + Vite</span>
        </nav>

        <p className={styles.copyright}>© {year}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
