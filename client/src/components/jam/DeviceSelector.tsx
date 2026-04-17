import {
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import BasicButton from '../BasicButton'
import { Tag } from '../Tag'
import { useTheme } from '../../contexts/ThemeContext'
import type { InstrumentMode } from '../../lib/midi'
import type { MidiDevice } from '../../hooks/useMIDI'

const FONT = `${fontFamily}, sans-serif`

export interface DeviceSelectorProps {
  mode: InstrumentMode
  onModeChange: (mode: InstrumentMode) => void
  devices: MidiDevice[]
  selectedDeviceId: string | null
  onSelectDevice: (id: string | null) => void
  error: string | null
}

export default function DeviceSelector({
  mode,
  onModeChange,
  devices,
  selectedDeviceId,
  onSelectDevice,
  error,
}: DeviceSelectorProps) {
  const { theme } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: layout.gap8 }}>
        <BasicButton
          variant={mode === 'keyboard' ? 'primary' : 'secondary'}
          colourFill={mode === 'keyboard'}
          size="small"
          onClick={() => onModeChange('keyboard')}
        >
          Piano (keyboard)
        </BasicButton>
        <BasicButton
          variant={mode === 'wind' ? 'primary' : 'secondary'}
          colourFill={mode === 'wind'}
          size="small"
          onClick={() => onModeChange('wind')}
        >
          Aerophone Mini
        </BasicButton>
      </div>

      {/* MIDI device dropdown (wind mode only) */}
      {mode === 'wind' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap8 }}>
          {devices.length === 0 ? (
            <p
              style={{
                fontFamily: FONT,
                fontSize: typography.bodyS.fontSize,
                lineHeight: `${typography.bodyS.lineHeight}px`,
                color: theme.textBody,
                margin: 0,
              }}
            >
              No MIDI devices found — connect a device and refresh.
              <br />
              <span style={{ color: semanticColors.textFunctionalWarning }}>
                Web MIDI requires Chrome.
              </span>
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: layout.gap8 }}>
              <select
                value={selectedDeviceId ?? ''}
                onChange={(e) =>
                  onSelectDevice(e.target.value || null)
                }
                style={{
                  flex: 1,
                  padding: `${layout.gap4}px ${layout.gap8}px`,
                  borderRadius: layout.radiusS,
                  border: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
                  background: theme.surfaceInput,
                  fontFamily: FONT,
                  fontSize: typography.bodyS.fontSize,
                  lineHeight: `${typography.bodyS.lineHeight}px`,
                  color: theme.textHeading,
                  outline: 'none',
                }}
              >
                <option value="">Select a device…</option>
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Tag type="default" state="active">
                MIDI
              </Tag>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: typography.bodyS.fontSize,
            lineHeight: `${typography.bodyS.lineHeight}px`,
            color: semanticColors.textFunctionalError,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
