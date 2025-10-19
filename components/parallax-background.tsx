"use client"

import { useEffect, useRef } from "react"

export default function ParallaxBackground() {
  const ref1 = useRef<HTMLDivElement | null>(null)
  const ref2 = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || 0
          // slower movement for parallax effect
          const t1 = `translate3d(${Math.sin(y / 500) * 10}px, ${y * -0.15}px, 0)`
          const t2 = `translate3d(${Math.cos(y / 450) * -12}px, ${y * -0.25}px, 0)`
          if (ref1.current) ref1.current.style.transform = t1
          if (ref2.current) ref2.current.style.transform = t2
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top-right watermark */}
      <div ref={ref1} className="absolute right-[-40px] top-[-40px] opacity-5" style={{ willChange: "transform" }}>
        <img src="/logo.png" alt="" width={240} height={240} className="select-none" />
      </div>
      {/* Bottom-left watermark */}
      <div ref={ref2} className="absolute left-[-20px] bottom-[-20px] opacity-5" style={{ willChange: "transform" }}>
        <img src="/logo.png" alt="" width={180} height={180} className="select-none" />
      </div>
    </div>
  )
}
