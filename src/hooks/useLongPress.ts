import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'

export const LONG_PRESS_MS = 500

// Mantener pulsado: se cancela si el dedo se mueve (scroll) o se suelta antes de tiempo
export function useLongPress(onLongPress: () => void) {
  const timer = useRef<number | undefined>(undefined)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const [pressing, setPressing] = useState(false)

  const cancel = () => {
    window.clearTimeout(timer.current)
    origin.current = null
    setPressing(false)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return {
    pressing,
    handlers: {
      onPointerDown: (e: ReactPointerEvent) => {
        if (e.button !== 0) return
        origin.current = { x: e.clientX, y: e.clientY }
        setPressing(true)
        timer.current = window.setTimeout(() => {
          cancel()
          navigator.vibrate?.(30)
          onLongPress()
        }, LONG_PRESS_MS)
      },
      onPointerMove: (e: ReactPointerEvent) => {
        if (origin.current && Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 10) cancel()
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e: ReactMouseEvent) => e.preventDefault(),
    },
  }
}
