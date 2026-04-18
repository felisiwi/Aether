export interface ChordResult {
  primary: string
  alternative: string
  noteNames: string[]
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

interface ChordDef {
  readonly intervals: readonly number[]
  readonly suffix: string
  readonly altSuffix?: string
  readonly altRootOffset?: number
  readonly altRootSuffix?: string
  readonly qualityLabel?: string
}

/**
 * Pitch-class intervals from root (0–11). Scoring and matching use mod-12 sets.
 */
const CHORD_DEFS: readonly ChordDef[] = [
  // 2-note
  { intervals: [0, 7], suffix: '5' },
  { intervals: [0, 5], suffix: '4', qualityLabel: 'suspended fourth dyad' },
  { intervals: [0, 2], suffix: '2', qualityLabel: 'suspended second dyad' },

  // 3-note triads & sus
  { intervals: [0, 4, 7], suffix: 'maj', qualityLabel: 'major' },
  { intervals: [0, 3, 7], suffix: 'm', qualityLabel: 'minor' },
  { intervals: [0, 3, 6], suffix: 'dim', qualityLabel: 'diminished' },
  { intervals: [0, 4, 8], suffix: 'aug', altRootOffset: 4, altRootSuffix: 'aug' },
  { intervals: [0, 2, 7], suffix: 'sus2', altRootOffset: 7, altRootSuffix: 'sus4' },
  { intervals: [0, 5, 7], suffix: 'sus4', altRootOffset: 5, altRootSuffix: 'sus2' },
  { intervals: [0, 5, 10], suffix: 'sus47', qualityLabel: 'suspended fourth seventh' },

  // 4-note — sevenths, sixths, add, quartal
  { intervals: [0, 4, 7, 11], suffix: 'maj7', qualityLabel: 'major seventh' },
  { intervals: [0, 3, 7, 10], suffix: 'm7', qualityLabel: 'minor seventh' },
  { intervals: [0, 4, 7, 10], suffix: '7', qualityLabel: 'dominant seventh' },
  { intervals: [0, 3, 7, 11], suffix: 'mMaj7', qualityLabel: 'minor major seventh' },
  { intervals: [0, 4, 8, 10], suffix: 'aug7', qualityLabel: 'augmented seventh' },
  { intervals: [0, 4, 8, 11], suffix: 'augMaj7', qualityLabel: 'augmented major seventh' },
  { intervals: [0, 2, 7, 10], suffix: '7sus2' },
  { intervals: [0, 5, 7, 10], suffix: '7sus4' },
  { intervals: [0, 4, 6, 10], suffix: '7b5', qualityLabel: 'seventh flat five' },
  { intervals: [0, 4, 6, 11], suffix: 'maj7b5' },
  { intervals: [0, 3, 6, 10], suffix: 'm7b5', altSuffix: 'ø7' },
  { intervals: [0, 3, 6, 9], suffix: 'dim7', altRootOffset: 3, altRootSuffix: 'dim7' },
  { intervals: [0, 4, 7, 9], suffix: '6', altRootOffset: 9, altRootSuffix: 'm7' },
  { intervals: [0, 3, 7, 9], suffix: 'm6', altRootOffset: 9, altRootSuffix: 'm7b5' },
  { intervals: [0, 4, 7, 2], suffix: 'add9', qualityLabel: 'add nine' },
  { intervals: [0, 3, 7, 2], suffix: 'madd9' },
  { intervals: [0, 4, 7, 5], suffix: 'add11' },
  { intervals: [0, 5, 10, 3], suffix: 'quartal' },

  // 5-note
  { intervals: [0, 4, 7, 11, 2], suffix: 'maj9', qualityLabel: 'major ninth' },
  { intervals: [0, 3, 7, 10, 2], suffix: 'm9', qualityLabel: 'minor ninth' },
  { intervals: [0, 4, 7, 10, 2], suffix: '9', qualityLabel: 'dominant ninth' },
  { intervals: [0, 4, 7, 9, 2], suffix: '6/9', qualityLabel: 'six nine' },
  { intervals: [0, 3, 7, 9, 2], suffix: 'm6/9' },
  { intervals: [0, 3, 7, 11, 2], suffix: 'mMaj9', qualityLabel: 'minor major ninth' },
  { intervals: [0, 4, 7, 10, 1], suffix: '7b9', qualityLabel: 'seventh flat nine' },
  { intervals: [0, 4, 7, 10, 3], suffix: '7#9', qualityLabel: 'seventh sharp nine' },
  { intervals: [0, 4, 6, 10, 2], suffix: '9b5' },
  { intervals: [0, 4, 8, 10, 2], suffix: 'aug9', qualityLabel: 'augmented ninth' },
  { intervals: [0, 4, 7, 11, 5], suffix: 'maj11' },
  { intervals: [0, 4, 7, 10, 5], suffix: '11', qualityLabel: 'eleventh' },
  { intervals: [0, 3, 7, 10, 5], suffix: 'm11', qualityLabel: 'minor eleventh' },
  { intervals: [0, 4, 6, 7, 11], suffix: 'maj7#11', altSuffix: 'Lyd' },

  // 6-note
  { intervals: [0, 4, 7, 10, 2, 5], suffix: '11', qualityLabel: 'dominant ninth eleventh' },
  { intervals: [0, 4, 7, 10, 2, 9], suffix: '13', qualityLabel: 'thirteenth' },
  { intervals: [0, 4, 7, 11, 2, 9], suffix: 'maj13', qualityLabel: 'major thirteenth' },
  { intervals: [0, 3, 7, 10, 2, 9], suffix: 'm13', qualityLabel: 'minor thirteenth' },
  { intervals: [0, 4, 7, 10, 1, 9], suffix: '13b9' },
  { intervals: [0, 4, 7, 10, 2, 8], suffix: '13b13', qualityLabel: 'seventh flat thirteen' },
]

function pitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12
}

