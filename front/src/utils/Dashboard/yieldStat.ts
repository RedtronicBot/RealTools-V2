import type { HistoryResponse, RealtToken } from "../../types"
import { parseHistoryDate } from "../parseHistoryDate"

export const yieldStat = (realtTokens: RealtToken[], realtTokenHistory: HistoryResponse[]) => {
  // Filter out tokens that haven't started generating rent yet
  const activeTokens = realtTokens.filter((t) => t.rentStartDate !== null)

  const today = new Date()

  const summary = activeTokens.reduce(
    (acc, loc) => {
      // Find the corresponding token history by matching the contract address
      const contract = (loc.gnosisContract || loc.ethereumContract || "").toLowerCase()
      const tokenHistory = realtTokenHistory.find((h) => h.uuid.toLowerCase() === contract)?.history

      if (!tokenHistory?.length) return acc
      // Take the earliest recorded history entry as the "initial" state of the investment
      const first = tokenHistory[0].values
      const totalInvestment = first.totalInvestment || 0
      const netRentYearInitial = first.netRentYear || 0

      // --- Initial Yield ---
      // The initial yield provides a baseline to understand how the property's performance started
      // It gives investors a point of comparison for later evolution
      acc.yieldInitial += (netRentYearInitial / totalInvestment) * 100

      // --- Actual Yield ---
      // Instead of taking the last or first value, we find the data point closest to "today"
      // This gives a more realistic picture of the property's *current* yield
      const closestEntry = tokenHistory
        .filter((h) => parseHistoryDate(h.date) <= today)
        .reduce((closest, current) => {
          const cDate = parseHistoryDate(current.date)
          const closestDate = parseHistoryDate(closest.date)
          const diffCurrent = Math.abs(today.getTime() - cDate.getTime())
          const diffClosest = Math.abs(today.getTime() - closestDate.getTime())
          return diffCurrent < diffClosest ? current : closest
        }, tokenHistory[0])
      // Some tokens (like pre-construction) may not yet have a meaningful yield
      // so we fall back to the initial one to avoid distorting averages
      const actualRentYear = closestEntry.values.netRentYear ?? first.netRentYear ?? 0
      const yieldActualBase =
        closestEntry.values.netRentYear === undefined || loc.rentalType === "pre_construction" ? (first.netRentYear ?? 0) : actualRentYear

      acc.yieldActual += (yieldActualBase / totalInvestment) * 100

      // --- Full Yield ---
      // The "full" yield reflects the stabilized, long-term performance of the property —
      // once all units are rented and the property has reached maturity.
      // For loans or pre-construction projects, special rules ensure we pick the right snapshot
      const fullEntry =
        loc.rentalType === "pre_construction"
          ? tokenHistory[0]
          : [...tokenHistory].reverse().find((h) => {
              const v = h.values
              return (
                (v.rentedUnits !== undefined && v.rentedUnits === loc.totalUnits && v.netRentYear !== undefined) ||
                (v.rentedUnits === undefined && v.netRentYear !== undefined) ||
                (loc.productType === "loan_income" && v.netRentYear !== undefined)
              )
            })

      if (fullEntry) {
        acc.yieldFull += ((fullEntry.values.netRentYear ?? 0) / totalInvestment) * 100
      }

      // This value represents the nominal yield advertised by the project
      acc.yieldRaw += loc.annualPercentageYield || 0

      return acc
    },
    { yieldRaw: 0, yieldFull: 0, yieldInitial: 0, yieldActual: 0 },
  )

  const count = activeTokens.length || 1
  Object.keys(summary).forEach((key) => ((summary as any)[key] /= count))

  return summary
}
