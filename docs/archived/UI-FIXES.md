# Aether UI — Bug Fixes & Behaviour Spec

## Status key
- 🔴 Not started
- 🟡 In progress / sent to agent
- ✅ Done

---

## Agent workflow rules (read before writing any prompt)

### DS agent — mandatory reading order
Before doing anything, the DS agent must read in this order:
1. `Data/figma-variables/DESIGN-TO-CODE-WORKFLOW.md` — primary rulebook
2. `PROJECT_NOTES.md` — component registry
3. `src/tokens/design-tokens.ts` — all colour, spacing and typography tokens
4. `Data/figma-variables/TOKEN-LOOKUP.md` — resolving Figma variable IDs to token names
5. `Claude_Prompts/start-of-chat.md` — component glossary and critical rules

### DS agent — critical rules (never violate)
- No hardcoded hex or px values. All colours and spacing from `src/tokens/design-tokens.ts`.
- Never recreate an existing component — import and compose it. Check `src/Components/` first.
- Versioning: archive old version into `Archive/`, create new version file, bump version number.
- Commit after each component: `git add [specific files] && git commit --no-verify -m "message"`. Do NOT use `git add -A`.
- Variant names MUST match Figma exactly.
- Text labels use sentence case. Never force all caps via CSS unless Figma explicitly shows it.
- Run `npx tsc --noEmit` — zero errors before committing.
- Run `npm run storybook:a11y -- --component=ComponentName` after each component. Report but do NOT auto-fix visual design violations.

### DS agent — Figma MCP usage
When Figma context is needed, use MCP server `user-figma-desktop` with tool `get_design_context`.
NodeId format: from URL `?node-id=14200-71584` use `14200:71584` (hyphen → colon).
File key: `cEvsxKUutB8c3TbI3RHk0n`

Figma URL pattern: `https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=NODE-ID`

### Figma node ID reference
| Component | MCP nodeId | Figma URL |
|-----------|------------|-----------|
| Keyboard (full screen solo) | 15407:242217 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15407-242217 |
| InstrumentInterface | 15230:53732 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15230-53732 |
| OctaveSection | 15230:54088 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15230-54088 |
| PianoKey | 14938:17062 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14938-17062 |
| KeyOctaveController | 15403:230651 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15403-230651 |
| BinaryController | 15414:267797 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15414-267797 |
| SimpleButton | 15216:46700 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15216-46700 |
| ButtonRow (Sine snapshot) | 15414:267455 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15414-267455 |
| TopNav | 15335:112033 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15335-112033 |
| JamBoard | 15398:178005 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15398-178005 |
| ChordDisplay | 15397:169782 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15397-169782 |
| EffectsBoard | 15398:180969 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15398-180969 |
| HandleSlider | 15186:64658 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15186-64658 |
| SliderController | 15398:175359 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15398-175359 |
| VolumeController | 15398:175545 | https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15398-175545 |

### Vendor copy workflow
After DS agent commits, Felix manually copies files:
```bash
cp /Users/felix/GitHub/DesignSystem/src/Components/<name>/<file> \
   /Users/felix/GitHub/Aether/vendor/DesignSystem/src/Components/<name>/<file>
```
Then: `cd /Users/felix/GitHub/Aether/client && npx tsc --noEmit`
Git commits always use `--no-verify`.

---

## SECTION 1 — ChordDisplay & JamBoard

### 1.1 Oscilloscope card hardcoded width 🔴
**File:** `vendor/DesignSystem/src/Components/jamboard/JamBoard.1.0.0.tsx`
**Figma ref:** JamBoard node 15398:178005

Oscilloscope ChordDisplay has hardcoded `flex: '0 0 660px'` / `width: 660px`. Local ChordDisplay uses `flex: 1` so it takes only remaining space — both cards appear unequal width.

**Fix:** Remove hardcoded width from oscilloscope card. Both ChordDisplay cards get `flex: 1`. VolumeController sits between them at its natural intrinsic width.

---

### 1.2 Chord tag showing when no chord detected ✅
**File:** `client/src/components/jam/JamRoom.tsx` — `chordCardMainLine` useMemo

`chordCardMainLine` falls back to `midiNoteToName(currentNote)` when no chord is detected, passing a single note name as `localChordName` to ChordDisplay which renders it as a Tag.

