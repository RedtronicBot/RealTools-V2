import type { GnosisToken, RealtToken } from "../../types"

export const rentStat = (realtToken: RealtToken[], gnosisToken: GnosisToken) => {
  const summary = realtToken
    .filter((item) => item.rentStartDate !== null)
    .reduce(
      (acc, loc) => {
        const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""

        const value = gnosisToken.location.find((field) => field.contractAddress === tokenContract)?.value

        if (value) {
          acc.rentDaily = loc.netRentDayPerToken * value
          acc.rentWeekly = loc.netRentDayPerToken * value * 7
          acc.rentMonthly = loc.netRentMonthPerToken * value
          acc.rentYearly = loc.netRentYearPerToken * value
        }

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
