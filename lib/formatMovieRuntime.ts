export function formatMovieRuntime(mins: number) {
  const hrs = Math.trunc(mins / 60)
  const minsLeft = mins % 60

  return `${hrs}h ${minsLeft}m`
}
