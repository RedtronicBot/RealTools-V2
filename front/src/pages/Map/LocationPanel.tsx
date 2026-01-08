import { X } from "lucide-react"
import type { GnosisToken, RealtToken } from "../../types"
import ImageCarousel from "../../components/Map/ImageCaroussel"
import { formatNumber } from "../../utils/formatNumber"
import { formatDate } from "../../utils/formatDate"
type Props = {
  location: RealtToken
  gnosisToken: GnosisToken
  onClose: () => void
}

const LocationPanel = ({ location, gnosisToken, onClose }: Props) => {
  if (!location) return null
  const rented = location.rentedUnits ?? 0
  const total = location.totalUnits ?? 1
  const locationValueByContract = gnosisToken.location.reduce(
    (acc, loc) => {
      acc[loc.contractAddress] = (acc[loc.contractAddress] ?? 0) + loc.value
      return acc
    },
    {} as Record<string, number>,
  )
  const tokenContract = (location.gnosisContract?.toLowerCase() || location.ethereumContract?.toLowerCase()) ?? ""
  const value = locationValueByContract[tokenContract] ?? 0
  return (
    <div className="bg-primary absolute top-0 right-0 z-[1000] h-full w-[400px] text-center text-white shadow-xl">
      <button className="absolute top-2 left-2 z-10 cursor-pointer rounded-full bg-black/50 p-2" onClick={onClose}>
        <X />
      </button>
      <ImageCarousel key={location.gnosisContract} images={location.imageLink} />
      <div className="flex flex-col items-center gap-2 p-2">
        <h3 className="text-lg font-bold">{location.fullName}</h3>
        <div className="flex w-full justify-between">
          <a href={location.marketplaceLink} target="_blank" rel="noopener noreferrer" className="bg-secondary rounded-lg border border-zinc-500 p-2">
            RealT
          </a>
          <a
            href={`https://dashboard.realtoken.community/asset/${location.gnosisContract}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary rounded-lg border border-zinc-500 p-2"
          >
            Dashboard
          </a>
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.coordinate.lat},${location.coordinate.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary rounded-lg border border-zinc-500 p-2"
          >
            Google Street View
          </a>
        </div>
        <h4 className="text-md font-bold">Loyer</h4>
        <div className="flex w-full justify-between">
          <p>Logement loués</p>
          <p>
            {location.rentedUnits}/{location.totalUnits} ({formatNumber((rented / total) * 100, 2)} %)
          </p>
        </div>
        <div className="flex w-full justify-between">
          <p>Rendement</p>
          <p>{formatNumber(location.annualPercentageYield, 2)} %</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Loyer hebdomadaire</p>
          <p>{formatNumber(location.netRentDayPerToken * 7 * value, 2)} %</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Loyer annuel</p>
          <p>{formatNumber(location.netRentYearPerToken * value, 2)} %</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Mise en location</p>
          {location.rentStartDate ? <p>{formatDate(location.rentStartDate?.date)}</p> : <p>Non louable</p>}
        </div>
        <div className="flex w-full justify-between">
          <p>Type de location</p>
          <p>{location.rentalType.split("_").join(" ")}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Investissement total</p>
          <p>{location.totalInvestment} $</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Token possédé</p>
          <p>{formatNumber(value, 3)}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Prix du token</p>
          <p>{formatNumber(location.tokenPrice, 2)} $</p>
        </div>
        <h4 className="text-md font-bold">Détails</h4>
        <div className="flex w-full justify-between">
          <p>Type de propriété</p>
          <p>{location.propertyTypeName ?? "Non Défini"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Lit/Salle de bain</p>
          <p>{location.bedroomBath ?? "Non Défini"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Année de construction</p>
          <p>{location.constructionYear ?? "Non Défini"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p>Superficie cadastrale</p>
          <p>{location.squareFeet ?? "Non Défini"} ft²</p>
        </div>
        {location.section8paid !== 0 && (
          <div className="flex w-full justify-between">
            <p>Section 8</p>
            <p>{location.section8paid} $</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationPanel
