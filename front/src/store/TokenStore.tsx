import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TokenState {
  token: string
  setToken: (value: string) => void
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (value) => set({ token: value }),
    }),
    {
      name: "token",
      partialize: ({ token }) => ({ token }),
    },
  ),
)
