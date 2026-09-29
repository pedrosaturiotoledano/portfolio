export type Category = "Todos" | "Películas" | "Fotografía";
export interface Photo {
  src: string;
  alt: string;
  aspectRatio: number;
}

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, "Todos">;
  image: string;
  alt: string;
  format: string;
  video?: string;
  photos?: Photo[];
}

export interface OpeningFilm {
  src: string;
  poster: string;
  title: string;
}

const media = (name: string): string => `${import.meta.env.BASE_URL}media/${name}`;

// Owner-provided Vietnam footage, ordered as supplied for the opening sequence.
export const openingFilms: OpeningFilm[] = [
  {
    src: media("vietnam-film-01.mp4"),
    poster: media("vietnam-film-01-poster.jpg"),
    title: "Phú Quốc, Vietnam",
  },
  {
    src: media("vietnam-film-02.mp4"),
    poster: media("vietnam-film-02-poster.jpg"),
    title: "Hà Giang, Vietnam",
  },
  {
    src: media("vietnam-film-03.mp4"),
    poster: media("vietnam-film-03-poster.jpg"),
    title: "Phú Quốc, Vietnam",
  },
];
export const heroVideo = openingFilms[0].src;
export const heroPoster = openingFilms[0].poster;
const flamencaPhotos: Photo[] = [
  {
    src: media("portfolio/flamenca-retrato.webp"),
    alt: "Retrato de una mujer con vestido verde de flamenca y flores rojas",
    aspectRatio: 2 / 3,
  },
  {
    src: media("portfolio/flamenca-calle.webp"),
    alt: "Dos mujeres con vestidos de flamenca naranja y lila paseando por la calle",
    aspectRatio: 2 / 3,
  },
  {
    src: media("portfolio/flamenca-grupo.webp"),
    alt: "Tres mujeres con vestidos de flamenca de colores posando juntas",
    aspectRatio: 3 / 2,
  },
  {
    src: media("portfolio/flamenca-instante.webp"),
    alt: "Momento espontáneo de una mujer vestida de flamenca durante la celebración",
    aspectRatio: 3 / 2,
  },
];
const scenePhotos: Photo[] = [
  {
    src: media("portfolio/escena-solista.webp"),
    alt: "Cantante con vestido rojo actuando junto a la orquesta",
    aspectRatio: 4 / 5,
  },
  {
    src: media("portfolio/escena-escenario.webp"),
    alt: "Vista amplia de un escenario de ópera con una intérprete junto al decorado",
    aspectRatio: 3 / 2,
  },
  {
    src: media("portfolio/escena-interprete.webp"),
    alt: "Intérprete de ópera con vestido blanco sobre el escenario",
    aspectRatio: 4 / 5,
  },
  {
    src: media("portfolio/escena-saludo.webp"),
    alt: "Cantantes saludando al público tras una actuación en directo",
    aspectRatio: 3 / 2,
  },
  {
    src: media("portfolio/escena-piano.webp"),
    alt: "Pianista tocando un piano de cola sobre el escenario",
    aspectRatio: 3 / 2,
  },
];
export const projects: Project[] = [
  {
    id: "flamenca",
    title: "Flamenca",
    category: "Fotografía",
    image: flamencaPhotos[0].src,
    alt: flamencaPhotos[0].alt,
    format: "RETRATO",
    photos: flamencaPhotos,
  },
  {
    id: "escena",
    title: "En escena",
    category: "Fotografía",
    image: scenePhotos[0].src,
    alt: scenePhotos[0].alt,
    format: "EN DIRECTO",
    photos: scenePhotos,
  },
  {
    id: "vietnam",
    title: "Phú Quốc, Vietnam",
    category: "Películas",
    image: heroPoster,
    alt: "Fotograma del vídeo de Pedro Saturio",
    format: "FILM",
    video: heroVideo,
  },
  {
    id: "ha-giang",
    title: "Hà Giang, Vietnam",
    category: "Películas",
    image: media("ha-giang-river-poster.jpg"),
    alt: "Vista aérea de dos barcas cruzando un río rodeado de vegetación",
    format: "FILM",
    video: media("ha-giang-river.mp4"),
  },
];

export function filterProjects(
  items: Project[],
  category: Category,
): Project[] {
  return category === "Todos"
    ? items
    : items.filter((project) => project.category === category);
}

export function adjacentProject(
  items: Project[],
  id: string,
  direction: number,
): Project | undefined {
  if (!items.length) return undefined;
  const index = items.findIndex((project) => project.id === id);
  return items[(Math.max(index, 0) + direction + items.length) % items.length];
}

export function adjacentPhotoIndex(
  index: number,
  count: number,
  direction: number,
): number {
  if (count <= 0) return 0;
  return ((index + direction) % count + count) % count;
}
