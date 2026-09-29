import { describe, expect, it } from "vitest";
import { adjacentPhotoIndex, adjacentProject, filterProjects, openingFilms, projects } from "./content";

describe("portfolio navigation", () => {
  it("filters photographs without including films", () => {
    const result = filterProjects(projects, "Fotografía");
    expect(result.length).toBe(2);
    expect(result.every((project) => !project.video)).toBe(true);
  });
  it("includes both distinct films in the film catalog", () => {
    const films = filterProjects(projects, "Películas");
    expect(films.map((project) => project.id)).toEqual(["vietnam", "ha-giang"]);
    expect(new Set(films.map((project) => project.video)).size).toBe(2);
  });
  it("uses the same accented title for the first opening film and catalog project", () => {
    expect(openingFilms[0].title).toBe("Phú Quốc, Vietnam");
    expect(projects.find((project) => project.id === "vietnam")?.title).toBe(openingFilms[0].title);
  });
  it("keeps all projects in the original editorial order", () => {
    expect(filterProjects(projects, "Todos")).toEqual(projects);
  });
  it("wraps forwards and backwards across the project viewer", () => {
    expect(adjacentProject(projects, projects.at(-1)!.id, 1)).toEqual(
      projects[0],
    );
    expect(adjacentProject(projects, projects[0].id, -1)).toEqual(
      projects.at(-1),
    );
  });
  it("handles an empty portfolio without throwing", () => {
    expect(adjacentProject([], "missing", 1)).toBeUndefined();
    expect(filterProjects([], "Películas")).toEqual([]);
  });
  it("cycles through each photographic series", () => {
    const photographicProjects = filterProjects(projects, "Fotografía");
    expect(photographicProjects.map((project) => project.photos?.length)).toEqual([4, 5]);
    expect(adjacentPhotoIndex(3, 4, 1)).toBe(0);
    expect(adjacentPhotoIndex(0, 5, -1)).toBe(4);
  });
});
