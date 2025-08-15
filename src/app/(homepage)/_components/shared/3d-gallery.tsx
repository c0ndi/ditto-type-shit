/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'

type Card = {
  id: number
  imgSrc: string
}

type Props = {
  images: string[]
}

export function ThreeDGallery({ images }: Props) {
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    const newCards = images.map((img, index) => ({
      id: index + 1,
      imgSrc: `/arc-gallery/${img}`,
    }))
    setCards(newCards)

    const handleScroll = () => {
      const scrollPos = window.scrollY
      const slider = document.querySelector('.slider')!
      if (!slider) return

      const initialTransform =
        'translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(-25deg) rotateZ(-120deg)'
      const zOffset = scrollPos * 0.5
        ; (slider as HTMLElement).style.transform = `${initialTransform} translateY(${zOffset}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [images])

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.left = '15%'
  }

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.left = '0%'
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSlide = Math.floor(Math.random() * cards.length)

      console.log(randomSlide)

      const card = document.getElementById(`card-${randomSlide}`)!
      card.style.left = '15%'

      setTimeout(() => {
        card.style.left = '0%'
      }, 1000)
    }, 3000)

    return () => clearInterval(interval)
  }, [cards.length])

  return (
    <div
      className="slider fixed top-1/2 left-1/2 [transform:translate3d(-50%,-50%,0)_rotateX(0deg)_rotateY(-25deg)_rotateZ(-120deg)] [transform-style:preserve-3d] transition-[transform] duration-1000 [transition-timing-function:cubic-bezier(0.075,0.82,0.165,1)] select-none will-change-transform"
      aria-label="3D image slider"
    >
      {cards.map((card) => (
        <div
          key={card.id}
          id={`card-${card.id}`}
          className="relative size-[400px] [transform:rotateX(20deg)_rotateY(-10deg)_rotateZ(130deg)] border border-white/25 rounded-xl overflow-hidden my-[-300px] transition-[transform,left] duration-1000 [transition-timing-function:cubic-bezier(0.075,0.82,0.165,1)] left-[0%]"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <img
            src={card.imgSrc || '/placeholder.svg'}
            alt={`Image ${card.id}`}
            className="w-full h-full object-cover block pointer-events-none"
          />
        </div>
      ))}
    </div>
  )
}