**Fix:**
```ts
const chordCardMainLine = useMemo(() => {
  if (chordResult?.primary) return chordResult.primary
  return null  // Remove currentNote fallback entirely
}, [chordResult])
```
Same fix for `remoteChordMainLine`.

---

### 1.3 Notes showing white (partOfChord true) when no chord detected ✅
**File:** `client/src/components/jam/JamRoom.tsx` — `localChordNotes` useMemo

When 2+ notes are held without forming a chord, `chordResult` returns a partial match. All notes get `partOfChord: true` incorrectly.

**Fix:**
```ts
const localChordNotes: ChordDisplayNote[] = useMemo(() => {
  const hasChord = Boolean(chordResult?.primary)
  return localNotes.map((midiNote) => {
    const noteName = midiNoteToName(midiNote)
    const pc = pitchClassName(midiNote)
    const isInChord = hasChord && (chordResult?.noteNames?.includes(pc) ?? false)
    return { note: noteName, partOfChord: isInChord }
  })
}, [localNotes, chordResult])
```

---

### 1.4A Wrong chord name detected (Cmaj7 vs Cmaj9) 🟡 (sent to agent)
**File:** `client/src/lib/chords.ts`

Only 16 chord definitions exist. Cmaj9 undefined so C+E+G+B+D = Cmaj7. Scoring `intervals.length * 10 - extraNotes * 3` means Cmaj7 + extra D scores 37 and wins. Agent prompt sent to Aether agent — full rewrite with comprehensive library and scoring fix `coveredNotes * 100 - extraNotes * 15`.

---

### 1.4B Tag jumping up and down as notes are added 🟡
**File:** `vendor/DesignSystem/src/Components/chorddisplay/ChordDisplay.2.3.0.tsx`
**Figma ref:** ChordDisplay node 15397:169782

Inner layout uses `justifyContent: 'center'` so Tag jumps as InternalKeyInput grows.

**Figma spec:** InternalKeyInput fills vertical space (`flex: 1`). Tag always pinned to bottom.

**Fix:**
```tsx
const innerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 0,
  width: "100%",
}
// Wrap InternalKeyInput in flex-filling div, Tag below:
<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
  {hasNotes ? <InternalKeyInput ... /> : null}
</div>
{showTag ? <Tag ... /> : null}
```

---

## SECTION 2 — SimpleButton & ButtonRow

### 2.1 SimpleButton wrong border radius ✅
**File:** `vendor/DesignSystem/src/Components/simplebutton/SimpleButton.1.2.0.tsx`
**Figma ref:** SimpleButton node 15216:46700

`borderRadius: layout.radiusM` (16px) = pill. Figma spec = `radiusS` (8px).

**Fix:** `borderRadius: layout.radiusM` → `borderRadius: layout.radiusS`

---

### 2.2 SimpleButton icon too large ✅
**File:** `vendor/DesignSystem/src/Components/simplebutton/SimpleButton.1.2.0.tsx`

`size={32}` too large and stroke too heavy.

**Fix:** `size={32}` → `size={24}`

---

### 2.3 SimpleButton pressed state colour not working 🔴
**Note from testing:** Scale animation removed correctly — no more layout shift. However the pressed state colour change (orange fill when pressing) is also not triggering. The button clicks correctly but there is no visual press feedback at all now. Needs investigation — the state prop logic may not be wiring the Pressed state background correctly when onPointerDown fires.

### 2.3b SimpleButton press animation causes layout shift ✅
**File:** `vendor/DesignSystem/src/Components/simplebutton/SimpleButton.1.2.0.tsx`

`scale(0.92)` transform shrinks the button causing layout shift. Figma uses colour-change only.

**Fix:** Remove scale animation entirely — remove `isPressed` useState, `showPressScale`, all pointer handlers, and `transform`/`transition` from button style. Background colour change (orange/black) is sufficient.

---

### 2.4 ButtonRow not fixed width — label causes layout shift ✅
**File:** `vendor/DesignSystem/src/Components/buttonrow/ButtonRow.1.0.0.tsx`
**Figma ref:** Sine snapshot node 15414:267455

No fixed width. "Sine" → "Sawtooth" label change shifts the whole ButtonRow width.

**Figma spec:** ButtonRow locked at **60px wide**. Buttons fill full width.

**Fix:**
- Add `width: 60` to outer div style
- Pass `style={{ width: '100%' }}` to each SimpleButton in the map

---

