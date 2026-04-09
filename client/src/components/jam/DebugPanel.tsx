import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import BasicButton from '../BasicButton'
import { Tag } from '@ds/Components/tag/Tag.1.0.0'
import Icon from '@ds/Components/icon/Icon.1.1.0'
import { useTheme } from '../../contexts/ThemeContext'
import type { TransportType } from '../../lib/webrtc'
import type { Synth, ExpressionConfig } from '../../lib/synth'

const FONT = `${fontFamily}, sans-serif`
const SIGNAL_URL = import.meta.env.VITE_SIGNAL_URL ?? ''
const IS_TUNNEL = SIGNAL_URL.includes('ngrok')

export interface DebugPanelHandle {
  pushCC11: (raw: number, mapped: number) => void
}

export interface DebugPanelProps {
  rtt: number | null
  oneWay: number | null
  jitter: number | null
  samplesRef: React.RefObject<number[]>
  transportType: TransportType
  synth: Synth | null
  waveform: OscillatorType
  onWaveformChange: (w: OscillatorType) => void
}

// ─── Sparkline (rAF-driven SVG) ─────────────────────────────────

function Sparkline({ samplesRef }: { samplesRef: React.RefObject<number[]> }) {
  const { theme } = useTheme()
  const polyRef = useRef<SVGPolylineElement>(null)

  useEffect(() => {
    let raf = 0
    function tick() {
      const el = polyRef.current
      const samples = samplesRef.current
      if (el && samples && samples.length > 1) {
        const max = Math.max(...samples, 1)
        const pts = samples
          .map((s, i) => `${(i / 59) * 200},${40 - (s / max) * 36}`)
          .join(' ')
        el.setAttribute('points', pts)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [samplesRef])

  return (
    <svg
      width={200}
      height={40}
      viewBox="0 0 200 40"
      style={{ background: theme.surfaceDisabled, borderRadius: layout.radiusXs }}
    >
      <polyline
        ref={polyRef}
        fill="none"
        stroke={semanticColors.buttonSurfacePrimary}
        strokeWidth={layout.strokeM}
      />
    </svg>
  )
}

// ─── Curve visualiser ────────────────────────────────────────────

function CurveVis({ curve }: { curve: ExpressionConfig['curve'] }) {
  const { theme } = useTheme()
  const steps = 40
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    let y: number
    switch (curve) {
      case 'exponential':
        y = x * x
        break
      case 'logarithmic':
        y = Math.sqrt(x)
        break
      default:
        y = x
    }
    pts.push(`${x * 80},${40 - y * 36}`)
  }
  return (
    <svg
      width={80}
      height={40}
      viewBox="0 0 80 40"
      style={{ background: theme.surfaceDisabled, borderRadius: layout.radiusXs }}
    >
      <polyline fill="none" stroke={semanticColors.buttonSurfacePrimary} strokeWidth={layout.strokeM} points={pts.join(' ')} />
    </svg>
  )
}

// ─── CC11 monitor bars (rAF-driven) ─────────────────────────────

function CC11Monitor({ rawRef, mappedRef }: { rawRef: React.RefObject<number>; mappedRef: React.RefObject<number> }) {
  const { theme } = useTheme()
  const rawBar = useRef<HTMLDivElement>(null)
  const mapBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    function tick() {
      if (rawBar.current) rawBar.current.style.height = `${((rawRef.current ?? 0) / 127) * 100}%`
      if (mapBar.current) mapBar.current.style.height = `${(mappedRef.current ?? 0) * 100}%`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rawRef, mappedRef])

  const barContainer: React.CSSProperties = {
    width: 20,
    height: 48,
    background: theme.surfaceDisabled,
    borderRadius: layout.radiusXs,
    position: 'relative',
    overflow: 'hidden',
  }
  const barInner: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: semanticColors.buttonSurfacePrimary,
    borderRadius: layout.radiusXs,
  }

  return (
    <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'flex-end' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={barContainer}>
          <div ref={rawBar} style={barInner} />
        </div>
        <span style={{ fontFamily: FONT, fontSize: typography.label.fontSize, color: theme.textBody }}>Raw</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={barContainer}>
          <div ref={mapBar} style={barInner} />
        </div>
        <span style={{ fontFamily: FONT, fontSize: typography.label.fontSize, color: theme.textBody }}>Out</span>
      </div>
    </div>
  )
}

