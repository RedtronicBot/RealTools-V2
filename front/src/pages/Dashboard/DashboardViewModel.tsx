import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/apiService"
import type { RealtToken } from "../../types"

const useDashboardViewModel = (
  address: string,
  nameInput: string,
  rentedUnits: string,
  rentStarted: null | boolean,
  minValue: number,
  maxValue: number,
  propertyType: string,
) => {
  /*Appel API*/
  const { data: realtToken, isLoading: realtLoading } = useQuery({
    queryKey: ["realtToken"],
    queryFn: () => apiService.getRealToken(),
  })
  const { data: realtTokenHistory, isLoading: realtHistoryLoading } = useQuery({
    queryKey: ["realtTokenHistory"],
    queryFn: () => apiService.getRealtTokenHistory(),
  })
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address)
  const { data: gnosisToken, isLoading: gnosisLoading } = useQuery({
    queryKey: ["gnosisToken"],
    queryFn: () => apiService.getGnosisToken(address),
    enabled: isValidAddress,
  })
  const isLoading = realtLoading || gnosisLoading || realtHistoryLoading

  const addressToDate = new Map(
    gnosisToken?.location?.filter((g) => g?.contractAddress && g?.date).map((g) => [g.contractAddress.toLowerCase(), new Date(g.date)]),
  )
  const hasRentStarted = (realt: RealtToken): boolean | null => {
    if (!realt.rentStartDate) return null

    const now = Date.now()
    const date = realt.rentStartDate.date.replace(" ", "T")
    const rentDate = new Date(date)

    return now > rentDate.getTime()
  }
  const propertyTypeNameSet = [...new Set(realtToken?.map((p) => p.propertyTypeName))].filter((v): v is string => v !== null)
  const sortedOwnedProperties = realtToken
    ?.filter((realt) => {
      const address = realt.ethereumContract?.toLowerCase() || realt.gnosisContract?.toLowerCase()
      if (!address) return false

      const nameMatch = realt.fullName.toLowerCase().includes(nameInput.toLowerCase())

      let categoryMatch = true
      switch (rentedUnits) {
        case "full":
          categoryMatch = realt.rentedUnits === realt.totalUnits
          break

        case "partial":
          categoryMatch = realt.rentedUnits! < realt.totalUnits! && realt.rentedUnits !== 0
          break

        case "empty":
          categoryMatch = realt.rentedUnits === 0
          break
      }

      let rentStartedMatch = true
      if (rentStarted !== null) {
        const started = hasRentStarted(realt)
        rentStartedMatch = started !== null && started === rentStarted
      }
      const yieldMin = minValue / 10
      const yieldMax = maxValue / 10
      const yieldMatch = realt.annualPercentageYield >= yieldMin && realt.annualPercentageYield <= yieldMax

      let propertyMatch = true
      if (propertyType) propertyMatch = realt.propertyTypeName === propertyType
      return addressToDate.has(address) && nameMatch && categoryMatch && rentStartedMatch && yieldMatch && propertyMatch
    })

    .sort((a, b) => {
      const addressA = a.ethereumContract?.toLowerCase() || a.gnosisContract?.toLowerCase()
      const addressB = b.ethereumContract?.toLowerCase() || b.gnosisContract?.toLowerCase()
      if (!addressA || !addressB) return 0
      const dateA = addressToDate.get(addressA)
      const dateB = addressToDate.get(addressB)
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })

  const tokenvalue = (values: string) => gnosisToken?.location.find((locations) => locations.contractAddress === values)?.value ?? 1

  return {
    realtToken,
    sortedOwnedProperties,
    gnosisToken,
    isLoading,
    isValidAddress,
    addressToDate,
    realtTokenHistory,
    tokenvalue,
    propertyTypeNameSet,
  }
}

export default useDashboardViewModel
