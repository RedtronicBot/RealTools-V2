import { Info, LoaderCircle } from "lucide-react"
import { useState } from "react"
import { formatNumber } from "../../utils/formatNumber"
import { formatDate } from "../../utils/formatDate"
import { locationRent } from "../../utils/locationRent"
import { findHistory } from "../../utils/findHistory"
import { rentLocation } from "../../utils/rentLocation"
import RentStatusInfo from "../../components/RentStatusInfo"
import { summaryStat } from "../../utils/Dashboard/summaryStat"
import { propertyStat } from "../../utils/Dashboard/propertyStat"
import { rentStat } from "../../utils/Dashboard/rentStat"
import { yieldStat } from "../../utils/Dashboard/yieldStat"
import { rondayStat } from "../../utils/Dashboard/rondayStat"
import FilterOption from "../../components/Dashboard/FilterOption"
import { useTokenStore } from "../../store/TokenStore"
import { useRealtFilters } from "../../hooks/useRealtFilters"
import { useRealtData } from "../../hooks/useRealtData"
import { useDashboardViewModel } from "./DashboardViewModel"
const Dashboard = () => {
  const { token, setToken } = useTokenStore()
  const [rondayProperties, setRondayProperties] = useState<"week" | "month" | "year">("week")
  const { filters, resetFilters, updateFilter } = useRealtFilters()
  const { gnosisToken, realtToken, isLoading, isValidAddress, realtTokenHistory } = useRealtData(token)
  const { filteredProperties, tokenvalue } = useDashboardViewModel(realtToken, gnosisToken, filters)
  const { netValue, realTokenSummary, rwa, rmm } = summaryStat(realtToken ?? [], gnosisToken ?? { location: [], rmm: [] })
  const { averagePriceBought, averageYearlyRent, properties, rentedUnits, tokenCount, totalUnits, averageValue } = propertyStat(
    realtToken ?? [],
    gnosisToken ?? { location: [], rmm: [] },
    realtTokenHistory ?? [],
  )
  const { rentWeekly, rentDaily, rentMonthly, rentYearly } = rentStat(realtToken ?? [], gnosisToken ?? { location: [], rmm: [] })
  const { yieldActual, yieldFull, yieldInitial, yieldRaw } = yieldStat(realtToken ?? [], realtTokenHistory ?? [])
  const { summary, dateSteps } = rondayStat(realtToken ?? [], gnosisToken ?? { location: [], rmm: [] }, rondayProperties)

  if (isLoading)
    return (
      <div className="bg-primary flex min-h-dvh flex-wrap items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <LoaderCircle size={64} className="animate-spin text-white" />
          <p className="text-xl text-white">Chargement</p>
        </div>
      </div>
    )
  return (
    <div className="bg-primary flex min-h-dvh flex-col p-5">
      <div className="absolute top-5 right-5">
        <input className="rounded-lg border border-white" type="text" onChange={(e) => setToken(e.target.value)} />
        {!isValidAddress && token !== "" && <p className="text-sm text-yellow-400">Adresse invalide</p>}
      </div>
      <h1 className="mb-4 text-center text-4xl text-white">Realtools Dashboard</h1>
      <div className="mb-7 flex flex-wrap justify-center gap-4">
        <div className="bg-secondary flex h-[250px] w-[350px] flex-col gap-1.5 rounded-md border border-zinc-500 p-2 text-white">
          <h1 className="text-2xl font-bold">Résumé</h1>
          <div className="flex justify-between">
            <p>Valeur nette</p>
            <p>{formatNumber(netValue, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>RealTokens</p>
            <p>{formatNumber(realTokenSummary, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Dépôt RMM</p>
            <p>{formatNumber(rmm, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>RWA</p>
            <p>{formatNumber(rwa, 2)} $</p>
          </div>
        </div>
        <div className="bg-secondary flex h-[250px] w-[350px] flex-col gap-1.5 rounded-md border border-zinc-500 p-2 text-white">
          <h1 className="text-2xl font-bold">Propriétés</h1>
          <div className="flex justify-between">
            <p>Tokens</p>
            <p>{formatNumber(tokenCount, 2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Propriétés</p>
            <p>{formatNumber(properties, 2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Prix d'achat moyen</p>
            <p>{formatNumber(averagePriceBought, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Valeur moyenne</p>
            <p>{formatNumber(averageValue, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Loyer annuel moyen</p>
            <p>{formatNumber(averageYearlyRent, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Logement loués</p>
            <p>
              {rentedUnits}/{totalUnits} ({formatNumber((rentedUnits / totalUnits) * 100, 2)} %)
            </p>
          </div>
        </div>
        <div className="bg-secondary flex h-[250px] w-[350px] flex-col gap-1.5 rounded-md border border-zinc-500 p-2 text-white">
          <h1 className="text-2xl font-bold">Rendement</h1>
          <div className="flex justify-between">
            <div className="group relative flex items-center gap-1">
              <p>Rendement annuel actuel</p>
              <Info size={24} className="cursor-pointer" />
              <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Prends en compte si le logement est loué
              </span>
            </div>
            <p>{formatNumber(yieldActual, 2)} %</p>
          </div>
          <div className="flex justify-between">
            <div className="group relative flex items-center gap-1">
              <p>Rendement annuel</p>
              <Info size={24} className="cursor-pointer" />
              <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Rendement total sans prendre compte de la date de location
              </span>
            </div>
            <p>{formatNumber(yieldRaw, 2)} %</p>
          </div>
          <div className="flex justify-between">
            <div className="group relative flex items-center gap-1">
              <p>Rendement 100% loué</p>
              <Info size={24} className="cursor-pointer" />
              <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Basée sur le dernier rendement du logement complet ou le rendement initial si jamais louée
              </span>
            </div>
            <p>{formatNumber(yieldFull, 2)} %</p>
          </div>
          <div className="flex justify-between">
            <div className="group relative flex items-center gap-1">
              <p>Rendement initial</p>
              <Info size={24} className="cursor-pointer" />
              <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Rendement donné par RealT
              </span>
            </div>
            <p>{formatNumber(yieldInitial, 2)} %</p>
          </div>
        </div>
        <div className="bg-secondary flex h-[250px] w-[350px] flex-col gap-1.5 rounded-md border border-zinc-500 p-2 text-white">
          <h1 className="text-2xl font-bold">Loyers</h1>
          <div className="flex justify-between">
            <p>Journaliers</p>
            <p>{formatNumber(rentDaily, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Hebdomadaires</p>
            <p>{formatNumber(rentWeekly, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Mensuels</p>
            <p>{formatNumber(rentMonthly, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>Annuels</p>
            <p>{formatNumber(rentYearly, 2)} $</p>
          </div>
        </div>
        <div className="bg-secondary flex h-[250px] w-[350px] flex-col gap-1.5 rounded-md border border-zinc-500 p-2 text-white">
          <div className="flex w-full justify-between">
            <h1 className="text-2xl font-bold">Prochain Loyers</h1>
            <select
              onChange={(e) => setRondayProperties(e.target.value as "week" | "month" | "year")}
              defaultValue="week"
              className="bg-tertiary rounded-lg border border-zinc-500 pl-2 text-lg font-bold"
            >
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
          </div>
          <div className="flex justify-between">
            <p>{dateSteps[0]}</p>
            <p>{formatNumber(summary.firstRonday, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>{dateSteps[1]}</p>
            <p>{formatNumber(summary.secondRonday, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>{dateSteps[2]}</p>
            <p>{formatNumber(summary.thirdRonday, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>{dateSteps[3]}</p>
            <p>{formatNumber(summary.fourthRonday, 2)} $</p>
          </div>
          <div className="flex justify-between">
            <p>{dateSteps[4]}</p>
            <p>{formatNumber(summary.fifthRonday, 2)} $</p>
          </div>
        </div>
      </div>
      <FilterOption filters={filters} resetFilters={resetFilters} updateFilter={updateFilter} />
      <div className="flex w-full flex-wrap justify-center gap-5">
        {filteredProperties?.map((tokens, index) => {
          const tokenContract = (tokens.ethereumContract || tokens.gnosisContract) ?? ""
          return (
            <div key={index} className="bg-secondary w-fit rounded-md border border-zinc-500 text-white">
              <img src={tokens.imageLink[0]} className="h-[150px] w-[450px] rounded-t-md object-cover" />
              <div className="flex flex-col p-2">
                <div className="flex items-center justify-between">
                  <p className="text-xl">{tokens.fullName.split(", ")[0]}</p>
                  <p className="bg-tertiary flex w-[75px] justify-center rounded-full border border-zinc-500 px-1 py-1">
                    {formatNumber(tokens.tokenPrice * tokenvalue(tokenContract), 2)} $
                  </p>
                </div>
                <div className="flex py-1 text-lg"></div>
                <RentStatusInfo status={rentLocation(tokens.rentedUnits, tokens.totalUnits).rented} />
                <div className="flex justify-between">
                  <p>Token</p>
                  <p>
                    {tokenvalue(tokenContract)}/{tokens.totalTokens}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Rendement Annuel</p>
                  <p>{formatNumber(tokens.annualPercentageYield, 2)} %</p>
                </div>
                <div className="flex justify-between">
                  <p>Loyers hebdomadaires</p>
                  <p>{formatNumber(tokens.netRentDayPerToken * 7 * tokenvalue(tokenContract), 2)} $</p>
                </div>
                <div className="flex justify-between">
                  <p>Loyers annuels</p>
                  <p>{formatNumber(tokens.netRentYearPerToken * tokenvalue(tokenContract), 2)} $</p>
                </div>
                <div className="flex justify-between">
                  <p>Logements loués</p>
                  {tokens.rentedUnits !== null && tokens.totalUnits !== null ? (
                    <p>
                      {tokens.rentedUnits}/{tokens.totalUnits} ({formatNumber((tokens.rentedUnits / tokens.totalUnits) * 100, 2)} %)
                    </p>
                  ) : (
                    <p>Non louable</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <p>Date du premier logement</p>
                  {tokens.rentStartDate ? <p>{formatDate(tokens.rentStartDate?.date)}</p> : <p>Non louable</p>}
                </div>
                <div className="flex justify-between">
                  <p>Rendement 100% louée</p>
                  {realtTokenHistory && <p>{locationRent(findHistory(realtTokenHistory, tokenContract), tokens)?.fullrent} %</p>}
                </div>
                <div className="flex justify-between">
                  <p>Rendement initial</p>
                  {realtTokenHistory && <p>{locationRent(findHistory(realtTokenHistory, tokenContract), tokens)?.initialrent} %</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
