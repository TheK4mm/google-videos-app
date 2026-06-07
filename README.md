# Google Videos Api Consumer Application

Aplicación web para **buscar y reproducir videos de Google en tiempo real**, construida sobre la
infraestructura de **[SerpApi](https://serpapi.com/)** (Google Search API · engine `google_videos`).

Interfaz moderna con grid responsive, reproductor embebido, filtros, scroll infinito, historial de
búsquedas y modo claro/oscuro.

---

## Funcionalidades

- Búsqueda de videos en tiempo real (Google Videos vía SerpApi).
- **Reproductor embebido** (YouTube / Vimeo) en un modal, con _fallback_ a la fuente original.
- **Filtros** por duración, fecha y orden (mapeados al parámetro `tbs` nativo de Google).
- **Scroll infinito** con paginación y deduplicado de resultados.
- **Historial** de búsquedas recientes (localStorage).
- **Modo claro/oscuro** persistente, con diseño base oscuro.
- Backend con **caché en memoria**, validación y manejo de errores consistente.
- Estados de carga (skeletons), vacío y error en toda la UI.

---

## Tecnologías

| Capa     | Stack                                                            |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19 · Vite · CSS3 (design tokens + CSS Modules)            |
| Backend  | Node.js · Express 5 (estructura modular)                        |
| Datos    | SerpApi — Google Search API (`google_videos`)                  |

---

## Requisitos

- Node.js 18+ y npm.
- Una **API key de SerpApi** (gratis en <https://serpapi.com/manage-api-key>).

---

## Puesta en marcha

```bash
# 1. Instalar dependencias (frontend y backend)
npm install
npm install --prefix server

# 2. Configurar variables de entorno del backend
#    Copia el ejemplo y coloca tu API key
cp server/.env.example server/.env
#    Edita server/.env y define SERP_API_KEY=...

# 3. Levantar frontend + backend con un solo comando
npm run dev:all
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>

En desarrollo, Vite hace **proxy** de `/api` hacia el backend, así que no hay que configurar URLs.

### Scripts disponibles

| Comando             | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Solo el frontend (Vite).                     |
| `npm run server`    | Solo el backend (Express).                   |
| `npm run dev:all`   | Frontend + backend en paralelo.              |
| `npm run build`     | Build de producción del frontend.            |
| `npm run preview`   | Previsualiza el build.                        |
| `npm run lint`      | Linter (ESLint).                             |

---

## Variables de entorno (`server/.env`)

| Variable        | Requerida | Por defecto | Descripción                          |
| --------------- | --------- | ----------- | ------------------------------------ |
| `SERP_API_KEY`  | ✅        | —           | Tu API key de SerpApi.               |
| `PORT`          | ❌        | `3000`      | Puerto del backend.                  |
| `SERP_HL`       | ❌        | `es`        | Idioma de resultados.                |
| `SERP_GL`       | ❌        | `co`        | País para los resultados.            |

> ⚠️ **Seguridad:** el archivo `server/.env` **no debe versionarse** (ya está en `.gitignore`).
> Si tu key estuvo expuesta en el historial de git, **regenérala** en el panel de SerpApi.

---

## API del backend

| Método | Endpoint           | Descripción                                    |
| ------ | ------------------ | ---------------------------------------------- |
| `GET`  | `/api/health`      | Estado del servidor.                           |
| `GET`  | `/api/videos`      | Búsqueda de videos.                            |

**Parámetros de `/api/videos`:**

| Parámetro  | Valores                                            | Descripción           |
| ---------- | -------------------------------------------------- | --------------------- |
| `q`        | texto (requerido)                                  | Términos de búsqueda. |
| `duration` | `short` · `medium` · `long`                        | Duración del video.   |
| `date`     | `hour` · `day` · `week` · `month` · `year`         | Antigüedad.           |
| `sort`     | `relevance` · `date`                               | Orden.                |
| `page`     | número ≥ 1                                          | Página de resultados. |

**Respuesta:**

```json
{
  "query": "react hooks",
  "page": 1,
  "hasMore": true,
  "results": [
    {
      "id": "https://www.youtube.com/watch?v=...",
      "title": "…",
      "link": "https://www.youtube.com/watch?v=...",
      "thumbnail": "https://…",
      "duration": "1:46",
      "source": "youtube.com",
      "channel": "",
      "snippet": "…",
      "date": "",
      "platform": "youtube"
    }
  ]
}
```

---

## Estructura del proyecto

```
google-videos-app/
├─ index.html
├─ vite.config.js          # proxy /api → backend
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ styles/              # tokens.css + global.css
│  ├─ lib/                 # api, embed, format
│  ├─ hooks/               # useVideoSearch, useTheme, useInfiniteScroll, …
│  └─ components/
│     ├─ layout/           # Header, ThemeToggle
│     ├─ search/           # SearchBar, Filters, SearchHistory
│     ├─ videos/           # VideoGrid, VideoCard, VideoModal, VideoDetail
│     └─ feedback/         # SkeletonGrid, EmptyState, ErrorState
└─ server/
   ├─ index.js             # entry point
   ├─ .env.example
   └─ src/
      ├─ app.js            # Express app + middleware
      ├─ config.js         # carga/valida env
      ├─ routes/videos.js
      ├─ services/         # serpapi (tbs) + normalize
      ├─ lib/cache.js
      └─ middleware/errorHandler.js
```

---
