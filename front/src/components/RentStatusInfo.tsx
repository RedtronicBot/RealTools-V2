type RentStatus = "total" | "partial" | "not" | string
const RentStatusInfo = ({ status }: { status: RentStatus }) => {
  const color =
    {
      total: "bg-green-500",
      partial: "bg-orange-500",
      not: "bg-red-500",
      default: "bg-gray-500",
    }[status] || "bg-gray-500"

  const label =
    {
      total: "Loué",
      partial: "Loué partiellement",
      not: "Pas loué",
      default: "Pas louable",
    }[status] || "Pas louable"

  return (
    <div className="bg-tertiary flex w-fit items-center justify-center gap-2 rounded-full border border-zinc-500 px-2 py-0.5">
      <div className={`h-[7px] w-[7px] rounded-full ${color}`}></div>
      <p className="text-white">{label}</p>
    </div>
  )
}

export default RentStatusInfo
