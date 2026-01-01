import { Filter, RefreshCcw } from "lucide-react"
import { useState, type Dispatch, type SetStateAction } from "react"

type FilterOptionProps = {
  category: string
  setCategory: (value: string) => void
  setSearchName: (value: string) => void
  rentStarted: null | boolean
  setRentStarted: Dispatch<SetStateAction<boolean | null>>
  minValue: number
  maxValue: number
  setMinValue: (value: number) => void
  setMaxValue: (value: number) => void
  setPropertyType: (value: string) => void
  propertyTypeNameSet: string[] | null
  resetFilters: () => void
  propertyType: string
}
const FilterOption = ({
  category,
  setCategory,
  setSearchName,
  setRentStarted,
  rentStarted,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
  setPropertyType,
  propertyTypeNameSet,
  propertyType,
  resetFilters,
}: FilterOptionProps) => {
  const [open, setOpen] = useState(false)
  const MIN = 0
  const MAX = 150
  const STEP = 5

  return (
    <div className="flex gap-4 px-2 py-7">
      <input
        onChange={(e) => setSearchName(e.target.value)}
        className="bg-secondary h-10 rounded-lg border border-zinc-500 pl-2 text-lg text-white"
      />
      <div className="relative flex">
        <div
          className="bg-secondary flex w-[45px] items-center justify-center rounded-lg border border-zinc-500 text-white"
          onClick={() => setOpen(!open)}
        >
          <Filter size={22} />
        </div>

        {open && (
          <div className="bg-secondary before:bg-secondary absolute top-13 left-0 flex w-[250px] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-500 p-2 text-white before:absolute before:-top-2 before:left-4 before:h-4 before:w-4 before:rotate-45 before:border-t before:border-l before:border-zinc-500 before:content-['']">
            <h2 className="text-lg font-bold">Logement loués</h2>
            <div className="flex gap-2">
              {[
                { name: "full", desc: "Plein" },
                { name: "partial", desc: "Partiel" },
                { name: "empty", desc: "Vide" },
              ].map((value) => (
                <label key={value.name} className="flex flex-col-reverse">
                  <input
                    type="radio"
                    name="option"
                    value={value.name}
                    checked={category === value.name}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  {value.desc}
                </label>
              ))}
            </div>

            <h2 className="text-lg font-bold">Rendement</h2>
            <div className="flex flex-col items-center">
              <p>
                {minValue / 10}% - {maxValue / 10}%
              </p>
              <div className="relative h-6 w-[240px]">
                {/* Track */}
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-zinc-600" />

                {/* Range actif */}
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-white"
                  style={{
                    left: `${(minValue / MAX) * 100}%`,
                    right: `${100 - (maxValue / MAX) * 100}%`,
                  }}
                />

                {/* Slider min */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={minValue}
                  onChange={(e) => setMinValue(Math.min(+e.target.value, maxValue - STEP))}
                  className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                  style={{ zIndex: minValue > MAX - (MAX - MIN) / 2 ? 5 : 3 }}
                />

                {/* Slider max */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={maxValue}
                  onChange={(e) => setMaxValue(Math.max(+e.target.value, minValue + STEP))}
                  className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                  style={{ zIndex: maxValue < (MAX - MIN) / 2 ? 5 : 4 }}
                />
              </div>
            </div>
            <h2 className="text-lg font-bold">Mise en location</h2>
            <div className="flex items-center gap-2">
              <p>Entamé</p>
              <div
                className={`flex h-[20px] w-[40px] items-center justify-center rounded-2xl border border-white`}
                onClick={() =>
                  setRentStarted((prev) => {
                    if (prev === null) return true
                    return !prev
                  })
                }
              >
                <div
                  className={`h-[14px] w-[14px] rounded-full border border-white transition-all duration-500 ease-in-out ${
                    rentStarted === true ? "-translate-x-2" : rentStarted === false ? "translate-x-2" : ""
                  } `}
                ></div>
              </div>
              <p>Non entamé</p>
            </div>
            <h2 className="text-lg font-bold">Type de propriété</h2>
            <select
              value={propertyType || "reset"}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-tertiary rounded-lg border border-zinc-500 p-2 text-lg font-bold"
            >
              <option hidden value="reset">
                -Choisir un type-
              </option>
              {propertyTypeNameSet?.map((property, index) => (
                <option key={index} value={property}>
                  {property}
                </option>
              ))}
            </select>
            <button onClick={resetFilters}>
              <RefreshCcw />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterOption
