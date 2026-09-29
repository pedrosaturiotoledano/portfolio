import { describe, expect, it } from "vitest";
import { isFilmVisible, parallaxOffset } from "./film-motion";

describe("full-screen film scrolling", () => {
  it("moves the enlarged image more slowly than its frame", () => {
    expect(parallaxOffset(0, 800, 800)).toBeCloseTo(0);
    expect(parallaxOffset(-400, 800, 800)).toBe(80);
    expect(parallaxOffset(400, 800, 800)).toBe(-80);
  });
  it("keeps translation within the 140% image overscan", () => {
    expect(parallaxOffset(-8000, 800, 800)).toBe(160);
    expect(parallaxOffset(8000, 800, 800)).toBe(-160);
  });
  it("only plays the film occupying more than half the viewport", () => {
    expect(isFilmVisible(-300, 800, 800)).toBe(true);
    expect(isFilmVisible(500, 800, 800)).toBe(false);
    expect(isFilmVisible(-800, 800, 800)).toBe(false);
    expect(isFilmVisible(-400, 800, 800)).toBe(false);
  });
  it("handles an unmeasured frame", () => {
    expect(parallaxOffset(10, 0, 0)).toBe(0);
    expect(isFilmVisible(10, 0, 0)).toBe(false);
  });
});
