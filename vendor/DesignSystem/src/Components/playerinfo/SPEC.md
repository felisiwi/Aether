# PlayerInfo — Spec v1.0

## Concept
Compact single-row player metadata strip with player name, latency, and right-aligned instrument label.

## IS NOT
Not a card and not a full player display; it is only the top textual metadata row.

## Figma nodeId
15208:19654 — https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=15208-19654

## Anatomy
- Root row: horizontal distribution with left text group and right-aligned instrument text.
- Player name (left): `typography.label`, uppercase transform, color `colors.textHeadingNeutral` (local) or `themeTokens.components.primary50` (remote).
- Latency text (left, after name): `typography.label`, same color token as player name.
- Instrument text (right): `typography.label`, same color token as player name, right aligned.
- Spacing: tokenized horizontal gap between left items (`layout.gap8`) and full-width row layout.

## Variants (exact Figma names — do not rename)
| Variant name | Visual difference | Key token changes |
|-------------|-------------------|-------------------|
| Local | Neutral heading text | `colors.textHeadingNeutral` |
| Remote | Purple heading text | `themeTokens.components.primary50` |

## Props
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| playerName | string | yes | — | Displayed uppercase |
| latency | number \| null | yes | — | Render as `(Nms)` or `(--)` |
| instrument | string | yes | — | Right-aligned label text |
| variant | 'local' \| 'remote' | yes | — | Colourway |
| className | string | no | — | Optional row class |
| style | React.CSSProperties | no | — | Optional row style |

## Composition
Existing DS components this component uses (check `src/Components/` first):
- None (display-only text row)

## Behaviour
Display-only — no click handlers, no tabIndex.

## Pre-build checklist
- [x] All variant names match Figma exactly — not renamed
- [x] Every colour in anatomy has a token — no hardcoded hex
- [x] Every typography element uses a token from the mapping table in `start-of-chat.md`
- [x] All composition dependencies exist in `src/Components/`
- [x] IS NOT statement rules out the most likely misinterpretation
