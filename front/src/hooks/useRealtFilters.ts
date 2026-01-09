import { useState } from "react"

export type RealtFilters = {
  category: "" | "full" | "partial" | "empty"
  searchName: string
  rentStarted: boolean | null
  minValue: number
  maxValue: number
  propertyType: string
}

export const defaultFilters: RealtFilters = {
  category: "",
  searchName: "",
  rentStarted: null,
  minValue: 0,
  maxValue: 150,
  propertyType: "",
}
export const useRealtFilters = () => {
  const [filters, setFilters] = useState<RealtFilters>(defaultFilters)

  const updateFilter = <K extends keyof RealtFilters>(key: K, value: RealtFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => setFilters(defaultFilters)

  return {
    filters,
    updateFilter,
    resetFilters,
  }
}
