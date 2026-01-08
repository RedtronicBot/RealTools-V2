import type { GnosisToken, HistoryResponse, RealtToken } from "../../types"

export const propertyStat = (realtToken: RealtToken[], gnosisToken: GnosisToken, realtTokenHistory: HistoryResponse[]) => {
  const validTokens = realtToken.filter((t) => t.rentStartDate !== null)

  const locationValueByContract = gnosisToken.location.reduce(
    (acc, loc) => {
      acc[loc.contractAddress] = (acc[loc.contractAddress] ?? 0) + loc.value
      return acc
    },
    {} as Record<string, number>,
  )

  const summary = validTokens.reduce(
    (acc, loc) => {
      const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""

      const totalValue = locationValueByContract[tokenContract] ?? 0
      if (!totalValue) return acc

      const history = realtTokenHistory.find((h) => h.uuid.toLowerCase() === tokenContract)?.history

      if (!history?.length) return acc

      const lastTokenPrice = [...history].reverse().find((h) => h.values.tokenPrice !== undefined)?.values.tokenPrice ?? 0

      acc.tokenCount += totalValue
      acc.averagePriceBought += loc.tokenPrice
      acc.averageYearlyRent += loc.netRentYearPerToken * totalValue
      acc.rentedUnits += loc.rentedUnits ?? 0
      acc.totalUnits += loc.totalUnits ?? 0
      acc.averageValue += lastTokenPrice

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

  summary.averagePriceBought /= summary.tokenCount || 1
  summary.averageYearlyRent /= summary.tokenCount || 1
  summary.averageValue /= summary.tokenCount || 1
  summary.properties += validTokens.length

  return summary
}
