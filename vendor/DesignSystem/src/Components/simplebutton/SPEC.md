# SimpleButton — Spec v1.2

**Figma:** node `15216:46700` (four named states).

## States (exact Figma names)

| State | Fill | Icon + text | Padding | Border |
| --- | --- | --- | --- | --- |
| **Active** | `semanticColors.buttonSurfacePrimary` | `colors.textLabel` (black) | Equal on all sides | None |
| **Pressed** | `semanticColors.buttonSurfaceSmallbuttonPressed` | `semanticColors.semanticStrokeStaticStrokeWhiteSolid` (lighter than black-on-orange **Active**; WCAG-safe on this fill — Figma `buttonTextDisabledTextColour` does not meet contrast here) | Reduced bottom padding only (top/sides unchanged) | None |
| **Default** | `semanticColors.backdropStaticBlack` | `semanticColors.semanticStrokeStaticStrokeWhiteSolid` (white) | Equal on all sides | None |
| **Disabled** | `semanticColors.backdropStatesDisabledSurface` | `colors.textDisabled` | Equal on all sides | None |

## Layout

- Icon + label in a row, **horizontally centred** in the button.
- **Corner radius:** `layout.radiusM`.
- **Width:** hugs content.
- **Height:** `minHeight: layout.gap40` (40px target). Equal vertical padding uses `layout.gap4` with a 32px icon row; **Pressed** uses more top padding and less bottom padding for the “pushed” look (see implementation).
- **Icon:** `Icon` with waveform name from props (`iconName`).
- **Gap** between icon and label: `layout.gap8` minimum.

## Implementation

- File: `SimpleButton.1.2.0.tsx`.
- `disabled === true` maps to **Disabled**; otherwise `state` maps to **Active** | **Pressed** | **Default**.
