import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type AudioCtxState = AudioContextState

export interface AudioContextValue {
  audioCtx: AudioContext | null
  state: AudioCtxState | 'uninitialized'
  /** Create the AudioContext (if not yet created) and resume it. */
  resume: () => Promise<void>
}

export const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioContextProvider({ children }: { children: ReactNode }) {
  const parentValue = useContext(AudioCtx)
  if (parentValue !== null) {
    throw new Error('AudioContextProvider must not be nested.')
  }

  const ctxRef = useRef<AudioContext | null>(null)
  const [state, setState] = useState<AudioCtxState | 'uninitialized'>('uninitialized')
  const mountedRef = useRef(true)

  const resume = useCallback(async () => {
    if (!ctxRef.current) {
      const newCtx = new AudioContext({
        latencyHint: 'interactive',
        sampleRate: 44100,
      })
      ctxRef.current = newCtx

      newCtx.onstatechange = () => {
        if (mountedRef.current) setState(newCtx.state)
      }

      if (mountedRef.current) setState(newCtx.state)
    }

    const ctx = ctxRef.current
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume()
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      const ctx = ctxRef.current
      if (ctx) {
        ctx.onstatechange = null
        ctx.close()
        ctxRef.current = null
      }
    }
  }, [])

  const audioCtx = ctxRef.current
  const value: AudioContextValue = {
    audioCtx,
    state: audioCtx ? state : 'uninitialized',
    resume,
  }

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}
