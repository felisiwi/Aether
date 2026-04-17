# ChordDisplay — Spec v1.0

## Concept
Card-style chord panel showing held notes, chord name, and key name in a local (orange) or remote (purple) colourway.

## IS NOT
Not a standalone text label and not the player header row; it always includes the HeldKeys row plus both chord and key text.

## Figma nodeId
15208:19629 — https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15208-19629

## Anatomy
- Outer container: rounded card, bordered, vertically stacked and centered content; local uses orange border/background tokens, remote uses purple theme tokens.
- Held keys row (top): composed from `HeldKeys`, label-style tokens matching variant colourway.
- Chord name (middle): `typography.titleL`; color = `colors.textHeadingColour` (local) or `themeTokens.purple.primary50` (remote).
- Key name (bottom): `typography.bodyL`; SAME color token as chord name (never white, never neutral body color).
- Spacing/frame: tokenized paddings, radius, stroke, and internal gaps from DS layout tokens.

## Variants (exact Figma names — do not rename)
| Variant name | Visual difference | Key token changes |
|-------------|-------------------|-------------------|
| Local | Orange card with orange heading text | `semanticColors.strokeColour`, `semanticColors.backdropSurfaceElevatedSurface`, `colors.textHeadingColour` |
| Remote | Purple card with purple heading text | `themeTokens.purple.primary50`, `themeTokens.purple.primary10` |

## Props
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| variant | 'local' \| 'remote' | yes | — | Chooses local or remote colourway |
| chordName | string | yes | — | Large chord text |
| notes | string[] | yes | — | Passed to `HeldKeys` |
| keyName | string | yes | — | Body/L key text under chord name |
| className | string | no | — | Optional wrapper class |
| style | React.CSSProperties | no | — | Optional wrapper style |

## Composition
Existing DS components this component uses (check `src/Components/` first):
- HeldKeys (`src/Components/heldkeys/`)

## Behaviour
Display-only — no click handlers, no tabIndex.

## Pre-build checklist
- [x] All variant names match Figma exactly — not renamed
- [x] Every colour in anatomy has a token — no hardcoded hex
- [x] Every typography element uses a token from the mapping table in `start-of-chat.md`
- [x] All composition dependencies exist in `src/Components/`
- [x] IS NOT statement rules out the most likely misinterpretation
