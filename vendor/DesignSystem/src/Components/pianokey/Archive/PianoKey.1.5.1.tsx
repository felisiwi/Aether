import React from 'react';
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from '../../tokens/design-tokens';

/**
 * PianoKey v1.5.1 — Figma COMPONENT_SET `PianoKey` (node 14938:17062 in batch snapshot).
 *
 * `variant="default"` matches v1.4.0 (Figma **Instrument=Piano**): bottom-rounded keys,
 * shortcut-only inside the key body.
 *
 * `variant="instrument"` matches Figma **Instrument=Keyboard**: full corner radius (`layout.radiusS`),
 * `strokeMedium` border, compact cells, **note + shortcut** visible inside the key (centred stack).
 *
 * Display-only — state is driven by `isPressed`. No focus/button semantics.
 */
export interface PianoKeyProps {
  note: string;
  shortcutLabel: string;
  isPressed: boolean;
  isBlack: boolean;
  /** `default` = v1.4.0 behaviour. `instrument` = Keyboard / instrument-screen treatment from Figma. */
  variant?: 'default' | 'instrument';
}

const WHITE_KEY_WIDTH = 48;
const WHITE_KEY_HEIGHT = 142;
const BLACK_KEY_WIDTH = 32;
const BLACK_KEY_HEIGHT = 89;

const INSTR_WHITE_W = layout.gap48;
const INSTR_WHITE_H = layout.gap96;
const INSTR_BLACK_SZ = layout.gap48;

const pad14 = layout.gap8 + layout.gap4 + layout.gap2;

export default function PianoKey({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
  variant = 'default',
}: PianoKeyProps) {
  if (variant === 'instrument') {
    return (
      <InstrumentKeyBody
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
    background = semanticColors.backdropStaticDarkenedWhite;
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
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    textAlign: 'center',
    color: isPressed
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

function InstrumentKeyBody({
  note,
  shortcutLabel,
  isPressed,
  isBlack,
}: Pick<PianoKeyProps, 'note' | 'shortcutLabel' | 'isPressed' | 'isBlack'>) {
  const w = isBlack ? INSTR_BLACK_SZ : INSTR_WHITE_W;
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
      ? colors.textPressed
      : isBlack
        ? semanticColors.strokeInvertedSolid
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
      ? colors.textPressed
      : isBlack
        ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
        : colors.textBodyNeutral,
  };

  const containerStyle: React.CSSProperties = {
    width: w,
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
