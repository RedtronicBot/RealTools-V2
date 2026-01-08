import type { GnosisToken, RealtToken } from "../../types"

export const summaryStat = (realtToken: RealtToken[], gnosisToken: GnosisToken) => {
  const rwaValue =
    gnosisToken.location.find((field) => field.contractAddress.toLowerCase() === "0x0675e8f4a52ea6c845cb6427af03616a2af42170")?.value ?? 0
  const rwaPrice = realtToken.find((field) => field.rentStartDate === null)?.tokenPrice ?? 0
  const rmmValue = gnosisToken.rmm.reduce((sum, tx) => sum + tx.value, 0)
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

        const realTokenVal = loc.tokenPrice * value
        acc.netValue += realTokenVal
        acc.realTokenSummary += realTokenVal

        return acc
      },
      {
        realTokenSummary: 0,
        netValue: 0,
        rwa: 0,
        rmm: 0,
      },
    )
  const rwaTotal = rwaValue * rwaPrice
  summary.rwa = rwaTotal
  summary.netValue += rwaTotal + rmmValue
  summary.rmm += rmmValue
  return summary
}
