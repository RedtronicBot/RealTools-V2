import type { GnosisToken, RealtToken } from "../../types"

// 🧩 Fonction utilitaire : trouver le prochain lundi
function getNextMonday(date = new Date(), inclusive = false): Date {
  const result = new Date(date)
  const day = result.getDay() // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  // distance jusqu'au prochain lundi
  const diff = inclusive
    ? (1 - day + 7) % 7 // 0 si déjà lundi
    : (1 + 7 - day) % 7 || 7 // toujours strictement après
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${day}/${month}/${year}`
}

function getDateSteps(mode: "week" | "month" | "year", steps = 5): string[] {
  const dates: string[] = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  let current = getNextMonday(now) // sert pour le mode "week"

  let base = new Date(now)
  base.setDate(1) // pour le mode "month" et "year"

  for (let i = 0; i < steps; i++) {
    let nextDate: Date

    if (mode === "week") {
      nextDate = new Date(current)
      nextDate.setDate(current.getDate() + i * 7)
    } else if (mode === "month") {
      // Commencer à partir du mois courant (ou celui après si on a sauté)
      let monthBase = new Date(base)
      let firstMonday = getNextMonday(monthBase, true)

      // si ce lundi est avant la date actuelle, on passe au mois suivant
      if (firstMonday <= now) {
        monthBase.setMonth(monthBase.getMonth() + 1)
        firstMonday = getNextMonday(new Date(monthBase), true)
      }

      nextDate = firstMonday
      base = new Date(monthBase)
      base.setMonth(monthBase.getMonth() + 1)
    } else {
      let yearBase = new Date(base)
      yearBase.setMonth(0, 1) // 1er janvier

      let firstMonday = getNextMonday(yearBase, true)

      // Si le premier lundi de cette année est déjà passé, sauter à l’année suivante
      if (firstMonday <= now) {
        yearBase.setFullYear(yearBase.getFullYear() + 1)
        yearBase.setMonth(0, 1)
        firstMonday = getNextMonday(yearBase, true)
      }

      nextDate = firstMonday
      base = new Date(yearBase)
      base.setFullYear(yearBase.getFullYear() + 1)
    }

    dates.push(formatLocalDate(nextDate))
  }

  return dates
}

export const rondayStat = (realtToken: RealtToken[], gnosisToken: GnosisToken, mode: "week" | "month" | "year" = "week") => {
  // 1️⃣ Calcul des dates de palier
  const dateSteps = getDateSteps(mode)

  // 2️⃣ Initialisation du résumé
  const summary = {
    firstRonday: 0,
    secondRonday: 0,
    thirdRonday: 0,
    fourthRonday: 0,
    fifthRonday: 0,
  }

  // 3️⃣ Boucle sur chaque bien
  for (const loc of realtToken) {
    if (!loc.rentStartDate) continue

    const rentDate = new Date(loc.rentStartDate.date.replace(" ", "T"))
    const tokenContract = (loc.gnosisContract?.toLowerCase() || loc.ethereumContract?.toLowerCase()) ?? ""
    const value = gnosisToken.location.find((field) => field.contractAddress === tokenContract)?.value ?? 0
    const rentValue = loc.netRentYearPerToken * value

    // 4️⃣ Boucle sur chaque palier et cumul si le bien est actif
    dateSteps.forEach((palier, index) => {
      const palierDate = new Date(palier.split("/").reverse().join("-")) // convert "DD/MM/YYYY" -> "YYYY-MM-DD"
      if (rentDate <= palierDate) {
        switch (index) {
          case 0:
            summary.firstRonday += rentValue
            break
          case 1:
            summary.secondRonday += rentValue
            break
          case 2:
            summary.thirdRonday += rentValue
            break
          case 3:
            summary.fourthRonday += rentValue
            break
          case 4:
            summary.fifthRonday += rentValue
            break
        }
      }
    })
  }
  const divisor = mode === "week" ? 52 : mode === "month" ? 12 : 1
  summary.firstRonday /= divisor
  summary.secondRonday /= divisor
  summary.thirdRonday /= divisor
  summary.fourthRonday /= divisor
  summary.fifthRonday /= divisor

  return { summary, dateSteps }
}
