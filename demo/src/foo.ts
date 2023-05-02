export const sum = (xs: [number]): number => xs.reduce((x, y) => x + y, 0);

function prod(xs: [number]): number {
  return xs.reduce((x, y) => x * y, 1);
}
