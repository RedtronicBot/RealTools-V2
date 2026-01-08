export type PropertyType = "SingleFamily" | "MultiFamily" | "Duplex" | "SFR Portfolio" | "Condominium" | "Quadplex" | "Commercial"

export const normalizePropertyType = (raw?: string | null): PropertyType | null => {
  if (!raw) return null

  const value = raw.toLowerCase().trim()

  if (value === "single family") return "SingleFamily"
  if (value === "multi family") return "MultiFamily"
  if (value === "duplex") return "Duplex"
  if (value === "sfr portfolio") return "SFR Portfolio"
  if (value === "condominium") return "Condominium"
  if (value === "quadplex") return "Quadplex"
  if (value === "commercial") return "Commercial"

  return null
}
