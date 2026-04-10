import React from 'react';
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from '../../tokens/design-tokens';

/**
 * PianoKey v1.2.0 — Figma "Frame 954" (14886:17770), Variables-Figma-file.
 * REST snapshot: Frame-954--cEvsxKUutB8c3TbI3RHk0n-14886-17770.json
 *
 * A single piano key for a laptop-keyboard-mapped piano interface.
 * Renders ONLY the keyboard shortcut label inside the key body (bottom-aligned).
 *
 * Note labels are NOT rendered by this component for either key type:
 *   - Black key note labels (e.g. "F#3") float ABOVE the keyboard in a shared row
 *     (Figma Frame 952 — separate horizontal row above the key row).
 *   - White key note labels (e.g. "G3") sit BELOW the keyboard in a shared row
 *     (Figma Frame 951 — separate horizontal row below the key row).
 * The parent keyboard container owns both label rows, positioned absolutely.
 * The `note` prop is kept for aria-label accessibility only.
 *
 * White key:  32×142 px · padding 16 all sides  · bg #E6E6E6 (default) / orange (pressed)
 * Black key:  32×89 px  · padding 8 all sides     · bg #1A1A1A (default) / orange (pressed)
 * Both keys:  bottom corners rounded (layout.radiusXs = 4 px) · 1 px border
 *             shortcut label bottom-aligned (Figma primaryAxisAlignItems: MAX)
 *
 * Display-only — state is driven by isPressed prop. The parent (Aether app) owns
 * event handling; no focus, button, or click semantics here.
 *
 * Bound variables resolved (DESIGN-TOKENS-FOR-COMPONENTS.md §Colour resolution):
 *   VariableID:9277:1271   → semanticColors.backdropSurfaceColouredSurface (#F04700) — pressed fill
 *   VariableID:13097:12508 → semanticColors.strokeWeak                     (#0000000f) — white key border
 *   VariableID:13097:12509 → semanticColors.strokeInvertedWeak             (#ffffff0f) — black key border
 *   VariableID:9272:2228   → colors.textDisabled                           (#0000001f) — white key shortcut (default)
 *   VariableID:13406:44547 → colors.textPressed                            (#FF8152)  — shortcut when pressed
 *   VariableID:14886:17771 → semanticColors.strokeInvertedMedium           (#ffffff1f) — black key shortcut (default)
 *   VariableID:2010:197    → layout.radiusXs                               (4 px)     — bottom corner radius
 *   VariableID:9053:54     → layout.gap16                                  (16 px)    — white key padding (all sides)
 *   VariableID:9053:53     → layout.gap8                                   (8 px)     — black key padding (all sides)
 *
 * White key default background (#E6E6E6) has no matching semantic token — hardcoded from
 * snapshot raw color. TODO: add a "white-key-surface" token for instrument UI.
 *
 * Black key default background uses semanticColors.backdropStatesHoverSurface (#1A1A1A)
 * — same resolved hex as snapshot raw color.
 *
 * v1.3.0 archived at Archive/PianoKey.1.3.0.tsx
 * v1.2.0 archived at Archive/PianoKey.1.2.0.tsx
 * v1.1.0 archived at Archive/PianoKey.1.1.0.tsx
 * v1.0.0 archived at Archive/PianoKey.1.0.0.tsx
 */
export interface PianoKeyProps {
  /**
   * Musical note name, e.g. "G3" or "F#3".
   * NOT rendered inside the key — used only in aria-label.
   * The parent keyboard container renders note labels:
   *   - above the key row for black keys (Figma Frame 952)
   *   - below the key row for white keys (Figma Frame 951)
   */
  note: string;
  /** Keyboard shortcut letter, e.g. "B" or "H". Rendered at the bottom of the key. */
  shortcutLabel: string;
  /** Whether the key is currently being pressed. */
  isPressed: boolean;
  /** Whether this is a black (sharp/flat) key. Affects size, colours, and padding. */
  isBlack: boolean;
}

// White key: 16 px padding each side + 16 px label content area = 48 px total (Figma HUG)
const WHITE_KEY_WIDTH = 48;
const WHITE_KEY_HEIGHT = 142;
// Black key: 8 px padding each side + 16 px label content area = 32 px total (Figma HUG)
const BLACK_KEY_WIDTH = 32;
const BLACK_KEY_HEIGHT = 89;

/** White key default surface — no semantic token yet. TODO: white-key-surface token. */
const WHITE_KEY_DEFAULT_BG = '#E6E6E6';

export default function PianoKey({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
}: PianoKeyProps) {
  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH;
  const height = isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT;
  const paddingH = layout.gap8;
  const paddingV = isBlack ? layout.gap8 : layout.gap16;

  let background: string;
  if (isPressed) {
    background = semanticColors.backdropSurfaceColouredSurface;
  } else if (isBlack) {
    background = semanticColors.backdropStatesHoverSurface;
  } else {
    background = WHITE_KEY_DEFAULT_BG;
  }

  const borderColor = isBlack
    ? semanticColors.strokeInvertedWeak
    : semanticColors.strokeWeak;

  const containerStyle: React.CSSProperties = {
    width,
    height,
    paddingLeft: paddingH,
    paddingRight: paddingH,
    paddingTop: paddingV,
    paddingBottom: paddingV,
    background,
    border: `${layout.strokeS}px solid ${borderColor}`,
    borderRadius: `0 0 ${layout.radiusXs}px ${layout.radiusXs}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
    position: 'relative',
  };

  const shortcutLabelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.bodyS.fontSize,
    fontWeight: 400,
    lineHeight: '18px',
    letterSpacing: typography.bodyS.letterSpacing,
    textAlign: 'center',
    color: isPressed
      ? colors.textPressed
      : isBlack
      /**
       * VariableID:14886:17771 — inverted-disabled text.
       * Not yet in design-tokens.ts; resolved hex #ffffff1f matches
       * semanticColors.strokeInvertedMedium.
       * TODO: export inverted-disabled text token.
       */
      ? semanticColors.strokeInvertedMedium
      : colors.textDisabled,
  };

  return (
    <div
      style={containerStyle}
      aria-label={`${note} — ${shortcutLabel}`}
      role="img"
    >
      <span style={shortcutLabelStyle}>{shortcutLabel}</span>
    </div>
  );
}
