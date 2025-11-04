// Helper pour transformer "YYYYMMDD" en Date
export const parseHistoryDate = (date: string): Date => {
  const y = +date.slice(0, 4)
  const m = +date.slice(4, 6) - 1
  const d = +date.slice(6, 8)
  return new Date(y, m, d)
}
