# Icon

Single atom component for the design system icon set. One component with `name`, `size`, and `weight`. Colour defaults to **`colors.textHeadingNeutral`**; optional **`color`** prop lets parents (e.g. **BasicButton**) match icon ink to label text. **Phosphor** icons (navigation, calculate, socials) and **custom** icons (media: rewind, fast-forward, play, pause, stop) both support **`weight: 'regular' | 'fill'`** so you can use the same selector for all. Custom icons use size-based corner radius: 16 → 0, 24 → 0.5px, 32 → 1px.

## Figma source

- **File**: [Variables-Figma-file](https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file)
- **Node**: Icon collection `13960-3118` (section containing all icon component sets)
- **Snapshots**:
  - Full collection: `Data/figma-variables/fetched-nodes/Icon-collection--cEvsxKUutB8c3TbI3RHk0n-13960-3118.json`
  - Optional reference for media icons: `Iconscustom--…-14322-19288.json` (**Icons/custom**). In code, **filled** custom icons use the **same** outline paths/rects as **regular**, with `fill` instead of `stroke` (identical silhouette).

In Figma, icons are organised as component sets per category (calculate, socials, navigation, media) with size variants 32 / 24 / 16. In code we use a flat list of `name` values; categories are for organisation only.

## Usage

```tsx
import Icon from './Icon.1.2.0';
import { ICON_NAMES } from './icon-names';

<Icon name="play" size={24} />
<Icon name="close" size={32} weight="fill" />
<Icon name="arrow-left" size={16} />
```

## Props

| Prop     | Type     | Default   | Description                                                                 |
|----------|----------|-----------|-----------------------------------------------------------------------------|
| `name`   | IconName | —         | Icon name (see `icon-names.ts` / ICON_NAMES)                                |
| `size`   | 16 \| 24 \| 32 | 24  | Size in px                                                                  |
| `weight` | 'regular' \| 'fill' | 'regular' | Outline (regular) or filled. Same for Phosphor and custom (media) icons. |
| `color` | string | — | Optional CSS colour; when omitted, uses `colors.textHeadingNeutral` from design tokens. |
| `className` | string | —      | Optional CSS class                                                         |
| `style`  | object   | —         | Optional inline styles (e.g. layout)                                        |

## Weight and custom icons

- **Same selector for all:** Both Phosphor and custom icons support **`weight: 'regular' | 'fill'`** (outline vs filled).
- **Phosphor** (navigation, calculate, socials): close, arrows, chevrons, hamburger, search, filter, home, component, plus, minus, instagram, facebook, pinterest, tiktok, x (XLogo), youtube.
- **Custom** (media + waveform, in **`custom-icons.tsx`**): rewind, fast-forward, play, pause, stop, waveform-sine, waveform-triangle, waveform-sawtooth, waveform-square. Each has outline and fill support; waveform icons follow Figma vector nodes.

## Dependencies

- **@phosphor-icons/react** — Phosphor icons for navigation, calculate, and socials (Instagram, Facebook, Pinterest, TikTok, X logo, YouTube); `weight` applies.
- **custom-icons.tsx** — Custom icon components for media (rewind, fast-forward, play, pause, stop) with outline/fill and size-based radius; replace with Figma SVGs if needed.
- **Design tokens** — `src/tokens/design-tokens.ts` for default icon colour. Re-export Figma variables and run `generate-design-tokens.js` to update.

## Icon names and Figma mapping

See `icon-names.ts`: `ICON_NAMES` (flat list) and `FIGMA_PATH_TO_NAME` (Figma path → code name). Names align with Figma: e.g. `.icons/media/Play` → `play`, `.icons/navigation/Close` → `close`.

## Accessibility

Display-only atom; no interactive semantics. Parent components are responsible for focus and labels when the icon is part of a button or link. Use `aria-hidden` when the icon is decorative (as in this component).

## Kotlin / other platforms

Same contract: one Icon with `name`, `size`, colour from design system. Implement with Phosphor Android (or drawables) and the same `name` set so behaviour stays consistent across platforms.
