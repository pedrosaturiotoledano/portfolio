export function parallaxOffset(
  top: number,
  height: number,
  viewport: number,
): number {
  if (height <= 0 || viewport <= 0) return 0;
  const progress = -(top + (height - viewport) / 2) / ((height + viewport) / 2);
  return Math.max(-1, Math.min(1, progress)) * height * 0.2;
}

export function isFilmVisible(
  top: number,
  height: number,
  viewport: number,
): boolean {
  if (height <= 0 || viewport <= 0) return false;
  const visible = Math.max(
    0,
    Math.min(top + height, viewport) - Math.max(top, 0),
  );
  return visible > Math.min(height, viewport) * 0.5;
}
