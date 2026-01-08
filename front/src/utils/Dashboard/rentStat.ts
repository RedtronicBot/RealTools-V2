import type { GnosisToken, RealtToken } from "../../types"

export const rentStat = (realtToken: RealtToken[], gnosisToken: GnosisToken) => {
  const locationValueByContract = gnosisToken.location.reduce(
    (acc, loc) => {
      acc[loc.contractAddress] = (acc[loc.contractAddress] ?? 0) + loc.value
      return acc
    },
    {} as Record<string, number>,
  )
  const summary = realtToken
    .filter((item) => item.rentStartDate !== null)
    .reduce(
      (acc, loc) => {
        const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""

        const value = locationValueByContract[tokenContract] ?? 0
        if (!value) return acc

        acc.rentDaily = loc.netRentDayPerToken * value
        acc.rentWeekly = loc.netRentDayPerToken * value * 7
        acc.rentMonthly = loc.netRentMonthPerToken * value
        acc.rentYearly = loc.netRentYearPerToken * value

        return acc
      },
      {
        rentWeekly: 0,
        rentYearly: 0,
        rentMonthly: 0,
        rentDaily: 0,
      },
    )

  return summary
}
