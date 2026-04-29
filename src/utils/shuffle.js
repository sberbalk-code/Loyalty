// Fisher–Yates shuffle. Pure: returns a new array, never mutates the input.
export function shuffle(input) {
  const result = [...input]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
