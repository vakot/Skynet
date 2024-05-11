export function toBinaryNumbers(value?: number | string | any): number[] {
  if (!value || isNaN(value) || value === null) {
    return []
  }

  try {
    return Number(value)
      .toString(2)
      .split('')
      .reduce(
        (acc: number[], bit, index, { length }) =>
          bit === '1' ? [...acc, Math.pow(2, length - index - 1)] : acc,
        []
      )
      .reverse()
  } catch (error) {
    return []
  }
}
