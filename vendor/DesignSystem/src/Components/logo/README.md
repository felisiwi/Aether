# Logo — v1.0.2

Canonical **Aether** wordmark component. Use this anywhere the Aether logo is needed — **do not** import the raw SVG asset (`aetherlogo.svg`) directly in new code.

This is a **leaf** component. Compose it inside TopNav, landing layouts, marketing shells, etc., rather than duplicating logo markup.

**Variant colours are theme-stable:** `White` / `Black` / `Colour` always resolve to the same visible inks regardless of `[data-theme]`. The **consumer** chooses which variant fits the surface (e.g. TopNav: `colour={mode === "dark" ? "White" : "Black"}`). Do not pair adaptive text tokens with that choice or the mark will double-flip and disappear on dark shells.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colour` | `"White" \| "Black" \| "Colour"` | `"Black"` | Maps to a design-token `color` on the wrapper; SVG paths use `currentColor`. **White** — always white ink (`semanticColors.semanticStrokeStaticStrokeWhiteSolid`). **Black** — always black ink (`semanticColors.semanticStrokeStaticStrokeBlackSolid`). **Colour** — brand orange (`colors.textHeadingColour`, static `#F04700`). |
| `width` | `number \| string` | _undefined_ | Optional CSS width on the `<svg>` (numbers → `px`). Omit to size via parent / `height` only. |
| `height` | `number \| string` | _undefined_ | Optional CSS height on the `<svg>`. |
| `aria-label` | `string` | `"Aether logo"` | Accessible name for the `<svg role="img">`. |
| `className` | `string` | _undefined_ | Passed to the outer `<span>` wrapper. |
| `style` | `React.CSSProperties` | _undefined_ | Merged onto the outer wrapper (after layout defaults). |

## Usage

Ancestors must load **`src/tokens/semantic-tokens.css`** (or equivalent app shell) so `var(--ds-*)` tokens used by White/Black resolve. In Storybook, use a story **decorator** with the right surface background (`docs/STORYBOOK.md`); do not set `data-theme` on this component.

```tsx
import { Logo } from "../logo/Logo.1.0.2";

<Logo colour="White" width={280} aria-label="Aether" />
```

The component has **no** background fill on the wrapper or SVG — it is transparent; place it on the correct surface (or use a Storybook decorator) for contrast.

## Display / a11y

The mark is decorative branding unless it is the primary page title; keep `aria-label` meaningful when multiple logos appear. Automated axe: run `npm run storybook:a11y -- --component=Logo` with Storybook running. Document intentional display-only exceptions per `DESIGN-TO-CODE-WORKFLOW.md` §9.

## Figma

- Component set: `AdaptiveColourLogo`, node `15918:125034`.
- Snapshot: `Data/figma-variables/fetched-nodes/AdaptiveColourLogo--cEvsxKUutB8c3TbI3RHk0n-15918-125034.json`.
