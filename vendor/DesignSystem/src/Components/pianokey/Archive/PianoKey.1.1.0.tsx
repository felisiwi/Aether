import React from 'react';
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from '../../tokens/design-tokens';

/**
 * PianoKey v1.1.0 — Figma "Frame 954" (14886:17770), Variables-Figma-file.
 * REST snapshot: Frame-954--cEvsxKUutB8c3TbI3RHk0n-14886-17770.json
 *
 * A single piano key for a laptop-keyboard-mapped piano interface.
 *
 * WHITE KEY: shows note label (top) and shortcut label (bottom) inside the key.
 *   — Matches Figma Frame 951 pattern where white key notes appear adjacent to the key.
 *
 * BLACK KEY: shows shortcut label (bottom) only — NO note label inside the key.
 *   — The note label for black keys (e.g. "F#3") floats ABOVE the key, outside its
 *     bounds, in the gap between the top of the keyboard and the top of the black key.
 *     The parent keyboard container is responsible for rendering and positioning those
 *     labels (matches Figma Frame 952: a separate horizontal row above the key row).
 *
 * White key:  32×142 px · padding 8 all sides · bg #E6E6E6 (default) / orange (pressed)
 * Black key:  24×89 px  · padding 8 top/bottom, 4 left/right · bg #1A1A1A (default) / orange (pressed)
 * Both keys:  bottom corners rounded (layout.radiusXs = 4 px), 1 px border.
 *
 * Display-only — state is driven by isPressed prop. The parent (JamLink app) owns
 * event handling; no focus, button, or click semantics here.
 *
 * Bound variables resolved (see DESIGN-TOKENS-FOR-COMPONENTS.md §Colour resolution):
 *   VariableID:9277:1271  → semanticColors.backdropSurfaceColouredSurface  (#F04700) — pressed fill
 *   VariableID:13097:12508 → semanticColors.strokeWeak                      (#0000000f) — white key border
 *   VariableID:13097:12509 → semanticColors.strokeInvertedWeak              (#ffffff0f) — black key border
 *   VariableID:9272:2228  → colors.textDisabled                             (#0000001f) — white key shortcut (default)
 *   VariableID:13406:44547 → colors.textPressed                             (#FF8152)  — shortcut when pressed
 *   VariableID:14886:17771 → semanticColors.strokeInvertedMedium            (#ffffff1f) — black key shortcut (default)
 *   VariableID:14886:17772 → colors.textBodyNeutralDark                     (#ffffff99) — black key note label (rendered by parent)
 *   VariableID:9006:26    → colors.textHeadingColour                        (#F04700)  — pressed note label
 *   VariableID:2010:197   → layout.radiusXs                                 (4 px)     — bottom corner radius
 *   VariableID:9053:53    → layout.gap8                                     (8 px)     — white key padding / black key top+bottom
 *   VariableID:9053:52    → layout.gap4                                     (4 px)     — black key left+right padding
 *
 * White key default background (#E6E6E6) has no matching semantic token in the
 * current design system — hardcoded from snapshot raw color. TODO: add a
 * "white-key-surface" semantic token when the design system covers instrument UI.
 *
 * Black key default background uses semanticColors.backdropStatesHoverSurface (#1A1A1A)
 * — same resolved hex as the snapshot raw color. Semantic meaning differs slightly
 * (hover surface vs instrument key), but is the correct token until a dedicated token exists.
 *
 * v1.0.0 archived at Archive/PianoKey.1.0.0.tsx.
 */
export interface PianoKeyProps {
  /**
   * Musical note name, e.g. "G3" or "F#3".
   * For WHITE keys: rendered inside the key at the top.
   * For BLACK keys: NOT rendered inside the key — the parent keyboard container
   * is responsible for displaying this label above the key.
   * Always included in aria-label for accessibility regardless of key type.
   */
  note: string;
  /** Keyboard shortcut letter, e.g. "B" or "H". Rendered at the bottom of the key. */
  shortcutLabel: string;
  /** Whether the key is currently being pressed. */
  isPressed: boolean;
  /** Whether this is a black (sharp/flat) key. Affects size, colours, and label rendering. */
  isBlack: boolean;
}

const WHITE_KEY_WIDTH = 32;
const WHITE_KEY_HEIGHT = 142;
const BLACK_KEY_WIDTH = 24;
const BLACK_KEY_HEIGHT = 89;

/**
 * White key default surface — no semantic token yet.
 * TODO: replace with a dedicated white-key-surface token.
 */
const WHITE_KEY_DEFAULT_BG = '#E6E6E6';

export default function PianoKey({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
}: PianoKeyProps) {
  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH;
  const height = isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT;
  const paddingH = isBlack ? layout.gap4 : layout.gap8;
  const paddingV = layout.gap8;

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
    justifyContent: isBlack ? 'flex-end' : 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
    position: 'relative',
  };

  const noteLabelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontVariationSettings: `"wdth" 120`,
    textAlign: 'center',
    color: isPressed ? colors.textHeadingColour : colors.textBodyNeutral,
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
       * Not yet exported from design-tokens.ts; resolved hex #ffffff1f matches
       * semanticColors.strokeInvertedMedium. TODO: export inverted-disabled text token.
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
      {!isBlack && <span style={noteLabelStyle}>{note}</span>}
      <span style={shortcutLabelStyle}>{shortcutLabel}</span>
    </div>
  );
}
