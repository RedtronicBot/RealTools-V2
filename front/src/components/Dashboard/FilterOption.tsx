import { Filter, RefreshCcw } from "lucide-react"
import { useState } from "react"
import type { RealtFilters } from "../../hooks/useRealtFilters"

type FilterOptionProps = {
  filters: RealtFilters
  updateFilter: <K extends keyof RealtFilters>(key: K, value: RealtFilters[K]) => void
  resetFilters: () => void
  propertyTypeNameSet?: string[]
}
const FilterOption = ({ filters, updateFilter, resetFilters, propertyTypeNameSet }: FilterOptionProps) => {
  const [open, setOpen] = useState(false)

  const MIN = 0
  const MAX = 150
  const STEP = 5

  return (
    <div className="flex gap-4 px-2 py-7">
      <input
        onChange={(e) => updateFilter("searchName", e.target.value)}
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
                    name="category"
                    value={value.name}
                    checked={filters.category === value.name}
                    onChange={(e) => updateFilter("category", e.target.value as RealtFilters["category"])}
                  />
                  {value.desc}
                </label>
              ))}
            </div>

            <h2 className="text-lg font-bold">Rendement</h2>
            <div className="flex flex-col items-center">
              <p>
                {filters.minValue / 10}% - {filters.maxValue / 10}%
              </p>
              <div className="relative h-6 w-[240px]">
                {/* Track */}
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-zinc-600" />

                {/* Range actif */}
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-white"
                  style={{
                    left: `${(filters.minValue / MAX) * 100}%`,
                    right: `${100 - (filters.maxValue / MAX) * 100}%`,
                  }}
                />

                {/* Slider min */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={filters.minValue}
                  onChange={(e) => updateFilter("minValue", Math.min(+e.target.value, filters.maxValue - STEP))}
                  className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                />

                {/* Slider max */}
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={filters.maxValue}
                  onChange={(e) => updateFilter("maxValue", Math.max(+e.target.value, filters.minValue + STEP))}
                  className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                />
              </div>
            </div>
            <h2 className="text-lg font-bold">Mise en location</h2>
            <div
              className="flex h-[20px] w-[40px] items-center justify-center rounded-2xl border border-white"
              onClick={() => {
                const next = filters.rentStarted === null ? true : !filters.rentStarted

                updateFilter("rentStarted", next)
              }}
            >
              <div
                className={`h-[14px] w-[14px] rounded-full border border-white transition-all duration-500 ease-in-out ${
                  filters.rentStarted === true ? "-translate-x-2" : filters.rentStarted === false ? "translate-x-2" : ""
                }`}
              />
            </div>
            <h2 className="text-lg font-bold">Type de propriété</h2>
            <select
              value={filters.propertyType || "reset"}
              onChange={(e) => updateFilter("propertyType", e.target.value === "reset" ? "" : e.target.value)}
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
