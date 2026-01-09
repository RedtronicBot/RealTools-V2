import type { RealtFilters } from "../../hooks/useRealtFilters"
import type { GnosisToken, RealtToken } from "../../types"

export const useDashboardViewModel = (realtToken?: RealtToken[], gnosisToken?: GnosisToken, filters?: RealtFilters) => {
  const hasRentStarted = (realt: RealtToken): boolean | null => {
    if (!realt.rentStartDate) return null
    const now = Date.now()
    const date = realt.rentStartDate.date.replace(" ", "T")
    const rentDate = new Date(date)
    return now > rentDate.getTime()
  }
  const tokenvalue = (values: string) => gnosisToken?.location.find((locations) => locations.contractAddress === values)?.value ?? 1
  const filteredProperties = realtToken?.filter((realt) => {
    if (!filters) return true

    if (filters.searchName && !realt.fullName.toLowerCase().includes(filters.searchName.toLowerCase())) return false

    if (filters.category === "full" && realt.rentedUnits !== realt.totalUnits) return false

    if (filters.rentStarted !== null) {
      const started = hasRentStarted(realt)
      if (started !== filters.rentStarted) return false
    }

    const yieldValue = realt.annualPercentageYield
    if (yieldValue < filters.minValue / 10 || yieldValue > filters.maxValue / 10) return false

    if (filters.propertyType && realt.propertyTypeName !== filters.propertyType) return false

    return true
  })

  return { filteredProperties, tokenvalue }
}