## SECTION 3 — SliderController scroll

### 3.1 Scroll direction inverted on macOS ✅
**File:** `vendor/DesignSystem/src/Components/slidercontroller/SliderController.1.0.0.tsx`
**Figma ref:** SliderController node 15398:175359

`const dir = e.deltaY > 0 ? -1 : 1` is wrong. On macOS Natural Scrolling (default), `deltaY > 0` when physically scrolling UP — so scrolling up decreases the value. Affects all vertical sliders.

**Fix:** `const dir = e.deltaY > 0 ? 1 : -1`

Also check `HandleSlider.1.0.0.tsx` for any separate wheel handling needing the same fix.

---

## SECTION 4 — DataController & SettingsPanel

### 4.1 DataController labels uppercase — should be title case ✅
**File:** `vendor/DesignSystem/src/Components/datacontroller/DataController.1.0.0.tsx`

`textTransform: "uppercase"` applied to parameter labels (Attack, Release, Mix etc). These must be title case. Only SettingsPanel `categoryTitle` (ENVELOPE, CHORUS etc) is uppercase — already correct in SettingsPanel.

**Fix:** Remove `textTransform: "uppercase"` from `labelStyle` in DataController.

---

### 4.2 DataController grey background visible in dark mode ✅
**File:** `vendor/DesignSystem/src/Components/datacontroller/DataController.1.0.0.tsx`

`background: semanticColors.backdropSurfaceTransparentSurfaceLight` resolves to a light surface visible as grey in dark mode.

**Fix:** `background: semanticColors.backdropSurfaceTransparentSurfaceLight` → `background: "transparent"`

---

## SECTION 5 — Behaviour Spec (DS documentation reference)

### ChordDisplay — correct behaviour
**Figma ref:** node 15397:169782

- Default (local): orange bg + border, 180px fixed height, `flex: 1` width
- No notes: completely empty
- Notes held, no chord: all `partOfChord: false` (muted). No Tag.
- Chord detected: chord tones `partOfChord: true` (white), others muted. Tag pinned to bottom.
- Maximum 8 notes — 4 per row, up to 2 rows
- Themed (remote): theme-coloured bg + border per player slot (purple/pink/green/blue)
- Oscilloscope: black bg, orange border, canvas fills card, no notes, no Tag ever

### Note partOfChord logic
1. No notes → ChordDisplay empty
2. Notes held, `chordResult?.primary` falsy → all `partOfChord: false`
3. Chord detected → pitch-class members → `partOfChord: true`, others → `false`
4. Tag only shown when `chordResult?.primary` is non-empty

### SliderController scroll
Scroll up = value increases. Scroll down = value decreases. `deltaY > 0` = scrolling up on macOS Natural Scrolling.

### ButtonRow dimensions
Fixed 60px wide. Buttons fill full width. Label text changes but container width never changes.

### DataController labels
Title case. No textTransform. SettingsPanel category titles are uppercase (ENVELOPE, CHORUS etc) — applied in SettingsPanel, not DataController.

---

## SECTION 6 — EffectsBoard layout

### 6.1 EffectsBoard missing maxWidth 🔴
**File:** `vendor/DesignSystem/src/Components/effectsboard/EffectsBoard.1.0.0.tsx`
**Figma ref:** EffectsBoard node 15398:180969

Outer scroll wrapper has no `maxWidth`. Figma spec = **1612px** max (= 64px gap between sections at full width). Inner row `minWidth` 1188px already correct — horizontal scroll kicks in when viewport is narrower than that.

**Fix:** Add `maxWidth: 1612` to outer scroll wrapper div.

---

### 6.2 EffectsBoard inner spacing should be space-between ✅
**File:** `vendor/DesignSystem/src/Components/effectsboard/EffectsBoard.1.0.0.tsx`

Inner row uses fixed `gap: SECTION_GAP` (26px). Figma HorizontalScrollWrapper spacing = auto — sections spread to fill available width up to the 1612px max.

**Fix:** Replace fixed `gap` with `justifyContent: "space-between"` on the inner row. The maxWidth (1612px) caps how far apart sections can spread — at that width the gap equals 64px.

---

## SECTION 7 — HandleSlider

