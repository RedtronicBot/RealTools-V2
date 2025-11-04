import type { HistoryResponse, RealtToken } from "../types"
import { formatNumber } from "./formatNumber"

export const locationRent = (history: HistoryResponse["history"] | undefined, token: RealtToken) => {
  if (!history) return
  for (var i = history?.length - 1; i >= 0; i--) {
    const entry = history[i]
    const rentedUnits = entry.values.rentedUnits
    const netRentYear = entry.values.netRentYear
    const totalInvestment = history[0].values.totalInvestment
    if (rentedUnits && (rentedUnits === token.totalUnits || token.productType === "pre_contruction" || token.productType === "loan_income")) {
      if (token.productType === "pre_contruction" && history[0].values.netRentYear && totalInvestment) {
        return {
          initialrent: formatNumber((history[0].values.netRentYear / totalInvestment) * 100, 2),
          fullrent: formatNumber((history[0].values.netRentYear / totalInvestment) * 100, 2),
        }
      } else if (netRentYear && totalInvestment && history[0].values.netRentYear) {
        return {
          initialrent: formatNumber((history[0].values.netRentYear / totalInvestment) * 100, 2),
          fullrent: formatNumber((netRentYear / totalInvestment) * 100, 2),
        }
      }
    }
  }
}
