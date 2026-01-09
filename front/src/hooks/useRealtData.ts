// hooks/domain/useRealtData.ts
import { useQuery } from "@tanstack/react-query"
import { apiService } from "../services/apiService"

export const useRealtData = (address?: string) => {
  const isValidAddress = address ? /^0x[a-fA-F0-9]{40}$/.test(address) : false

  const realtQuery = useQuery({
    queryKey: ["realtToken"],
    queryFn: apiService.getRealToken,
  })

  const historyQuery = useQuery({
    queryKey: ["realtTokenHistory"],
    queryFn: apiService.getRealtTokenHistory,
  })

  const gnosisQuery = useQuery({
    queryKey: ["gnosisToken", address],
    queryFn: () => apiService.getGnosisToken(address!),
    enabled: isValidAddress,
  })

  const isLoading = realtQuery.isLoading || historyQuery.isLoading || gnosisQuery.isLoading

  return {
    realtToken: realtQuery.data,
    realtTokenHistory: historyQuery.data,
    gnosisToken: gnosisQuery.data,
    isValidAddress,
    isLoading,
  }
}
