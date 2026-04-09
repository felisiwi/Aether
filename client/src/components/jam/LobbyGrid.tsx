import {
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import PlayerCard from './PlayerCard'
import { useTheme } from '../../contexts/ThemeContext'
import type { InstrumentMode } from '../../lib/midi'

const FONT = `${fontFamily}, sans-serif`

export interface LobbyUser {
  username: string
  instrument: InstrumentMode
}

export interface LobbyGridProps {
  users: LobbyUser[]
  localUser: string
  onSelectUser: (username: string) => void
  connectingTo: string | null
  latencies: Record<string, number | null>
}

export default function LobbyGrid({
  users,
  localUser,
  onSelectUser,
  connectingTo,
  latencies,
}: LobbyGridProps) {
  const { theme } = useTheme()
  const others = users.filter((u) => u.username !== localUser)

  if (others.length === 0) {
    return (
      <div
        style={{
          padding: layout.gap32,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: typography.bodyM.fontSize,
          lineHeight: `${typography.bodyM.lineHeight}px`,
          color: theme.textBody,
        }}
      >
        No one else is online yet.
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: layout.gap16,
      }}
    >
      {others.map((u) => (
        <PlayerCard
          key={u.username}
          username={u.username}
          instrument={u.instrument}
          latency={latencies[u.username] ?? null}
          isConnected={false}
          isConnecting={connectingTo === u.username}
          onClick={() => onSelectUser(u.username)}
        />
      ))}
    </div>
  )
}
