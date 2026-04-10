export interface ChordResult {
  primary: string
  alternative: string
  noteNames: string[]
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

interface ChordDef {
  readonly intervals: readonly number[]
  readonly suffix: string
  // Static alternative suffix (applied to the same root)
  readonly altSuffix?: string
  // Alternative: use a different root offset + suffix (e.g. C6 → Am7)
  readonly altRootOffset?: number
  readonly altRootSuffix?: string
  // Shown in the bottom row when no structural alternative exists
  readonly qualityLabel?: string
}

const CHORD_DEFS: readonly ChordDef[] = [
  // 2-note
  { intervals: [0, 7], suffix: '5' },
  // 3-note triads
  { intervals: [0, 4, 7], suffix: 'maj', qualityLabel: 'major' },
  { intervals: [0, 3, 7], suffix: 'm',   qualityLabel: 'minor' },
  { intervals: [0, 3, 6], suffix: 'dim', qualityLabel: 'diminished' },
  { intervals: [0, 4, 8], suffix: 'aug', altRootOffset: 4, altRootSuffix: 'aug' }, // augmented (symmetric)
  { intervals: [0, 2, 7], suffix: 'sus2', altRootOffset: 7, altRootSuffix: 'sus4' }, // Csus2 = Gsus4
  { intervals: [0, 5, 7], suffix: 'sus4', altRootOffset: 5, altRootSuffix: 'sus2' }, // Csus4 = Fsus2
  // 4-note chords
  { intervals: [0, 4, 7, 11], suffix: 'maj7', qualityLabel: 'major seventh' },
  { intervals: [0, 3, 7, 10], suffix: 'm7',   qualityLabel: 'minor seventh' },
  { intervals: [0, 4, 7, 10], suffix: '7',    qualityLabel: 'dominant seventh' },
  { intervals: [0, 3, 6, 10], suffix: 'm7b5', altSuffix: 'ø7' },          // half-diminished
  { intervals: [0, 3, 6, 9],  suffix: 'dim7', altRootOffset: 3, altRootSuffix: 'dim7' }, // symmetric (3 enharmonics)
  { intervals: [0, 4, 7, 9],  suffix: '6',    altRootOffset: 9, altRootSuffix: 'm7' },   // C6 = Am7
  { intervals: [0, 3, 7, 9],  suffix: 'm6',   altRootOffset: 9, altRootSuffix: 'm7b5' }, // Cm6 = Am7b5
  { intervals: [0, 2, 4, 7],  suffix: 'add9', qualityLabel: 'add nine' },
  // 5-note chords
  { intervals: [0, 4, 6, 7, 11], suffix: 'maj7#11', altSuffix: 'Lyd' },  // Lydian chord
]

function pitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12
}

/**
 * Detect the best-fitting chord name for a set of MIDI note numbers.
 *
 * Returns null if fewer than 2 notes are provided.
 * Returns { primary: '', alternative: '', noteNames } if notes are present but
 * no chord template matches.
 */
export function detectChord(notes: number[]): ChordResult | null {
  if (notes.length < 2) return null

  // Deduplicate pitch classes; preserve ascending order for display
  const seenPc = new Set<number>()
  const pitches: number[] = []
  for (const n of notes) {
    const pc = pitchClass(n)
    if (!seenPc.has(pc)) {
      seenPc.add(pc)
      pitches.push(pc)
    }
  }
  pitches.sort((a, b) => a - b)

  // Note names in ascending pitch-class order
  const noteNames = pitches.map(pc => NOTE_NAMES[pc])

  let bestRoot = -1
  let bestDef: ChordDef | null = null
  let bestScore = -Infinity

  for (let root = 0; root < 12; root++) {
    for (const def of CHORD_DEFS) {
      // Chord pitch classes from this root
      const chordPcs = new Set(def.intervals.map(i => (root + i) % 12))

      // All chord tones must be present in the input
      let allPresent = true
      for (const cp of chordPcs) {
        if (!seenPc.has(cp)) { allPresent = false; break }
      }
      if (!allPresent) continue

      // Extra notes in input beyond the chord template
      let extraNotes = 0
      for (const pc of seenPc) {
        if (!chordPcs.has(pc)) extraNotes++
      }

      // Score: prefer larger chord (more intervals), penalise extra notes
      const score = def.intervals.length * 10 - extraNotes * 3

      if (score > bestScore) {
        bestScore = score
        bestRoot = root
        bestDef = def
      }
    }
  }

  if (bestDef === null) {
    return { primary: '', alternative: '', noteNames }
  }

  const rootName = NOTE_NAMES[bestRoot]
  const primary = `${rootName}${bestDef.suffix}`

  let alternative = ''
  if (bestDef.altSuffix !== undefined) {
    alternative = `${rootName}${bestDef.altSuffix}`
  } else if (bestDef.altRootOffset !== undefined && bestDef.altRootSuffix !== undefined) {
    const altRoot = (bestRoot + bestDef.altRootOffset) % 12
    alternative = `${NOTE_NAMES[altRoot]}${bestDef.altRootSuffix}`
  } else if (bestDef.qualityLabel !== undefined) {
    alternative = bestDef.qualityLabel
  }

  return { primary, alternative, noteNames }
}
