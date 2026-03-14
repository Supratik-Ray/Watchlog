"use client"

import PosterCard from "../PosterCard"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { type CarouselApi } from "@/components/ui/carousel"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"
import { useState } from "react"

type RecommendationCarouselProps = {
  data: any
  type: "movie" | "tv"
}

export default function RecommendationsCarousel({
  data,
  type,
}: RecommendationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  return (
    <div className="relative px-14">
      <Carousel
        setApi={setApi}
        opts={{ slidesToScroll: 4, align: "start", loop: true }}
      >
        <CarouselContent>
          {data.results.map((item) => (
            <CarouselItem key={item.id} className="basis-1/4">
              <PosterCard type={type} item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Custom buttons */}
      <button
        onClick={() => api?.scrollPrev()}
        className="absolute top-1/2 left-0 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card"
      >
        <CaretLeftIcon size={24} />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        className="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card"
      >
        <CaretRightIcon size={24} />
      </button>
    </div>
  )
}