### 7.1 Vertical slider thumb wrong dimensions ✅
**Note from testing:** Thumb is now taller (16×32) which is correct. However at maximum value the thumb overflows upward and covers the title label above the slider. The thumb bottom calculation needs adjustment — the thumb must be clipped within the track bounds so it never extends outside the track area. The container needs `overflow: hidden` or the thumb position needs to be clamped so it stays within the track.

**File:** `vendor/DesignSystem/src/Components/handleslider/HandleSlider.1.0.0.tsx`
**Figma ref:** HandleSlider node 15186:64658

Vertical thumb uses 16×16px. Figma spec = **16px wide × 32px tall**.

**Fix:**
```ts
const THUMB_WIDTH_H = 16; const THUMB_HEIGHT_H = 16  // horizontal
const THUMB_WIDTH_V = 16; const THUMB_HEIGHT_V = 32  // vertical
```
Use V constants in vertical thumbStyle. Update bottom calc: `bottom: calc(${clamped * 100}% - ${THUMB_HEIGHT_V / 2}px)`.

---

### 7.2 Themed vertical slider thumb transparent at idle ✅
**File:** `vendor/DesignSystem/src/Components/handleslider/HandleSlider.1.0.0.tsx`

`themedIdleDim` sets `opacity: 0.5` on fill and thumb when `variant="theme"` and not dragging. Makes thumb nearly invisible on light backgrounds.

**Fix:** Remove `themedIdleDim` opacity condition entirely. Both `fillStyle` and `thumbStyle` always use `opacity: 1`.

---

### 7.3 SliderController suffix colour not changing when active ✅
**File:** `vendor/DesignSystem/src/Components/slidercontroller/SliderController.1.0.0.tsx`

Suffix span hardcoded to `colors.textBodyNeutral`. When active the value number changes colour but the suffix stays grey — they should match.

**Fix:** Change suffix span colour from `colors.textBodyNeutral` to `valueColor` (same active colour logic as the value number).

---

## SECTION 8 — TopNav & ThemeWheel

### 8.1 TopNav has no background in Figma — should be transparent 🔴
**File:** `vendor/DesignSystem/src/Components/topnav/TopNav.1.2.0.tsx`
**Figma ref:** TopNav node 15335:112033

TopNav has no background colour in Figma. The Back to Lobby button and aether logo are adaptive — they are legible in both light and dark mode because the page background itself changes, not the nav. The current `backdropNautralBackground` token may be resolving to a static colour.

**Fix:** Remove the `background` property from TopNav bar style entirely (or set to `"transparent"`). The page behind it provides the background. Confirm that the Back to Lobby button and logo use adaptive tokens that work in both light and dark mode without needing a nav background.

---

### 8.2 ThemeWheel animation not rotating — theme switches but no animation ✅
**Note from testing:** Theme now switches simultaneously with click (correct). However the wheel no longer rotates at all — it just flips between light/dark states instantly with no animation. The animate() call may have been lost or the motion value is being reset by the useEffect that syncs theme prop changes. Needs investigation.

**File:** `vendor/DesignSystem/src/Components/themewheel/ThemeWheel.1.0.0.tsx`

Current flow: wheel rotates 400ms → `.then()` fires `onThemeChange`. Theme changes after animation ends — wheel turns first, theme snaps after.

**Fix:** Call `onThemeChange` at click start, simultaneously with animation:
```ts
const nextTheme = fromTheme === "light" ? "dark" : "light";
onThemeChange(nextTheme);  // fire immediately
animate(rotationTwo, start + 180, twoClickTransition)
  .finally(() => { twoAnimating.current = false; });
```

---

## SECTION 9 — Keyboard & InstrumentInterface

### IMPORTANT: OctaveSection broken import
**File:** `vendor/DesignSystem/src/Components/octavesection/OctaveSection.1.2.0.tsx`

OctaveSection imports `PianoKey.1.5.1` but the file in vendor is `PianoKey.1.4.0.tsx`. This is a broken import causing a runtime crash. **Must be fixed first before any keyboard work can function.**

**Fix:** Change import in OctaveSection from `PianoKey.1.5.1` to `PianoKey.1.4.0`.

---

### Keyboard layout reference (from Figma — Figma is correct)
**Figma ref:** Solo screen node 15407:242217

The Figma keyboard shows the correct keyboard shortcut mapping across all octave groups. From the screenshot:
- Black keys row (top): S D · G H J · L Ö · 2 3 4 · 6 7 · 9 0 +
- White keys row (bottom): Z X C V B N M , . - Q W E R T Y U I O P Å