function chordPitchClasses(root: number, def: ChordDef): Set<number> {
  return new Set(def.intervals.map((i) => (root + i) % 12))
}

function extraNotesAllowed(def: ChordDef, extra: number): boolean {
  const len = def.intervals.length
  if (len <= 2) return extra === 0
  if (len === 3) return extra <= 1
  if (len === 4) return extra <= 1
  return extra <= 2
}

function compareCandidates(
  scoreA: number,
  lenA: number,
  extraA: number,
  scoreB: number,
  lenB: number,
  extraB: number,
): number {
  if (scoreA !== scoreB) return scoreA - scoreB
  if (lenA !== lenB) return lenA - lenB
  return extraB - extraA
}

interface ScoredCandidate {
  root: number
  def: ChordDef
  extraNotes: number
  score: number
  coveredRatio: number
  templateLen: number
}

/**
 * Detect the best-fitting chord name for a set of MIDI note numbers.
 *
 * Returns null if fewer than 2 notes are provided, or if no template passes
 * coverage / extra-note rules.
 */
export function detectChord(notes: number[]): ChordResult | null {
  if (notes.length < 2) return null

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

  const P = pitches.length
  const noteNames = pitches.map((pc) => NOTE_NAMES[pc])

  let maxTemplateLen = 0
  const raw: ScoredCandidate[] = []

  for (let root = 0; root < 12; root++) {
    for (const def of CHORD_DEFS) {
      const chordPcs = chordPitchClasses(root, def)

      let allPresent = true
      for (const cp of chordPcs) {
        if (!seenPc.has(cp)) {
          allPresent = false
          break
        }
      }
      if (!allPresent) continue

      let extraNotes = 0
      for (const pc of seenPc) {
        if (!chordPcs.has(pc)) extraNotes++
      }

      const covered = P - extraNotes
      const coveredRatio = P > 0 ? covered / P : 0

      const templateLen = def.intervals.length
      if (templateLen > maxTemplateLen) maxTemplateLen = templateLen

      const coveredNotes = def.intervals.length
      const score = coveredNotes * 100 - extraNotes * 15

      raw.push({ root, def, extraNotes, score, coveredRatio, templateLen })
    }
  }

  const eligible = raw.filter((c) => {
    if (c.coveredRatio >= 0.8) return true
    if (c.templateLen === maxTemplateLen && maxTemplateLen > 0) return true
    return false
  })

  if (eligible.length === 0) return null

  let best: ScoredCandidate | null = null
  for (const c of eligible) {
    if (best === null) {
      best = c
      continue
    }
    const cmp = compareCandidates(c.score, c.def.intervals.length, c.extraNotes, best.score, best.def.intervals.length, best.extraNotes)
    if (cmp > 0) best = c
  }

  if (best === null || best.score < 0) return null

  if (!extraNotesAllowed(best.def, best.extraNotes)) return null

  const rootName = NOTE_NAMES[best.root]
  const primary = `${rootName}${best.def.suffix}`
  if (primary.length === 0) return null

  let alternative = ''
  if (best.def.altSuffix !== undefined) {
    alternative = `${rootName}${best.def.altSuffix}`
  } else if (best.def.altRootOffset !== undefined && best.def.altRootSuffix !== undefined) {
    const altRoot = (best.root + best.def.altRootOffset) % 12
    alternative = `${NOTE_NAMES[altRoot]}${best.def.altRootSuffix}`
  } else if (best.def.qualityLabel !== undefined) {
    alternative = best.def.qualityLabel
  }

  return { primary, alternative, noteNames }
}
