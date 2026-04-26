# Logo — Spec v1.0.2

## Figma

- Component set `AdaptiveColourLogo`, node `15918:125034`
- Snapshot: `Data/figma-variables/fetched-nodes/AdaptiveColourLogo--cEvsxKUutB8c3TbI3RHk0n-15918-125034.json`

## Variants (`colour` prop — exact Figma `Colour` values)

| Figma `Colour` | Code `colour` |
|----------------|---------------|
| White | `"White"` |
| Black | `"Black"` |
| Colour | `"Colour"` |

## Implementation

- Wrapper `<span>` and `<svg>` have **no** background paint — transparent; fill is **`currentColor`** only; wrapper `color` comes from `design-tokens.ts` (no hardcoded hex in the component).
- **Theme-stable paints (v1.0.2):** variant colours do **not** use adaptive `--ds-text-inverted` / `--ds-text-heading-neutral`; the consumer picks the variant for the surface. Earlier versions archived under `Archive/`.

## Token resolution (`LOGO_COLOR` → `design-tokens.ts`)

| Variant | Token | Notes |
|---------|--------|--------|
| White | `semanticColors.semanticStrokeStaticStrokeWhiteSolid` | `var(--ds-semantic-stroke-static-stroke-white-solid)` → `#FFFFFF` in `:root` and `[data-theme="dark"]` (`semantic-tokens.css`). |
| Black | `semanticColors.semanticStrokeStaticStrokeBlackSolid` | `var(--ds-semantic-stroke-static-stroke-black-solid)` → `#000000` in both themes. |
| Colour | `colors.textHeadingColour` | Static `"#F04700"` in `design-tokens.ts` (Colours/Primary/50). |

## Storybook

Use story **decorators** (or parent layout) for light/dark/inverted surfaces — not background on the Logo itself (`docs/STORYBOOK.md`). To verify theme stability, toggle `document.documentElement.dataset.theme` between `light` and `dark` while viewing **AllVariants**: each column’s wordmark hue should not change.
