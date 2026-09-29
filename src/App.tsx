import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import {
  adjacentProject,
  adjacentPhotoIndex,
  filterProjects,
  heroPoster,
  heroVideo,
  openingFilms,
  projects,
  type Category,
  type Project,
} from "./content";

import { useFilmScene } from "./useFilmScene";

function ProjectViewer({
  project,
  initialPhotoIndex,
  onClose,
  onChange,
}: {
  project: Project;
  initialPhotoIndex: number;
  onClose: () => void;
  onChange: (project: Project) => void;
}): React.JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photoIndex, setPhotoIndex] = useState(initialPhotoIndex);
  const photos = project.photos;
  const currentPhoto = photos?.[photoIndex] ?? photos?.[0];
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  const change = (direction: number): void => {
    const next = adjacentProject(projects, project.id, direction);
    if (next) onChange(next);
  };
  const changePhoto = (direction: number): void => {
    if (!photos?.length) return;
    setPhotoIndex((index) => adjacentPhotoIndex(index, photos.length, direction));
  };
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (!photos?.length) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          changePhoto(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
      aria-labelledby="project-title"
    >
      <div className="project-detail">
        <div className="detail-top mono">
          <span>SATURIO. / {project.format}</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar proyecto"
          >
            <X size={22} />
          </button>
        </div>
        <div className="detail-media" key={project.id}>
          {project.video ? (
            <video
              src={project.video}
              poster={project.image}
              controls
              playsInline
              preload="metadata"
              aria-label={project.title}
            />
          ) : currentPhoto ? (
            <img src={currentPhoto.src} alt={currentPhoto.alt} />
          ) : (
            <img src={project.image} alt={project.alt} />
          )}
        </div>
        {photos && photos.length > 1 && (
          <div className="photo-gallery-controls mono">
            <button
              className="icon-button"
              onClick={() => changePhoto(-1)}
              aria-label="Foto anterior"
            >
              <ChevronLeft />
            </button>
            <span aria-live="polite">
              {(photoIndex + 1).toString().padStart(2, "0")} / {photos.length.toString().padStart(2, "0")}
            </span>
            <button
              className="icon-button"
              onClick={() => changePhoto(1)}
              aria-label="Foto siguiente"
            >
              <ChevronRight />
            </button>
          </div>
        )}
        <div className="detail-copy">
          <div>
            <h2 id="project-title">{project.title}</h2>
          </div>
        </div>
        <div className="detail-bottom">
          <p className="mono">{project.video ? "FILM" : "FOTOGRAFÍA"} · PEDRO SATURIO</p>
          <div>
            <button
              onClick={() => change(-1)}
              className="icon-button"
              aria-label="Proyecto anterior"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => change(1)}
              className="icon-button"
              aria-label="Proyecto siguiente"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function App(): React.JSX.Element {
  const [category, setCategory] = useState<Category>("Todos");
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const firstScene = useFilmScene(Boolean(selected) || menuOpen, 0.25);
  const secondScene = useFilmScene(Boolean(selected) || menuOpen, 0.25);
  const thirdScene = useFilmScene(Boolean(selected) || menuOpen, 0.25);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const element = mobileMenu.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [menuOpen]);
  const shownProjects = filterProjects(projects, category);
  const featuredFilm = projects.find((project) => project.video);
  const openProject = (project: Project, photoIndex = 0): void => {
    setSelectedPhotoIndex(photoIndex);
    setSelected(project);
  };

  return (
    <>
      <a href="#work" className="skip-link">
        Saltar a los proyectos
      </a>
      <main>
        <section
          className="hero film-scene"
          ref={firstScene.scene}
          id="top"
          aria-label="Pedro Saturio, fotografía y vídeo"
        >
          <div className="film-surface">
            <img
              className="hero-poster"
              src={heroPoster}
              alt=""
              fetchPriority="high"
            />
            <video
              ref={firstScene.video}
              className="hero-video"
              src={heroVideo}
              poster={heroPoster}
              muted
              loop
              playsInline
              preload="metadata"
              onError={firstScene.onError}
              aria-hidden="true"
            />
          </div>
          <div className="film-foreground">
            <header className="header">
              <a className="wordmark" href="#top" aria-label="Saturio, inicio">
                SATURIO<span>.</span>
              </a>
              <span className="header-descriptor mono">FOTOGRAFÍA &amp; VIDEO</span>
              <nav className="desktop-nav" aria-label="Navegación principal">
                <a href="#work">
                  Proyectos{" "}
                  <span className="nav-count">
                    ({projects.length.toString().padStart(2, "0")})
                  </span>
                </a>
              </nav>
              <button
                className="mobile-menu-button icon-button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu />
              </button>
            </header>
            <div className="hero-main">
              <h1>
                Pedro Saturio<span>.</span>
              </h1>
              {featuredFilm && (
                <button
                  className="reel-button"
                  onClick={() => openProject(featuredFilm)}
                  aria-label="Ver film de Pedro Saturio"
                >
                  <span className="play-circle">
                    <Play size={17} fill="currentColor" />
                  </span>
                  <span>Ver film</span>
                </button>
              )}
            </div>
            <div className="hero-bottom">
              <a href="#second-film" className="scroll-link mono">
                <ArrowDown size={17} />
                <span>SIGUIENTE FILM</span>
              </a>
              <div className="video-controls">
                {firstScene.failed ? (
                  <span className="mono">VISTA PREVIA</span>
                ) : (
                  <>
                    <button
                      className="icon-button"
                      onClick={firstScene.toggle}
                      aria-label={
                        firstScene.paused
                          ? "Reproducir vídeo de fondo"
                          : "Pausar vídeo de fondo"
                      }
                    >
                      {firstScene.paused ? (
                        <Play size={16} />
                      ) : (
                        <Pause size={16} />
                      )}
                    </button>
                    <span className="mono playback-label">
                      {firstScene.paused ? "PLAY" : "PAUSA"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={secondScene.scene}
          className="hero film-scene second-film"
          id="second-film"
          aria-label="Segundo vídeo de Vietnam"
        >
          <div className="film-surface">
            <img
              className="hero-poster"
              src={openingFilms[1].poster}
              alt=""
              loading="lazy"
            />
            <video
              ref={secondScene.video}
              className="hero-video"
              src={openingFilms[1].src}
              poster={openingFilms[1].poster}
              muted
              loop
              playsInline
              preload="none"
              onError={secondScene.onError}
              aria-hidden="true"
            />
          </div>
          <div className="film-foreground">
            <div className="second-film-title">
              <span className="mono">02 / FILM</span>
              <h2>{openingFilms[1].title}</h2>
            </div>
            <div className="hero-bottom">
              <a href="#third-film" className="scroll-link mono">
                <ArrowDown size={17} />
                <span>SIGUIENTE FILM</span>
              </a>
              <div className="video-controls">
                {secondScene.failed ? (
                  <span className="mono">VISTA PREVIA</span>
                ) : (
                  <>
                    <button
                      className="icon-button"
                      onClick={secondScene.toggle}
                      aria-label={
                        secondScene.paused
                          ? "Reproducir segundo vídeo"
                          : "Pausar segundo vídeo"
                      }
                    >
                      {secondScene.paused ? (
                        <Play size={16} />
                      ) : (
                        <Pause size={16} />
                      )}
                    </button>
                    <span className="mono">
                      {secondScene.paused ? "PLAY" : "PAUSA"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={thirdScene.scene}
          className="hero film-scene second-film third-film"
          id="third-film"
          aria-label="Tercer vídeo de Vietnam"
        >
          <div className="film-surface">
            <img
              className="hero-poster"
              src={openingFilms[2].poster}
              alt=""
              loading="lazy"
            />
            <video
              ref={thirdScene.video}
              className="hero-video"
              src={openingFilms[2].src}
              poster={openingFilms[2].poster}
              muted
              loop
              playsInline
              preload="none"
              onError={thirdScene.onError}
              aria-hidden="true"
            />
          </div>
          <div className="film-foreground">
            <div className="second-film-title">
              <span className="mono">03 / FILM</span>
              <h2>{openingFilms[2].title}</h2>
            </div>
            <div className="hero-bottom">
              <a href="#work" className="scroll-link mono">
                <ArrowDown size={17} />
                <span>PROYECTOS</span>
              </a>
              <div className="video-controls">
                {thirdScene.failed ? (
                  <span className="mono">VISTA PREVIA</span>
                ) : (
                  <>
                    <button
                      className="icon-button"
                      onClick={thirdScene.toggle}
                      aria-label={
                        thirdScene.paused
                          ? "Reproducir tercer vídeo"
                          : "Pausar tercer vídeo"
                      }
                    >
                      {thirdScene.paused ? (
                        <Play size={16} />
                      ) : (
                        <Pause size={16} />
                      )}
                    </button>
                    <span className="mono">
                      {thirdScene.paused ? "PLAY" : "PAUSA"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="work-section section-padding" id="work">
          <div className="work-heading">
            <h2>
              Selección
              <span className="selection-count mono">
                {" "}
                / {projects.length.toString().padStart(2, "0")}
              </span>
            </h2>
            <div className="work-heading-right">
              <div className="filters" aria-label="Filtrar proyectos">
                {(["Todos", "Películas", "Fotografía"] as Category[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      className={filter === category ? "active" : ""}
                      aria-pressed={filter === category}
                      onClick={() => setCategory(filter)}
                    >
                      {filter}
                      <sup>
                        {filterProjects(projects, filter)
                          .length.toString()
                          .padStart(2, "0")}
                      </sup>
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {shownProjects.length}{" "}
            {shownProjects.length === 1
              ? "proyecto visible"
              : "proyectos visibles"}
          </p>
          <div
            className={`project-grid ${category !== "Todos" ? "filtered" : ""}`}
          >
            {shownProjects.map((project) => (
              <article
                key={project.id}
                className={`project-card project-${project.id}`}
              >
                <button
                  className="project-image-button"
                  onClick={() => openProject(project)}
                  aria-label={`Ver ${project.title}${project.photos ? `, ${project.photos.length} fotografías` : ""}`}
                >
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    width="1400"
                    height="1000"
                  />
                  <span className="image-top-label mono">
                    {project.category === "Películas" ? (
                      <>
                        <Play size={12} fill="currentColor" /> FILM
                      </>
                    ) : (
                      "FOTOGRAFÍA"
                    )}
                  </span>
                  <span className="image-open">
                    <Plus size={25} />
                  </span>
                  <span className="image-index mono">
                    {(projects.indexOf(project) + 1)
                      .toString()
                      .padStart(2, "0")}{" "}
                    / {projects.length.toString().padStart(2, "0")}
                  </span>
                </button>
                <div className="project-info">
                  <h3>
                    <button onClick={() => openProject(project)}>
                      {project.title}
                    </button>
                  </h3>
                  <span className="mono">
                    {project.photos
                      ? `${project.photos.length.toString().padStart(2, "0")} FOTOS`
                      : project.format}
                  </span>
                </div>
                {project.photos && project.photos.length > 1 && (
                  <div className="project-preview-strip" aria-label={`Más fotos de ${project.title}`}>
                    {project.photos.slice(1).map((photo, index) => (
                      <button
                        key={photo.src}
                        style={{ aspectRatio: photo.aspectRatio }}
                        onClick={() => openProject(project, index + 1)}
                        aria-label={`Ver foto ${index + 2} de ${project.photos!.length} de ${project.title}`}
                      >
                        <img src={photo.src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <footer className="contact-section section-padding">
          <div className="footer-bottom">
            <a className="wordmark" href="#top">
              SATURIO.
            </a>
            <span className="mono">
              © {new Date().getFullYear()} PEDRO SATURIO
            </span>
            <a href="#top">
              Volver arriba <ArrowUpRight size={14} />
            </a>
          </div>
        </footer>
      </main>
        {selected && (
          <ProjectViewer
            key={selected.id}
            project={selected}
            initialPhotoIndex={selectedPhotoIndex}
            onClose={() => setSelected(null)}
            onChange={(project) => openProject(project)}
          />
        )}
      {menuOpen && (
        <dialog
          ref={mobileMenu}
          className="mobile-menu"
          onCancel={() => setMenuOpen(false)}
          aria-label="Menú de navegación"
        >
          <div className="mobile-menu-head">
            <span className="wordmark">SATURIO.</span>
            <button
              className="icon-button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X />
            </button>
          </div>
          <nav>
            <a href="#work" onClick={() => setMenuOpen(false)}>
              Proyectos <ArrowUpRight />
            </a>
          </nav>
          <p className="mono">PEDRO SATURIO · FOTOGRAFÍA &amp; VIDEO</p>
        </dialog>
      )}
    </>
  );
}

export default App;
