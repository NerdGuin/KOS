import { useRef, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import './index.css'

interface CarouselProps {
  children: ReactNode[] | ReactNode
  currentIndex: number
  onChangeIndex: (index: number) => void
}

export default function Carousel({
  children,
  currentIndex,
  onChangeIndex,
}: CarouselProps) {
  const slides = Array.isArray(children) ? children : [children]
  const carouselRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragStartY, setDragStartY] = useState<number | null>(null)
  const [lockAxis, setLockAxis] = useState<'x' | 'y' | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const setIndex = (index: number) => {
    if (index < 0) index = 0
    if (index > slides.length - 1) index = slides.length - 1
    onChangeIndex(index)
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      setDragStartX(clientX)
      setDragStartY(clientY)
      setLockAxis(null)
      setIsDragging(true)
    }

    const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || dragStartX === null || dragStartY === null) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const diffX = clientX - dragStartX
      const diffY = clientY - dragStartY

      if (!lockAxis) setLockAxis(Math.abs(diffX) > Math.abs(diffY) ? 'x' : 'y')

      if (lockAxis === 'x' && carouselRef.current) {
        carouselRef.current.style.transition = 'none'

        let offset = (diffX / carouselRef.current.offsetWidth) * 100
        if (
          (currentIndex === 0 && diffX > 0) ||
          (currentIndex === slides.length - 1 && diffX < 0)
        ) {
          offset = offset / 3
        }

        carouselRef.current.style.transform = `translateX(${-currentIndex * 100 + offset}%)`
        if ('cancelable' in e && e.cancelable) e.preventDefault()
      }
    }

    const endDrag = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || dragStartX === null) return
      setIsDragging(false)
      if (lockAxis !== 'x') return

      const clientX =
        'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
      const diffX = clientX - dragStartX
      const threshold = 50

      if (diffX < -threshold && currentIndex < slides.length - 1) {
        setIndex(currentIndex + 1)
      } else if (diffX > threshold && currentIndex > 0) {
        setIndex(currentIndex - 1)
      } else {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 0.3s ease'
          carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`
        }
      }

      setDragStartX(null)
      setDragStartY(null)
      setLockAxis(null)
    }

    const node = wrapper
    node.addEventListener('touchstart', startDrag as any, { passive: false })
    node.addEventListener('touchmove', onDrag as any, { passive: false })
    node.addEventListener('touchend', endDrag as any)
    node.addEventListener('mousedown', startDrag as any)
    node.addEventListener('mousemove', onDrag as any)
    node.addEventListener('mouseup', endDrag as any)
    node.addEventListener('mouseleave', endDrag as any)

    return () => {
      node.removeEventListener('touchstart', startDrag as any)
      node.removeEventListener('touchmove', onDrag as any)
      node.removeEventListener('touchend', endDrag as any)
      node.removeEventListener('mousedown', startDrag as any)
      node.removeEventListener('mousemove', onDrag as any)
      node.removeEventListener('mouseup', endDrag as any)
      node.removeEventListener('mouseleave', endDrag as any)
    }
  }, [
    dragStartX,
    dragStartY,
    lockAxis,
    isDragging,
    currentIndex,
    slides.length,
  ])

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.3s ease'
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`
    }
  }, [currentIndex])

  return (
    <div className="carousel-wrapper" ref={wrapperRef}>
      <div className="carousel-inner" ref={carouselRef}>
        {slides.map((child, i) => (
          <div className="carousel-slide" key={i}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
