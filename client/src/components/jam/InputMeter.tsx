import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react'
import { semanticColors, layout } from '@ds/tokens/design-tokens'
import { useTheme } from '../../contexts/ThemeContext'

export interface InputMeterHandle {
  setLevel: (value: number) => void
  flash: () => void
}

interface InputMeterProps {
  width?: number
  height?: number
}

const InputMeter = forwardRef<InputMeterHandle, InputMeterProps>(
  function InputMeter({ width = 12, height = 120 }, ref) {
    const { theme } = useTheme()
    const barRef = useRef<HTMLDivElement>(null)
    const flashRef = useRef<HTMLDivElement>(null)
    const levelRef = useRef(0)
    const rafRef = useRef(0)

    useImperativeHandle(ref, () => ({
      setLevel(value: number) {
        levelRef.current = Math.max(0, Math.min(127, value))
      },
      flash() {
        const el = flashRef.current
        if (!el) return
        el.style.opacity = '1'
        setTimeout(() => {
          if (flashRef.current) flashRef.current.style.opacity = '0'
        }, 80)
      },
    }))

    useEffect(() => {
      function tick() {
        const bar = barRef.current
        if (bar) {
          const pct = (levelRef.current / 127) * 100
          bar.style.height = `${pct}%`
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    }, [])

    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          borderRadius: layout.radiusXs,
          background: theme.surfaceDisabled,
          overflow: 'hidden',
        }}
      >
        {/* Level bar */}
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '0%',
            background: semanticColors.buttonSurfacePrimary,
            borderRadius: layout.radiusXs,
            transition: 'none',
          }}
        />
        {/* Flash overlay */}
        <div
          ref={flashRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: semanticColors.strokeColour,
            opacity: 0,
            transition: 'opacity 120ms ease-out',
            borderRadius: layout.radiusXs,
          }}
        />
      </div>
    )
  },
)

export default InputMeter
