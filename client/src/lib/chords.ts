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

  const chordNoteNames = Array.from(chordPitchClasses(best.root, best.def))
    .map((pc) => NOTE_NAMES[pc])
  return { primary, alternative, noteNames: chordNoteNames }
}

export interface ChordHint {
  chordName: string
  missingNotes: string[]
}

/**
 * Given a set of held MIDI notes with no detected chord,
 * return up to 3 chords that are closest to being complete
 * (i.e. require the fewest additional notes to form).
 * Only considers chords needing 1 or 2 additional notes.
 * Returns hints sorted by fewest missing notes first.
 */
export function getProximityHints(notes: number[]): ChordHint[] {
  if (notes.length === 0) return []

  const seenPc = new Set<number>()
  for (const n of notes) {
    seenPc.add(pitchClass(n))
  }

  const bestByName = new Map<string, { missingCount: number; missingNotes: string[] }>()

  for (let root = 0; root < 12; root++) {
    for (const def of CHORD_DEFS) {
      if (def.intervals.length > 5) continue

      const chordPcs = chordPitchClasses(root, def)

      let heldNotesAllInChord = true
      for (const pc of seenPc) {
        if (!chordPcs.has(pc)) {
          heldNotesAllInChord = false
          break
        }
      }
      if (!heldNotesAllInChord) continue

      const missingNotes = def.intervals
        .map((i) => (root + i) % 12)
        .filter((pc) => !seenPc.has(pc))
        .map((pc) => NOTE_NAMES[pc])

      if (missingNotes.length === 0) continue
      if (missingNotes.length > 2) continue

      const chordName = `${NOTE_NAMES[root]}${def.suffix}`

      const prev = bestByName.get(chordName)
      if (prev === undefined || missingNotes.length < prev.missingCount) {
        bestByName.set(chordName, { missingCount: missingNotes.length, missingNotes })
      }
    }
  }

  const scored: { chordName: string; missingNotes: string[]; missingCount: number }[] = []
  for (const [chordName, v] of bestByName) {
    scored.push({ chordName, missingNotes: v.missingNotes, missingCount: v.missingCount })
  }
  scored.sort((a, b) => a.missingCount - b.missingCount || a.chordName.localeCompare(b.chordName))

  return scored.slice(0, 3).map(({ chordName, missingNotes }) => ({ chordName, missingNotes }))
}

export interface ProgressionHints {
  resolve: ChordHint[]
  tension: ChordHint[]
  move: ChordHint[]
}

/** Letter name → pitch class for roots spelled with flats (NOTE_NAMES uses sharps). */
const FLAT_ROOT_TO_PC: Record<string, number> = {
  Db: 1,
  Eb: 3,
  Gb: 6,
  Ab: 8,
  Bb: 10,
  Cb: 11,
  Fb: 4,
}

function rootNameToPc(rootName: string): number {
  const sharpIdx = NOTE_NAMES.indexOf(rootName as (typeof NOTE_NAMES)[number])
  if (sharpIdx !== -1) return sharpIdx
  const flatPc = FLAT_ROOT_TO_PC[rootName]
  return flatPc !== undefined ? flatPc : -1
}

/** Match longest chord suffix first so e.g. "maj7" wins over "maj" and "m". */
const CHORD_DEFS_LONGEST_SUFFIX_FIRST: readonly ChordDef[] = [...CHORD_DEFS]
  .map((def, index) => ({ def, index }))
  .sort((a, b) => b.def.suffix.length - a.def.suffix.length || a.index - b.index)
  .map(({ def }) => def)

function parseChordNameToDef(chordName: string): { rootPc: number; def: ChordDef } | null {
  for (const def of CHORD_DEFS_LONGEST_SUFFIX_FIRST) {
    if (!chordName.endsWith(def.suffix)) continue
    const rootStr = chordName.slice(0, chordName.length - def.suffix.length)
    if (rootStr.length === 0) continue
    const rootPc = rootNameToPc(rootStr)
    if (rootPc < 0) continue
    return { rootPc, def }
  }
  return null
}

function getChordNotes(chordName: string): string[] {
  const parsed = parseChordNameToDef(chordName)
  if (!parsed) return []
  const { rootPc, def } = parsed
  return def.intervals.map((i) => NOTE_NAMES[(rootPc + i) % 12])
}

function makeHint(chordName: string): ChordHint {
  return { chordName, missingNotes: getChordNotes(chordName) }
}

