import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

type Props = {
  images: string[]
}

const ImageCarousel = ({ images }: Props) => {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) {
    return <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">No image</div>
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))

  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative w-full overflow-hidden">
      {/* Image */}
      <img src={images[current]} alt={`image-${current}`} className="h-64 w-full object-cover" />

      {/* Previous */}
      {images.length > 1 && (
        <button onClick={prev} className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white">
          <ChevronLeft />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button onClick={next} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white">
          <ChevronRight />
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
