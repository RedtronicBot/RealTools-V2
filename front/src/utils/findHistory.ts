import type { HistoryResponse } from "../types"

export const findHistory = (history: HistoryResponse[], contract: string) => {
  return history.find((his) => his.uuid.toLowerCase() === contract.toLowerCase())?.history
}
