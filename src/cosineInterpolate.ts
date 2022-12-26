export function cosineInterpolate(
  start: number,
  end: number,
  mu: number
): number {
  const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
  return start * (1 - mu2) + end * mu2;
}
