# PianoKey

**Version**: v1.5.0  
**File**: `PianoKey.1.5.0.tsx`  
**Figma source**: [Variables-Figma-file](https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14886-17770) — node `14886:17770` ("Frame 954"). REST snapshot `Frame-954--cEvsxKUutB8c3TbI3RHk0n-14886-17770.json`.

---

## Purpose

A single piano key for a laptop-keyboard-mapped piano interface. Designed to be composed into a full keyboard by the consuming app (JamLink). Each key shows:

- **Note label** (top, small) — e.g. `G3`, `F#3`
- **Keyboard shortcut** (bottom) — the laptop key mapped to this note, e.g. `B`, `H`

Two physical key types: **white** (natural notes) and **black** (sharps/flats), each with **default** and **pressed** visual states.

**Note label placement (neither key type renders it internally):**
- **Black keys** — note label (e.g. "F#3") is rendered **above** the key row by the parent container (Figma Frame 952: a horizontal row above the key row), absolutely positioned above each black key.
- **White keys** — note label (e.g. "G3") is rendered **below** the key row by the parent container (Figma Frame 951: a horizontal row below the key row), one cell per white key.

The `note` prop is kept on the component for `aria-label` only — it gives screen readers the note name without cluttering the visual key body.

---

## Props

| Prop | Type | Description |
|------|------|-------------|
| `note` | `string` | Musical note name, e.g. `"G3"` or `"F#3"`. Used only in `aria-label` — never rendered inside the key body. The parent container renders note labels above (black keys) or below (white keys) the key row. |
| `shortcutLabel` | `string` | Keyboard letter mapped to this note, e.g. `"B"`. |
| `isPressed` | `boolean` | Whether the key is visually in the pressed state. |
| `isBlack` | `boolean` | `true` for sharp/flat (black) key; `false` for natural (white) key. |
| `variant` | `'default' \| 'instrument'` | Optional. **`default`** — same as v1.4.0 (shortcut only, bottom-aligned). **`instrument`** — Figma Instrument=Keyboard: full `radiusS`, `strokeMedium`, note + shortcut centred inside the key. |

---

## Usage

```tsx
import PianoKey from 'src/Components/pianokey/PianoKey.1.5.0';

// White key, default
<PianoKey note="G3" shortcutLabel="B" isPressed={false} isBlack={false} />

// Black key, pressed
<PianoKey note="F#3" shortcutLabel="H" isPressed={true} isBlack={true} />
```

The JamLink app controls `isPressed` dynamically based on `keydown`/`keyup` events.

---

## Dimensions (from Figma snapshot)

| Key type | Width | Height | Padding H | Padding V |
|----------|-------|--------|-----------|-----------|
| White    | 48 px | 142 px | 16 px     | 16 px     |
| Black    | 32 px | 89 px  | 8 px      | 8 px      |

- Bottom-left and bottom-right corners rounded: `layout.radiusXs` (4 px)  
- Border: 1 px `strokeWeak` (white keys) / `strokeInvertedWeak` (black keys)

---

## States

| State | White key bg | Black key bg | Shortcut colour | Note colour |
|-------|-------------|-------------|-----------------|-------------|
| Default | `semanticColors.backdropStaticDarkenedWhite` | `semanticColors.backdropStatesHoverSurface` | `colors.textDisabled` (white) / `strokeInvertedMedium` (black) | (parent-owned note rows) |
| Pressed | `semanticColors.backdropSurfaceColouredSurface` (`#F04700`) | same | `colors.textPressed` (`#FF8152`) | `colors.textHeadingColour` (`#F04700`) |

v1.5.0 default white key uses `semanticColors.backdropStaticDarkenedWhite` (approximates Figma `VariableID:14938:17058` / Monochrome/10).

---

## Accessibility

**Display-only** — state is driven by the parent via `isPressed`. The component does not add `tabIndex`, `onClick`, or button semantics; the JamLink app owns keyboard and pointer event handling.

Each key renders as `role="img"` with `aria-label="{note} — {shortcutLabel}"` so screen readers can identify individual keys.

Do not add focus ring or interactive ARIA roles to this component; that would create duplicate / confusing accessibility for the keyboard grid in the app.

---

## Token resolution

| VariableID | Figma name | design-tokens.ts key | Hex |
|---|---|---|---|
| `9277:1271` | `Backdrop/Surface/coloured-surface` | `semanticColors.backdropSurfaceColouredSurface` | `#F04700` |
| `13097:12508` | `Stroke/stroke-weak` | `semanticColors.strokeWeak` | `#0000000f` |
| `13097:12509` | `Stroke/stroke-inverted-weak` | `semanticColors.strokeInvertedWeak` | `#ffffff0f` |
| `9272:2228` | `Text/disabled` | `colors.textDisabled` | `#0000001f` |
| `13406:44547` | `Text/text-pressed` | `colors.textPressed` | `#FF8152` |
| `14886:17771` | `Text/inverted-disabled` | `semanticColors.strokeInvertedMedium`* | `#ffffff1f` |
| `14886:17772` | `Text/inverted-body-neutral` | `colors.textBodyNeutralDark`* | `#ffffff99` |
| `9006:26` | `Text/heading-colour` | `colors.textHeadingColour` | `#F04700` |
| `2010:197` | `Radius/radius-xs` | `layout.radiusXs` | 4 |
| `9053:53` | `gap-8` | `layout.gap8` | 8 |
| `9053:52` | `gap-4` | `layout.gap4` | 4 |

\* `inverted-disabled` and `inverted-body-neutral` are not yet exported in `design-tokens.ts`. Their resolved hex values match `strokeInvertedMedium` and `textBodyNeutralDark` respectively. TODO: export these tokens from `scripts/generate-design-tokens.js`.

---

## Versions

| Version | File | Notes |
|---------|------|-------|
| v1.5.0 | `PianoKey.1.5.0.tsx` | `variant` prop: `instrument` = Keyboard layout from batch snapshot; default white fill uses `backdropStaticDarkenedWhite` |
| v1.4.0 | `Archive/PianoKey.1.4.0.tsx` | Black key width 32 px; shortcut-only interior |
| v1.3.0 | `Archive/PianoKey.1.3.0.tsx` | Padding updated: white key 16 px all sides, black key 8 px all sides |
| v1.2.0 | `Archive/PianoKey.1.2.0.tsx` | Note label removed from white key interior too — both key types render shortcut only; parent owns all note labels |
| v1.1.0 | `Archive/PianoKey.1.1.0.tsx` | Removed note from black key interior; white key still rendered note inside |
| v1.0.0 | `Archive/PianoKey.1.0.0.tsx` | Initial — note label inside both key types (incorrect) |
