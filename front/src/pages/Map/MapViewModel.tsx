import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/apiService"

const useMapViewModel = (address: string) => {
  const { data: realtToken, isLoading: realtLoading } = useQuery({
    queryKey: ["realtToken"],
    queryFn: () => apiService.getRealToken(),
  })
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address)
  const { data: gnosisToken, isLoading: gnosisLoading } = useQuery({
    queryKey: ["gnosisToken"],
    queryFn: () => apiService.getGnosisToken(address),
    enabled: isValidAddress,
  })
  const isLoading = realtLoading || gnosisLoading
  return {
    realtToken,
    gnosisToken,
    isLoading,
  }
}

export default useMapViewModel
