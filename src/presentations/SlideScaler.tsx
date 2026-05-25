import { useEffect, useRef, useState } from 'react'

interface Props {
  slideWidth: number
  slideHeight: number
  children: React.ReactNode
  allowUpscale?: boolean
}

export function SlideScaler({ slideWidth, slideHeight, children, allowUpscale = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const compute = (w: number) => {
      if (w > 0) setScale(allowUpscale ? w / slideWidth : Math.min(1, w / slideWidth))
    }

    // Initial value
    compute(el.getBoundingClientRect().width)

    const ro = new ResizeObserver(entries => {
      compute(entries[0].contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [slideWidth])

  return (
    /*
     * aspect-ratio keeps the container at exactly the right height
     * for any width — in CSS, with zero JS latency.
     * overflow:hidden + position:relative clip the abs-positioned inner div.
     */
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: `${slideWidth} / ${slideHeight}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/*
       * position:absolute removes the slide from normal flow so it
       * cannot affect the outer container's measured width.
       * transform:scale() then shrinks the visual rendering to fit.
       */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: slideWidth,
          height: slideHeight,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