This maps as two octave shortcut groups:
- **Group 1 (lower):** Z-row whites (Z X C V B N M , . -), A-row blacks (S D G H J L Ö)
- **Group 2 (upper):** Q-row whites (Q W E R T Y U I O P Å), number-row blacks (2 3 4 6 7 9 0 +)

OctaveSection currently hardcodes Z/X/C/V/B/N/M and S/D/H/J/G for EVERY octave — so all three displayed octaves show the same letters. This is wrong. Only the octave groups that have keyboard mappings should show shortcut letters; the third visual octave should show no keyboard shortcuts (empty labels).

---

### 9.1 InstrumentInterface still has ‹ › octave arrows ✅
**Fixed:** Arrows removed. onOctaveChange prop removed. keysRow fills full width.
**File:** `vendor/DesignSystem/src/Components/instrumentinterface/InstrumentInterface.1.1.0.tsx`
**Figma ref:** InstrumentInterface node 15230:53732, full screen node 15407:242217

New design uses KeyOctaveController for octave/key shift. InstrumentInterface should no longer show ‹ › navigation buttons. Keyboard tiles fill full width.

**Fix:** Remove left/right arrow buttons and canDec/canInc/arrowBtn logic from InstrumentInterface entirely. The `keysRow` div becomes the full width of the component. Also remove `onOctaveChange` prop from InstrumentInterface and clean up in JamRoom.tsx.

---

### 9.2 PianoKeyboard key letters repeating across all octaves ✅
**Fixed:** OctaveSection now accepts keyboardGroup prop. All 3 groups have correct shortcut letters (Z-M, ,-R, T-Å).
**File:** `vendor/DesignSystem/src/Components/octavesection/OctaveSection.1.2.0.tsx`
**Figma ref:** OctaveSection node 15230:54088

OctaveSection hardcodes the same shortcuts (Z-M, S/D/H/J/G) for every octave it renders. When InstrumentInterface renders 3 octave sections they all show identical letters.

**Fix:** OctaveSection needs to know which keyboard group it belongs to (0 = first group with Z-row shortcuts, 1 = second group with Q-row shortcuts, anything else = no shortcuts). Add a `keyboardGroup?: 0 | 1` prop. When `keyboardGroup === 0`, show Z-row/A-row shortcuts. When `keyboardGroup === 1`, show Q-row/number-row shortcuts. When prop is absent or undefined, show empty shortcut labels.

In JamRoom, pass `keyboardGroup={i}` to each OctaveSection where `i` is the octave index (0, 1, 2). Only groups 0 and 1 show shortcuts; group 2 shows none.

