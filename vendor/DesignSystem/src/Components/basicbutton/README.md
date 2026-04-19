# BasicButton

Figma: **Basic/Buttons** — [node `13669-55650`](https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=13669-55650).

REST snapshot: `Data/figma-variables/fetched-nodes/BasicButtons--cEvsxKUutB8c3TbI3RHk0n-13669-55650.json`.

## Versions

- **1.2.0** — `BasicButton.1.2.0.tsx` (current). Fixes layout shift on pressed/focus: border is now constant at `strokeL` (2 px) in all states; the heavier stroke for pressed/focus (`strokeXl` = 3 px) is rendered via `box-shadow: inset` so outer dimensions never change. Latching buttons no longer grow when toggled.
- **1.1.0** — archived at `Archive/BasicButton.1.1.0.tsx`. All tokens wired, but border-width changes between states caused 2 px layout shift.
- **1.0.0** — archived at `Archive/BasicButton.1.0.0.tsx` (pre-token surface literals).

## Scope

- Implements variants with **Fixed state = False** only (fixed True is for separate Figma pages).
- Does not implement **Add component** or **.PlaceholderSmall**.
- Layout: padding from `layout.gap8` × 2 (horizontal) and `layout.gap4` × 2 (vertical), gap `layout.buttonInnerItemSpacing` (10), corner `layout.radiusM` (16), **Button-S** / **Button-M** typography from `design-tokens.ts`.
- **Icon:** `showIcon` + `iconName`; nested [`Icon`](../icon/README.md). When the icon is shown, it sits in an **IconWrapper**-sized box (`min` 24×24 Small / 36×36 Large, `borderRadius: layout.radiusS`) matching Figma.

## Token mapping (summary)

| Visual area | Token source (examples) |
|-------------|-------------------------|
| Fill / stroke | `semanticColors` — e.g. `backdropNautralBackground`, `backdropSurfaceColouredSurface`, `wrapperElevatedPressed`, `strokeColour`, `strokeSolid`, `strokeDisabled`, `strokeFocus`, `strokeHighlight`, … |
| Text | `colors` — `textHeadingNeutral`, `textBodyColour`, `textWhiteAtDarkenedSurface`, `textPressed`, `textDisabled` |
| Padding / radius / border width | `layout` — `gap4`, `gap8`, `radiusM`, `radiusS`, `strokeL`, `strokeXl`, `buttonInnerItemSpacing` |
| Focus ring (CSS, light UI) | `focusRingLight` (`#007B7F`). For dark or strong colour surfaces, design intent is `focusRingDark` — not wired until theme switching exists. |

Each **Type × Colour fill × State** row matches snapshot `COMPONENT` root `boundVariables` resolved via `dependency-graph.json` → keys above.

## Figma State ↔ component behaviour

| Figma **State** | Component |
|-----------------|-----------|
| Active | Default; pointer up, not disabled. |
| Pressed | Pointer down (non-latching) or latched (latching). |
| Disabled | `disabled={true}` (default visual: `state` omitted → **Disabled**, not **Disabled pressed**). |
| Disabled pressed | `disabled={true}` and `state="disabledPressed"`. |
| Focus | Keyboard `:focus-visible` shows `focusRingLight` ring; for Storybook-only preview use `state="focus"`. |

Optional **`state`** overrides the derived visual phase for docs/tests; omit it for normal behaviour.

## Props (Figma mapping)

| Prop | Figma |
|------|--------|
| `variant` | Type: Primary, Secondary, Tertiary, Subtle |
| `size` | Size: Small, Large |
| `colourFill` | Colour fill: True / False |
| `insideWrapper` | Inside wrapper: min 44×44 touch target (separate from icon visibility). |
| `showIcon` | Show icon: hides **wrapper + icon** when false. |
| `latching` | Latching function: click toggles pressed vs pointer-down-only |
| `showText` / `iconName` | Show text / icon swap |
| `state` | Optional override: `'active' \| 'pressed' \| 'disabled' \| 'disabledPressed' \| 'focus'` |
| `iconWeight` | Phosphor weight; default **`regular`** — matches Figma icon instance binding to **Stroke/stroke-m**. |
| `type` | Native `button` / `submit` / `reset` |
| `disabled` | Native disabled + disabled palette when `state` not overriding |

## Interaction

- **Latching false:** pressed look while pointer is down.
- **Latching true:** latched pressed until next click.
- **Focus:** `focusRingLight` ring (3px spread), keyboard `:focus-visible` or `state="focus"`.
- Transitions ~200ms in CSS (Figma prototype is slower).
