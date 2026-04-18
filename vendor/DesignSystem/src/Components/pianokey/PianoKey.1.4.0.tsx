import React from 'react';
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
  themeTokens,
} from '../../tokens/design-tokens';

/**
 * PianoKey v1.4.0 — Figma "Frame 954" (14886:17770), Variables-Figma-file.
 * REST snapshot: Frame-954--cEvsxKUutB8c3TbI3RHk0n-14886-17770.json
 *
 * `variant="default"`: tall piano keys; shortcut-only inside the key body (bottom-aligned).
 *
 * `variant="instrument"`: flat keyboard-cap tiles (Figma PianoKey COMPONENT_SET 14938:17062) —
 * shortcut + note stacked, full `layout.radiusS` corners.
 *
 * Display-only — state is driven by isPressed prop.
 */
export interface PianoKeyProps {
  /**
   * Musical note name, e.g. "G3" or "F#3".
   * For `variant="default"`: aria only (labels live in parent rows).
   * For `variant="instrument"`: rendered inside the tile below the shortcut.
   */
  note: string;
  /** Keyboard shortcut letter, e.g. "B" or "H". */
  shortcutLabel: string;
  /** Whether the key is currently being pressed. */
  isPressed: boolean;
  /** Whether this is a black (sharp/flat) key. */
  isBlack: boolean;
  /** Remote peer is holding this note (local key idle). */
  isGhost?: boolean;
  /** `default` = tall piano key. `instrument` = laptop keyboard cap tile (JamRoom Keyboard mode). */
  variant?: 'default' | 'instrument';
}

// White key: 16 px padding each side + 16 px label content area = 48 px total (Figma HUG)
const WHITE_KEY_WIDTH = 48;
const WHITE_KEY_HEIGHT = 142;
// Black key: 8 px padding each side + 16 px label content area = 32 px total (Figma HUG)
const BLACK_KEY_WIDTH = 32;
const BLACK_KEY_HEIGHT = 89;

/** White key default surface — no semantic token yet. TODO: white-key-surface token. */
const WHITE_KEY_DEFAULT_BG = '#E6E6E6';

/** Instrument variant — tile heights; widths flex with `flex: 1` / `minWidth: gap32`. */
const INSTR_WHITE_H = layout.gap96;
const INSTR_BLACK_SZ = layout.gap48;

const pad14 = layout.gap8 + layout.gap4 + layout.gap2;

export default function PianoKey({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
  isGhost = false,
  variant = 'default',
}: PianoKeyProps) {
  if (variant === 'instrument') {
    return (
      <InstrumentKeyTile
        note={note}
        shortcutLabel={shortcutLabel}
        isPressed={isPressed}
        isBlack={isBlack}
      />
    );
  }

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

  const borderColor =
    isGhost && !isPressed
      ? themeTokens.purple.primary50
      : isBlack
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
    color: isGhost
      ? themeTokens.purple.primary50
      : isPressed
        ? colors.textPressed
        : isBlack
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

function InstrumentKeyTile({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
}: Pick<PianoKeyProps, 'note' | 'shortcutLabel' | 'isPressed' | 'isBlack'>) {
  const h = isBlack ? INSTR_BLACK_SZ : INSTR_WHITE_H;

  let background: string;
  if (isPressed) {
    background = semanticColors.backdropSurfaceColouredSurface;
  } else if (isBlack) {
    background = semanticColors.backdropStaticLightenedBlack;
  } else {
    background = semanticColors.backdropStaticDarkenedWhite;
  }

  const borderCol = semanticColors.strokeMedium;

  const shortcutStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.bodyS.fontSize,
    fontWeight: 400,
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    textAlign: 'center',
    color: isPressed
      ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
      : isBlack
        ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
        : colors.textBodyNeutral,
  };

  const noteStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontStretch: `${typography.label.fontWidth}%`,
    textAlign: 'center',
    color: isPressed
      ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
      : isBlack
        ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
        : colors.textBodyNeutral,
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: layout.gap32,
    height: h,
    paddingLeft: layout.gap8,
    paddingRight: layout.gap8,
    paddingTop: isBlack ? layout.gap4 : pad14,
    paddingBottom: isBlack ? layout.gap4 : pad14,
    background,
    border: `${layout.strokeS}px solid ${borderCol}`,
    borderRadius: layout.radiusS,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: layout.gap4,
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  return (
    <div style={containerStyle} aria-label={`${note} — ${shortcutLabel}`} role="img">
      <span style={shortcutStyle}>{shortcutLabel}</span>
      <span style={noteStyle}>{note}</span>
    </div>
  );
}