Shortcut mapping for group 1 (upper):
- Whites: Q W E R T Y U I O P Å (matching MIDI notes F4-B5)
- Blacks: 2 3 4 6 7 9 0 + (matching C#4-A#5)

---

### 9.3 Mouse click on keyboard keys not working 🔴
**File:** `client/src/components/jam/JamRoom.tsx`

PianoKeyboard is wrapped in `display: 'none'` so its pointer handlers are dead. InstrumentInterface tiles are display-only with no pointer events.

**Fix:** Mouse press to play a key (or release a locked key) is a valid backup interaction. Remove `display: 'none'` from the PianoKeyboard wrapper. Position it with `position: 'absolute'`, `opacity: 0`, `pointerEvents: 'all'` overlapping the InstrumentInterface so pointer events are captured by PianoKeyboard while InstrumentInterface handles visual display. The PianoKeyboard must be sized to match InstrumentInterface exactly.

---

### 9.4 Holding a key then shifting octave/key locks the held note ✅
**File:** `client/src/components/jam/JamRoom.tsx` — `prevKbTransposeRef` / `prevKbOctaveRef` useEffect

When a key is held and octave/key shift fires, noteOff for the old pitch is sent and noteOn for the new pitch fires. But `keyboardActiveNotesRef` still maps the physical key to the old note, so on keyup it sends noteOff for an already-released note — the new note gets stuck on.

**Fix:** After the pitch-shift effect remaps active notes, update `keyboardActiveNotesRef` to map each physical key code to its new shifted MIDI note number.

---

### 9.5 Remote notes not showing on keyboard (ghost keys) 🔴
**Files:** `client/src/components/jam/JamRoom.tsx`, `vendor/DesignSystem/src/Components/instrumentinterface/InstrumentInterface.1.1.0.tsx`
**Figma ref:** Duo screen — remote player notes should appear as themed ghost keys

`remoteNotes` is passed to PianoKeyboard but PianoKeyboard is hidden. InstrumentInterface has no remote notes prop.

**Fix:** Add `remoteNotes?: string[]` prop to InstrumentInterface, pass it through to OctaveSection, and then to each PianoKey so remote notes render in the ghost/themed state. In JamRoom, derive remote note name strings from `remoteNotes` Set and pass to InstrumentInterface alongside local `pressedNotes`.

---

### 9.6 PianoKey colours wrong — naturals, accidentals, note hints ✅
**File:** `vendor/DesignSystem/src/Components/pianokey/PianoKey.1.4.0.tsx`
**Figma ref:** PianoKey node 14938:17062

Figma spec:
- Natural (white key) default bg: `backdropStaticSurface` (static white) — NOT a grey adaptive token
- Natural border: `strokeAdaptiveWeak` — very subtle, almost invisible
- Accidental (black key) default bg: `backdropStaticLightenedBlack` (#0D0D0D)
- Note hint text (shortcut label and note name): static grey `#808080` — NOT `textDisabled`, NOT `strokeInvertedMedium`
- Minimum key width: 32px

**Fix:** Correct background, border, and label colour tokens. For the note hint grey, if there is no matching token add a `// TODO` comment with the hex and use the nearest available static token. Do not use adaptive tokens for static visual elements on the keyboard.

---

## SECTION 10 — Layout & Spacing

### 10.1 Page horizontal padding should be 48px not 96px ✅
**File:** `client/src/components/jam/JamRoom.tsx`

`horizontalPad` uses `layout.gap96` (96px). Desktop breakpoint margin-page variable = **48px**.

**Fix:** `layout.gap96` → `layout.gap48` on the `horizontalPad` constant. Applies to JamBoard wrapper, EffectsBoard wrapper, and keyboard wrapper.

---

### 10.2 TopNav horizontal padding inconsistent with page ✅
**File:** `vendor/DesignSystem/src/Components/topnav/TopNav.1.2.0.tsx`
**Figma ref:** TopNav node 15335:112033

TopNav uses `layout.paddingSubtle` — doesn't match the page's 48px padding so content doesn't align horizontally.

**Fix:** Change TopNav `paddingLeft`/`paddingRight` to `layout.gap48`.

---

### 10.3 JamBoard, EffectsBoard, Keyboard pushed to top — should fill height ✅
**File:** `client/src/components/jam/JamRoom.tsx`

Three main sections cluster at the top. Figma Frame 1196 uses auto gap — sections spread to fill full vertical height between TopNav and viewport bottom.

**Fix:** On the main content flex column, change `gap: layout.gap16` to `justifyContent: "space-between"`. JamBoard at top, Keyboard at bottom, EffectsBoard between.

---

## SECTION 11 — Duo Play

### 11.1 Remote notes not appearing on local keyboard 🔴
Cross-reference: same fix as Section 9.5. Remote notes correctly appear in themed ChordDisplay but not as ghost keys on keyboard because InstrumentInterface has no remote notes prop.

---

## SECTION 12 — KeyOctaveController icons

### 12.1 Octave BinaryController showing wrong chevron icons ✅
**Files:**
- `vendor/DesignSystem/src/Components/binarycontroller/BinaryController.1.0.0.tsx`
- `vendor/DesignSystem/src/Components/keyoctavecontroller/KeyOctaveController.1.0.0.tsx`
**Figma ref:** BinaryController node 15414:267797, KeyOctaveController node 15403:230651

Both Key and Octave use `chevron-up`/`chevron-down`. Octave maps to left/right arrow keys so buttons should show:
- Top button (onOctaveUp): `chevron-right`
- Bottom button (onOctaveDown): `chevron-left`

Key correctly keeps `chevron-up`/`chevron-down`.

**Fix — two steps:**

Step 1: Add optional icon props to BinaryController:
```tsx
upIcon?: IconName    // default: 'chevron-up'
downIcon?: IconName  // default: 'chevron-down'
```

Step 2: In KeyOctaveController, pass correct icons to Octave controller:
```tsx
<BinaryController
  title="Octave"
  upIcon="chevron-right"
  downIcon="chevron-left"
  ...
/>
```

---

## SECTION 13 — HandleSlider drag requires click first

### 13.1 Drag on slider requires a prior click to focus the window 🔴
**File:** `vendor/DesignSystem/src/Components/handleslider/HandleSlider.1.0.0.tsx`

When the browser window hasn't been interacted with recently (e.g. first drag after switching to the tab), clicking and dragging on a vertical or horizontal slider does nothing on the first attempt. The second attempt works. This is a pointer capture / focus issue — the browser requires the window to have focus before `setPointerCapture` works as expected.

**Fix:** Add a `window.focus()` call or ensure the container div has `tabIndex={-1}` so it can receive focus on pointer down without needing a prior click. Alternatively, check whether `e.preventDefault()` in `handlePointerDown` is sufficient or if the event is being swallowed before pointer capture is set.

---

## SECTION 14 — ThemeWheel animation root cause

### 14.1 ThemeWheel animation destroyed by key={mode} remount ✅
**File:** `client/src/components/jam/JamRoom.tsx`

`<TopNav key={mode} ...>` causes React to completely unmount and remount TopNav (and therefore ThemeWheel) every time the theme changes. This destroys the `useMotionValue` and `twoAnimating` ref mid-animation before it can play. Theme changes correctly but animation never completes.

**Fix:** Remove `key={mode}` from the TopNav JSX in JamRoom.tsx. TopNav already receives `defaultTheme` as a prop and manages its own internal state. The `key` is unnecessary and destructive to animation state.

```tsx
// BEFORE:
<TopNav
  key={mode}
  onBackToLobby={onLeave}
  defaultTheme={topNavDefaultTheme}
  onThemeChange={(t: 'light' | 'dark') => setThemeMode(t)}
/>

// AFTER:
<TopNav
  onBackToLobby={onLeave}
  defaultTheme={topNavDefaultTheme}
  onThemeChange={(t: 'light' | 'dark') => setThemeMode(t)}
/>
```

This is an Aether fix only — no DS component changes needed.

---

## SECTION 15 — Keyboard & EffectsBoard layout (fill width)

### 15.1 EffectsBoard not filling full page width ✅
**Files:** `client/src/components/jam/JamRoom.tsx`, `vendor/DesignSystem/src/Components/effectsboard/EffectsBoard.1.0.0.tsx`

EffectsBoard only fills the width of its content rather than the full viewport width. The wrapper div with horizontalPad is not stretching to fill the flex column. Multiple fix attempts have not resolved this.

**Root cause being addressed:** The three sections (JamBoard, EffectsBoard, Keyboard) need to be in their own inner flex column with `justifyContent: space-between`. The outer wrapper should be a plain flex column with no gap so there is no space between TopNav and JamBoard.

---

### 15.2 InstrumentInterface not filling keyboard row width ✅
**Files:** `vendor/DesignSystem/src/Components/instrumentinterface/InstrumentInterface.1.1.0.tsx`, `vendor/DesignSystem/src/Components/octavesection/OctaveSection.1.2.0.tsx`

Figma spec:
- InstrumentInterface outer frame: `fill` horizontally, `minWidth: 1088`, `gap: gap-4` between OctaveSections
- OctaveSection: `fill` horizontally (not hardcoded 356px width)
- Natural key row: `fill`, keys `flex: 1`, `minWidth: 32px`
- Accidental key row: same
- Each PianoKey instrument tile: `flex: 1`, `minWidth: 32px`

Currently OctaveSection has `width: 356` hardcoded and PianoKey instrument tiles have `width: 48px` hardcoded. DS agent fix in progress.

---

### 15.3 TopNav gap above JamBoard ✅
**File:** `client/src/components/jam/JamRoom.tsx`

There should be zero gap between TopNav and JamBoard. Figma shows them flush. `justifyContent: space-between` on the main content column is pushing JamBoard away from TopNav. Fix: wrap the three sections in their own inner div with `space-between`, keep outer column as plain flex column.

---

### 15.4 KeyOctaveController bottom not aligning with natural keys ✅
**Files:** `client/src/components/jam/JamRoom.tsx`

The bottom arrow button of KeyOctaveController should align with the bottom of the white (natural) keys. Currently KeyOctaveController sits higher. The keyboard row container uses `alignItems: flex-end` which should handle this, but InstrumentInterface needs to fill height properly first (15.2) before this alignment works correctly. May resolve itself once 15.2 is fixed.