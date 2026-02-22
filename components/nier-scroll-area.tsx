"use client"

import { useRef, useState, useCallback, useEffect } from "react"

interface NierScrollAreaProps {
  children: React.ReactNode
  className?: string
}

export function NierScrollArea({ children, className = "" }: NierScrollAreaProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const dragStartY = useRef(0)
  const dragStartScrollTop = useRef(0)

  const updateThumb = useCallback(() => {
    const el = contentRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const canScroll = scrollHeight > clientHeight
    setIsScrollable(canScroll)

    if (!canScroll) return

    const ratio = clientHeight / scrollHeight
    const tHeight = Math.max(ratio * clientHeight, 32)
    const tTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - tHeight)

    setThumbHeight(tHeight)
    setThumbTop(tTop)
  }, [])

  useEffect(() => {
    updateThumb()
    const el = contentRef.current
    if (!el) return

    const observer = new ResizeObserver(updateThumb)
    observer.observe(el)
    // Also observe the scroll content child if it exists
    if (el.firstElementChild) {
      observer.observe(el.firstElementChild)
    }

    return () => observer.disconnect()
  }, [updateThumb])

  const handleScroll = useCallback(() => {
    updateThumb()
  }, [updateThumb])

  // Drag to scroll
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      dragStartY.current = e.clientY
      dragStartScrollTop.current = contentRef.current?.scrollTop ?? 0
    },
    []
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const el = contentRef.current
      if (!el) return

      const { scrollHeight, clientHeight } = el
      const trackHeight = clientHeight
      const deltaY = e.clientY - dragStartY.current
      const scrollRange = scrollHeight - clientHeight
      const thumbRange = trackHeight - thumbHeight
      const scrollDelta = (deltaY / thumbRange) * scrollRange

      el.scrollTop = dragStartScrollTop.current + scrollDelta
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, thumbHeight])

  // Click on track to jump
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const el = contentRef.current
      const track = trackRef.current
      if (!el || !track) return

      const trackRect = track.getBoundingClientRect()
      const clickY = e.clientY - trackRect.top
      const { scrollHeight, clientHeight } = el
      const ratio = clickY / trackRect.height

      el.scrollTop = ratio * (scrollHeight - clientHeight) - clientHeight / 2
    },
    []
  )

  const showThumb = isScrollable && (isHovering || isDragging)

  return (
    <div
      className="relative flex flex-1 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Scrollable content - native scrollbar hidden */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto ${className}`}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {/* Custom scrollbar track */}
      {isScrollable && (
        <div
          ref={trackRef}
          className={`absolute right-0 top-0 bottom-0 z-20 w-2.5 cursor-pointer transition-opacity duration-300 ${
            showThumb ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleTrackClick}
          aria-hidden="true"
        >
          {/* Track background */}
          <div className="absolute inset-0 bg-card/60 border-l border-border/30" />

          {/* Thumb */}
          <div
            className={`absolute left-0.5 right-0.5 transition-colors duration-150 ${
              isDragging
                ? "bg-foreground/60"
                : "bg-muted-foreground/50 hover:bg-foreground/50"
            }`}
            style={{
              height: `${thumbHeight}px`,
              transform: `translateY(${thumbTop}px)`,
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  )
}