// ─── Slider helper ───────────────────────────────────────────────

function LabeledSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display?: string
}) {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: layout.gap8 }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: typography.label.fontSize,
          fontWeight: typography.label.fontWeight,
          color: theme.textBody,
          minWidth: 80,
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: semanticColors.buttonSurfacePrimary }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: typography.label.fontSize,
          color: theme.textHeading,
          minWidth: 32,
          textAlign: 'right',
        }}
      >
        {display ?? value}
      </span>
    </div>
  )
}

// ─── Main DebugPanel ─────────────────────────────────────────────

const WAVEFORMS: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square']
const CURVES: ExpressionConfig['curve'][] = ['linear', 'exponential', 'logarithmic']

const DebugPanel = forwardRef<DebugPanelHandle, DebugPanelProps>(
  function DebugPanel({ rtt, oneWay, jitter, samplesRef, transportType, synth, waveform, onWaveformChange }, ref) {
    const { theme } = useTheme()
    const [open, setOpen] = useState(false)
    const [curve, setCurve] = useState<ExpressionConfig['curve']>('linear')
    const [noiseFloor, setNoiseFloor] = useState(5)
    const [gainCeiling, setGainCeiling] = useState(110)
    const [volume, setVolume] = useState(100)

    const cc11RawRef = useRef(0)
    const cc11MappedRef = useRef(0)

    useImperativeHandle(ref, () => ({
      pushCC11(raw: number, mapped: number) {
        cc11RawRef.current = raw
        cc11MappedRef.current = mapped
      },
    }))

    const handleCurve = useCallback(
      (c: ExpressionConfig['curve']) => {
        setCurve(c)
        synth?.setExpression({ curve: c, noiseFloor, gainCeiling })
      },
      [synth, noiseFloor, gainCeiling],
    )

    const handleNoiseFloor = useCallback(
      (v: number) => {
        setNoiseFloor(v)
        synth?.setExpression({ curve, noiseFloor: v, gainCeiling })
      },
      [synth, curve, gainCeiling],
    )

    const handleGainCeiling = useCallback(
      (v: number) => {
        setGainCeiling(v)
        synth?.setExpression({ curve, noiseFloor, gainCeiling: v })
      },
      [synth, curve, noiseFloor],
    )

    const handleWaveform = useCallback(
      (w: OscillatorType) => {
        onWaveformChange(w)
      },
      [onWaveformChange],
    )

    const handleVolume = useCallback(
      (v: number) => {
        setVolume(v)
        synth?.setMasterVolume(v / 100)
      },
      [synth],
    )

    const transportLabel =
      transportType === 'relay' ? 'TURN Relay' : 'WebRTC P2P'

    const sectionTitle: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.overline.fontSize,
      fontWeight: typography.overline.fontWeight,
      letterSpacing: typography.overline.letterSpacing,
      color: theme.textBody,
      textTransform: 'uppercase',
      marginBottom: layout.gap8,
      marginTop: layout.gap16,
    }

    const stat: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.titleS.fontSize,
      fontWeight: typography.titleS.fontWeight,
      color: theme.textHeading,
    }

    const statLabel: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.label.fontSize,
      color: theme.textBody,
    }

    return (
      <>
        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            position: 'fixed',
            bottom: layout.gap16,
            right: layout.gap16,
            zIndex: 1000,
            width: 40,
            height: 40,
            borderRadius: layout.radiusRound,
            border: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
            background: theme.surfaceCard,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.12)',
          }}
          aria-label="Toggle debug panel"
        >
          <Icon name={open ? 'close' : 'filter'} size={16} />
        </button>

        {/* Panel */}
        {open && (
          <div
            style={{
              position: 'fixed',
              bottom: layout.gap64,
              right: layout.gap16,
              zIndex: 999,
              width: 320,
              maxHeight: 'calc(100vh - 96px)',
              overflowY: 'auto',
              background: theme.surfaceCard,
              border: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
              borderRadius: layout.radiusM,
              padding: layout.gap16,
              boxShadow: theme.mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* ── Latency ── */}
            <div style={sectionTitle}>Latency</div>
            <div style={{ display: 'flex', gap: layout.gap16, marginBottom: layout.gap8 }}>
              <div>
                <div style={stat}>{rtt !== null ? `${rtt}` : '—'}</div>
                <div style={statLabel}>RTT ms</div>
              </div>
              <div>
                <div style={stat}>{oneWay !== null ? `${oneWay}` : '—'}</div>
                <div style={statLabel}>One-way ms</div>
              </div>
              <div>
                <div style={stat}>{jitter !== null ? `${jitter}` : '—'}</div>
                <div style={statLabel}>Jitter ms</div>
              </div>
            </div>
            <Sparkline samplesRef={samplesRef} />

            <div style={{ display: 'flex', gap: layout.gap8, marginTop: layout.gap8 }}>
              <Tag type={transportType === 'relay' ? 'default' : 'success'} state="active">
                {transportLabel}
              </Tag>
              <Tag type={IS_TUNNEL ? 'success' : 'default'} state="active">
                {IS_TUNNEL ? 'Real network' : 'Localhost'}
              </Tag>
            </div>

            {/* ── Expression ── */}
            <div style={sectionTitle}>Expression</div>

            <div style={{ display: 'flex', gap: layout.gap16, alignItems: 'flex-start', marginBottom: layout.gap8 }}>
              <div>
                <div style={{ ...statLabel, marginBottom: 4 }}>Curve</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap2 }}>
                  {CURVES.map((c) => (
                    <label
                      key={c}
                      style={{
                        fontFamily: FONT,
                        fontSize: typography.bodyS.fontSize,
                        color: theme.textHeading,
                        display: 'flex',
                        alignItems: 'center',
                        gap: layout.gap4,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="curve"
                        checked={curve === c}
                        onChange={() => handleCurve(c)}
                        style={{ accentColor: semanticColors.buttonSurfacePrimary }}
                      />
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <CurveVis curve={curve} />
              <CC11Monitor rawRef={cc11RawRef} mappedRef={cc11MappedRef} />
            </div>

            <LabeledSlider label="Noise floor" value={noiseFloor} min={0} max={30} onChange={handleNoiseFloor} />
            <LabeledSlider label="Gain ceiling" value={gainCeiling} min={50} max={127} onChange={handleGainCeiling} />

            {/* ── Synth ── */}
            <div style={sectionTitle}>Synth</div>

            <div style={{ ...statLabel, marginBottom: 4 }}>Waveform</div>
            <div style={{ display: 'flex', gap: layout.gap4, marginBottom: layout.gap8 }}>
              {WAVEFORMS.map((w) => (
                <BasicButton
                  key={w}
                  variant={waveform === w ? 'primary' : 'secondary'}
                  colourFill={waveform === w}
                  size="small"
                  onClick={() => handleWaveform(w)}
                >
                  {w}
                </BasicButton>
              ))}
            </div>

            <LabeledSlider
              label="Volume"
              value={volume}
              min={0}
              max={100}
              onChange={handleVolume}
              display={`${volume}%`}
            />

            <div style={{ marginTop: layout.gap16 }}>
              <BasicButton
                variant="primary"
                colourFill
                size="large"
                onClick={() => synth?.panicAllNotesOff()}
                showIcon
                iconName="stop"
                style={{ width: '100%' }}
              >
                All Notes Off
              </BasicButton>
            </div>
          </div>
        )}
      </>
    )
  },
)

export default DebugPanel
