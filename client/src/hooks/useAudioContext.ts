import { useContext } from 'react'
import { AudioCtx } from '../contexts/AudioContext'
import type { AudioContextValue } from '../contexts/AudioContext'

export type { AudioContextValue }

export function useAudioContext(): AudioContextValue {
  const value = useContext(AudioCtx)
  if (value === null) {
    throw new Error(
      'useAudioContext must be used within AudioContextProvider',
    )
  }
  return value
}
