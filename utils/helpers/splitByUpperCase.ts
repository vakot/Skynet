export function splitByUpperCase(input: string): string[] {
  const words = input.match(/[A-Z][a-z]*/g)

  if (!words) {
    return []
  }

  return words
}
