import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/apiService"

const useDashboardViewModel = (address: string) => {
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

  const sortedOwnedProperties = realtToken
    ?.filter((realt) => {
      const address = realt.ethereumContract?.toLocaleLowerCase() || realt.gnosisContract?.toLocaleLowerCase()
      if (!address) return false
      return addressToDate.has(address)
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
  }
}

export default useDashboardViewModel
