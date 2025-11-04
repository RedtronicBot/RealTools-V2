import type { HistoryResponse, RealtToken, TokenTransaction } from "../../types"

export const propertyStat = (
  realtToken: RealtToken[],
  gnosisToken: {
    location: TokenTransaction[]
    rmm: TokenTransaction[]
  },
  realtTokenHistory: HistoryResponse[],
) => {
  const summary = realtToken
    .filter((item) => item.rentStartDate !== null)
    .reduce(
      (acc, loc) => {
        const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""
        const location = gnosisToken.location.find((field) => field.contractAddress === tokenContract)
        const history = realtTokenHistory.find((h) => h.uuid.toLowerCase() === tokenContract)
        const lastTokenPrice = [...(history?.history ?? [])].reverse().find((h) => h.values.tokenPrice !== undefined)?.values.tokenPrice ?? 0
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
  const totalToken = realtToken.filter((item) => item.rentStartDate !== null).length
  summary.averagePriceBought = summary.averagePriceBought / totalToken
  summary.averageYearlyRent = summary.averageYearlyRent / totalToken
  summary.averageValue = summary.averageValue / totalToken
  summary.properties += totalToken
  return summary
}
