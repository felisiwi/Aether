# SoundWaveController — Spec v1.0

## Concept
Waveform selector with a vertical stack of four selectable waveform buttons using custom Icon waveforms plus labels.

## IS NOT
Not an expandable oscilloscope panel and not a horizontal tab strip; only the simple stacked selector variant is in scope.

## Figma nodeId
15208:20144 — https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15208-20144

## Anatomy
- Root stack: column layout with small vertical gap between waveform buttons.
- Four buttons in order: Sine, Triangle, Sawtooth, Square.
- Button contents: `Icon` waveform glyph (WaveformSine/Triangle/Sawtooth/Square equivalents) and label text.
- Active button: orange colourway using `semanticColors.wrapperColourPressed` and/or `semanticColors.strokeColour`.
- Inactive button: dark/neutral colourway with neutral stroke/background tokens.
- Text style: compact control label style (`typography.label`) aligned with icon.

## Variants (exact Figma names — do not rename)
| Variant name | Visual difference | Key token changes |
|-------------|-------------------|-------------------|
| Simple | Vertical waveform stack only | Active uses orange tokens; inactive uses dark/neutral tokens |

## Props
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| selectedWaveform | 'sine' \| 'triangle' \| 'sawtooth' \| 'square' | yes | — | Current selected waveform |
| onWaveformChange | (waveform) => void | yes | — | Called when user selects a waveform |
| className | string | no | — | Optional wrapper class |
| style | React.CSSProperties | no | — | Optional wrapper style |

## Composition
Existing DS components this component uses (check `src/Components/` first):
- Icon (`src/Components/icon/`) with custom waveform names

## Behaviour
Interactive selector: click a button to emit `onWaveformChange` with that waveform value.

## Pre-build checklist
- [x] All variant names match Figma exactly — not renamed
- [x] Every colour in anatomy has a token — no hardcoded hex
- [x] Every typography element uses a token from the mapping table in `start-of-chat.md`
- [x] All composition dependencies exist in `src/Components/`
- [x] IS NOT statement rules out the most likely misinterpretation
