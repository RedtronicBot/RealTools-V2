import type { HistoryResponse, RealtToken, TokenTransaction } from "../../types"

export const propertyStat = (
  realtToken: RealtToken[],
  gnosisToken: {
    location: TokenTransaction[]
    rmm: TokenTransaction[]
  },
  realtTokenHistory: HistoryResponse[],
) => {
  const validTokens = realtToken.filter((t) => t.rentStartDate !== null)
  const summary = validTokens
    .filter((item) => item.rentStartDate !== null)
    .reduce(
      (acc, loc) => {
        const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""
        const location = gnosisToken.location.find((field) => field.contractAddress === tokenContract)
        const history = realtTokenHistory.find((h) => h.uuid.toLowerCase() === tokenContract)?.history

        if (!history?.length) return acc

        const lastTokenPrice = [...history].reverse().find((h) => h.values.tokenPrice !== undefined)?.values.tokenPrice ?? 0
        if (location) {
          acc.tokenCount += location.value
          acc.averagePriceBought += loc.tokenPrice
          acc.averageYearlyRent += loc.netRentYearPerToken * location.value
          acc.rentedUnits += loc.rentedUnits ?? 0
          acc.totalUnits += loc.totalUnits ?? 0
          acc.averageValue += lastTokenPrice
        }
        return acc
      },
      {
        tokenCount: 0,
        averagePriceBought: 0,
        averageYearlyRent: 0,
        rentedUnits: 0,
        totalUnits: 0,
        properties: 0,
        averageValue: 0,
      },
    )
  summary.averagePriceBought = summary.averagePriceBought / summary.tokenCount
  summary.averageYearlyRent = summary.averageYearlyRent / summary.tokenCount
  summary.averageValue = summary.averageValue / summary.tokenCount
  summary.properties += validTokens.length
  return summary
}
