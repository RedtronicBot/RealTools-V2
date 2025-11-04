import type { HistoryResponse, RealtToken, TokenTransaction } from "../types"
import { useApi } from "../api/axios"
const api = useApi()
export const apiService = {
  getRealToken: async (): Promise<RealtToken[]> => {
    const { data } = await api.get("token/realt")
    return data
  },
  getGnosisToken: async (
    address: string,
  ): Promise<{
    location: TokenTransaction[]
    rmm: TokenTransaction[]
  }> => {
    const { data } = await api.get(`token/gnosisscan/${address}`)
    return data
  },
  getRealtTokenHistory: async (): Promise<HistoryResponse[]> => {
    const { data } = await api.get("history")
    return data
  },
}
