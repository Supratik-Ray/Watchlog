"use client"

import PosterCard from "../PosterCard"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { type CarouselApi } from "@/components/ui/carousel"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { Recommendations, TvRecommendations } from "tmdb-ts"

type RecommendationCarouselProps = {
  data: Recommendations | TvRecommendations
  type: "movie" | "tv"
}

export default function RecommendationsCarousel({
  data,
  type,
}: RecommendationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  return (
    <div className="relative px-8 sm:px-10 lg:px-14">
      <Carousel
        setApi={setApi}
        opts={{ slidesToScroll: 1, align: "start", loop: true }}
      >
        <CarouselContent>
          {data.results.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-full sm:basis-1/3 lg:basis-1/4"
            >
              <PosterCard type={type} item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        onClick={() => api?.scrollPrev()}
        className="absolute top-1/2 left-0 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card shadow-md sm:h-10 sm:w-10 lg:h-12 lg:w-12"
      >
        <CaretLeftIcon size={18} className="sm:size-5 lg:size-6" />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        className="absolute top-1/2 right-0 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card shadow-md sm:h-10 sm:w-10 lg:h-12 lg:w-12"
      >
        <CaretRightIcon size={18} className="sm:size-5 lg:size-6" />
      </button>
    </div>
  )
}
