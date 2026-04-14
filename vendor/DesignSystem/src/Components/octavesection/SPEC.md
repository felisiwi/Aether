# OctaveSection — Spec v1.0

## Concept
One octave tile that renders exactly 7 white keys and 5 black keys in either piano-key layout or keyboard-cap layout.

## IS NOT
Not an octave stepper, not a full keyboard strip, and not a control bar with arrows or extra controls.

## Figma nodeId
15230:54088 — https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15230-54088

## Anatomy
- Outer container: horizontal key tile; `Piano` uses compact width (336px), `Keyboard` includes stacked rows and wider frame (~356px).
- White piano keys: `PianoKey` instances in `Piano` mode, width 48, height 142, bottom rounded corners.
- Black piano keys: `PianoKey` instances in `Piano` mode, width 32, height 89, overlay positioned above white keys.
- Keyboard top row: black keycaps (C#, D#, F#, G#, A#), each 48x48 with `typography.bodyS` shortcut and `typography.label` note label.
- Keyboard bottom row: white keycaps (C, D, E, F, G, A, B), each 48x~95 with same typography mapping.
- Colours: dark keycaps use `semanticColors.backdropStaticLightenedBlack` + weak/medium stroke tokens; light keycaps use `semanticColors.backdropStaticDarkenedWhite` + `semanticColors.strokeMedium`; pressed state uses existing key pressed tokens.

## Variants (exact Figma names — do not rename)
| Variant name | Visual difference | Key token changes |
|-------------|-------------------|-------------------|
| Piano | Classic piano key geometry (7 white + 5 black overlay) | White/black key surface tokens and piano-key stroke tokens |
| Keyboard | Keyboard-cap rows with note + shortcut labels in each cap | Keycap surfaces with `strokeMedium`, label/body text styles |

## Props
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| octave | number | yes | — | Used to build note names for each key (e.g. C4) |
| pressedNotes | string[] | no | [] | Case-insensitive pressed note lookup |
| variant | 'Piano' \| 'Keyboard' | no | 'Piano' | Must match exact Figma variant names |
| className | string | no | — | Optional wrapper class |
| style | React.CSSProperties | no | — | Optional wrapper style overrides |

## Composition
Existing DS components this component uses (check `src/Components/` first):
- PianoKey (`src/Components/pianokey/`)

## Behaviour
Display-only key rendering; no click handlers in this component. Pressed state is controlled by `pressedNotes`.

## Pre-build checklist
- [x] All variant names match Figma exactly — not renamed
- [x] Every colour in anatomy has a token — no hardcoded hex
- [x] Every typography element uses a token from the mapping table in `start-of-chat.md`
- [x] All composition dependencies exist in `src/Components/`
- [x] IS NOT statement rules out the most likely misinterpretation