const PROGRESSION_MAP: Record<string, ProgressionHints> = {
  Cmaj: {
    resolve: [makeHint('Fmaj'), makeHint('Gmaj'), makeHint('Am')],
    tension: [makeHint('Dm'), makeHint('Em'), makeHint('Bdim')],
    move: [makeHint('Emaj'), makeHint('Amaj'), makeHint('Gmaj')],
  },
  Fmaj: {
    resolve: [makeHint('Cmaj'), makeHint('Bbmaj'), makeHint('Am')],
    tension: [makeHint('Gm'), makeHint('Dm'), makeHint('Em')],
    move: [makeHint('Abmaj'), makeHint('Dbmaj'), makeHint('Bbmaj')],
  },
  Gmaj: {
    resolve: [makeHint('Cmaj'), makeHint('Dmaj'), makeHint('Em')],
    tension: [makeHint('Am'), makeHint('Bm'), makeHint('Fdim')],
    move: [makeHint('Bmaj'), makeHint('Emaj'), makeHint('Amaj')],
  },
  Am: {
    resolve: [makeHint('Dmaj'), makeHint('Emaj'), makeHint('Cmaj')],
    tension: [makeHint('Bdim'), makeHint('E7'), makeHint('Dm')],
    move: [makeHint('Fmaj'), makeHint('Gmaj'), makeHint('Cmaj')],
  },
  Dm: {
    resolve: [makeHint('Gmaj'), makeHint('Am'), makeHint('Cmaj')],
    tension: [makeHint('E7'), makeHint('Bdim'), makeHint('Fmaj')],
    move: [makeHint('Bbmaj'), makeHint('Ebmaj'), makeHint('Am')],
  },
  Em: {
    resolve: [makeHint('Am'), makeHint('Cmaj'), makeHint('Gmaj')],
    tension: [makeHint('Fdim'), makeHint('B7'), makeHint('Am')],
    move: [makeHint('Cmaj'), makeHint('Dmaj'), makeHint('Fmaj')],
  },
  Amaj: {
    resolve: [makeHint('Dmaj'), makeHint('Emaj'), makeHint('F#m')],
    tension: [makeHint('Bm'), makeHint('C#m'), makeHint('G#dim')],
    move: [makeHint('C#maj'), makeHint('F#maj'), makeHint('Emaj')],
  },
  Dmaj: {
    resolve: [makeHint('Gmaj'), makeHint('Amaj'), makeHint('Bm')],
    tension: [makeHint('Em'), makeHint('F#m'), makeHint('C#dim')],
    move: [makeHint('F#maj'), makeHint('Bmaj'), makeHint('Amaj')],
  },
  Emaj: {
    resolve: [makeHint('Amaj'), makeHint('Bmaj'), makeHint('C#m')],
    tension: [makeHint('F#m'), makeHint('G#m'), makeHint('D#dim')],
    move: [makeHint('Abmaj'), makeHint('Dbmaj'), makeHint('Bmaj')],
  },
  Cmaj7: {
    resolve: [makeHint('Fmaj7'), makeHint('G7'), makeHint('Am7')],
    tension: [makeHint('Dm7'), makeHint('Em7'), makeHint('Bm7b5')],
    move: [makeHint('Emaj7'), makeHint('Amaj7'), makeHint('Gmaj7')],
  },
  Am7: {
    resolve: [makeHint('Dm7'), makeHint('G7'), makeHint('Cmaj7')],
    tension: [makeHint('Bm7b5'), makeHint('E7'), makeHint('Dm7')],
    move: [makeHint('Fmaj7'), makeHint('Gmaj7'), makeHint('Cmaj7')],
  },
  Dm7: {
    resolve: [makeHint('G7'), makeHint('Am7'), makeHint('Cmaj7')],
    tension: [makeHint('E7'), makeHint('Bm7b5'), makeHint('Fmaj7')],
    move: [makeHint('Bbmaj7'), makeHint('Ebmaj7'), makeHint('Am7')],
  },
  G7: {
    resolve: [makeHint('Cmaj'), makeHint('Cmaj7'), makeHint('Am')],
    tension: [makeHint('Bdim'), makeHint('Dm'), makeHint('Fmaj')],
    move: [makeHint('Dbmaj'), makeHint('Gbmaj'), makeHint('Dmaj')],
  },
  C7: {
    resolve: [makeHint('Fmaj'), makeHint('Fm'), makeHint('Am')],
    tension: [makeHint('Gdim'), makeHint('Dm'), makeHint('Gm')],
    move: [makeHint('Dbmaj'), makeHint('Gbmaj'), makeHint('Abmaj')],
  },
  Fmaj7: {
    resolve: [makeHint('Cmaj7'), makeHint('G7'), makeHint('Am7')],
    tension: [makeHint('Gm7'), makeHint('Dm7'), makeHint('Em7')],
    move: [makeHint('Abmaj7'), makeHint('Dbmaj7'), makeHint('Bbmaj7')],
  },
}

/**
 * Given a detected chord name (e.g. "Cmaj", "Am7"),
 * return suggested next chords grouped into three emotional
 * directions: resolve, tension, move.
 * Each hint includes the chord's constituent pitch-class names in `missingNotes`
 * (reused for hover/tooltip in the UI).
 */
export function getProgressionHints(chordName: string): ProgressionHints {
  return PROGRESSION_MAP[chordName] ?? { resolve: [], tension: [], move: [] }
}
