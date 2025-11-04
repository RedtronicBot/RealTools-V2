export const rentLocation = (rentedUnit: number | null, totalUnit: number | null) => {
  if (rentedUnit === null || totalUnit === null) return { rented: "none", percent: 0 }
  const percent = (rentedUnit / totalUnit) * 100
  const rented = percent === 100 ? "total" : percent < 100 && percent > 0 ? "partial" : "not"
  return { rented, percent }
}
