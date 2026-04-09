import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_SAMPLES = 60
const JITTER_WINDOW = 10
const PING_INTERVAL_MS = 2000
const STATS_PUSH_MS = 1000

interface LatencyStats {
  rtt: number | null
  oneWay: number | null
  jitter: number | null
}

interface UseLatencyOptions {
  sendPing: () => void
  connected: boolean
}

export function useLatency({ sendPing, connected }: UseLatencyOptions) {
  const samplesRef = useRef<number[]>([])
  const [stats, setStats] = useState<LatencyStats>({
    rtt: null,
    oneWay: null,
    jitter: null,
  })

  const sendPingRef = useRef(sendPing)
  sendPingRef.current = sendPing

  useEffect(() => {
    if (!connected) {
      samplesRef.current = []
      setStats({ rtt: null, oneWay: null, jitter: null })
      return
    }

    sendPingRef.current()
    const id = setInterval(() => sendPingRef.current(), PING_INTERVAL_MS)
    return () => clearInterval(id)
  }, [connected])

  const handlePong = useCallback((originTs: number) => {
    const rtt = Date.now() - originTs
    const samples = samplesRef.current
    samples.push(rtt)
    if (samples.length > MAX_SAMPLES) samples.shift()
  }, [])

  useEffect(() => {
    if (!connected) return

    const id = setInterval(() => {
      const samples = samplesRef.current
      if (samples.length === 0) return

      const rtt = samples[samples.length - 1]
      const oneWay = Math.round(rtt / 2)

      const recent = samples.slice(-JITTER_WINDOW)
      const mean = recent.reduce((a, b) => a + b, 0) / recent.length
      const variance =
        recent.reduce((sum, s) => sum + (s - mean) ** 2, 0) / recent.length
      const jitter = Math.round(Math.sqrt(variance) * 10) / 10

      setStats({ rtt, oneWay, jitter })
    }, STATS_PUSH_MS)
    return () => clearInterval(id)
  }, [connected])

  return {
    rtt: stats.rtt,
    oneWay: stats.oneWay,
    jitter: stats.jitter,
    samplesRef,
    handlePong,
  }
}
