import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import useDashboardViewModel from "./DashboardViewModel"
import { formatNumber } from "../../utils/formatNumber"
import { formatDate } from "../../utils/formatDate"
import { locationRent } from "../../utils/locationRent"
import { findHistory } from "../../utils/findHistory"
import { rentLocation } from "../../utils/rentLocation"
import RentStatusInfo from "../../components/RentStatusInfo"
import { summaryStat } from "../../utils/Dashboard/summaryStat"
import { propertyStat } from "../../utils/Dashboard/propertyStat"
const Dashboard = () => {
  const [value, setValue] = useState("")
  const { sortedOwnedProperties, isLoading, isValidAddress, realtTokenHistory, tokenvalue, realtToken, gnosisToken } = useDashboardViewModel(value)
  const { netValue, realTokenSummary, rwa, rmm } = summaryStat(realtToken ?? [], gnosisToken ?? { location: [], rmm: [] })
  const { averagePriceBought, averageYearlyRent, properties, rentedUnits, tokenCount, totalUnits, averageValue } = propertyStat(
    realtToken ?? [],
    gnosisToken ?? { location: [], rmm: [] },
    realtTokenHistory ?? [],
  )
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
        <input className="rounded-lg border border-white" type="text" onChange={(e) => setValue(e.target.value)} />
        {!isValidAddress && value !== "" && <p className="text-sm text-yellow-400">Adresse invalide</p>}
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="bg-secondary w-[350px] rounded-md border border-zinc-500 p-2 text-white">
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
        <div className="bg-secondary w-[350px] rounded-md border border-zinc-500 p-2 text-white">
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
            <p>{formatNumber(averagePriceBought, 2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Valeur moyenne</p>
            <p>{formatNumber(averageValue, 2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Loyer annuel moyen</p>
            <p>{formatNumber(averageYearlyRent, 2)}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-5">
        {sortedOwnedProperties?.map((tokens, index) => {
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
