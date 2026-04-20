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
 * PianoKey v1.5.2 — Figma COMPONENT_SET `PianoKey` (node 14938:17062 in batch snapshot).
 *
 * `variant="default"` matches v1.4.0 (Figma **Instrument=Piano**): bottom-rounded keys,
 * shortcut-only inside the key body.
 *
 * `variant="instrument"` matches Figma **Instrument=Keyboard**: full corner radius (`layout.radiusS`),
 * `strokeMedium` border, compact cells, **note + shortcut** visible inside the key (centred stack).
 *
 * **`state="hint"`** matches Figma **State=Hint** (fills `VariableID:15053:29127` → `backdropStaticElevatedSurface`,
 * strokes `VariableID:13012:18766` → `strokeColourPressed`; Keyboard shortcut text `VariableID:13406:44547` → `colors.textPressed`;
 * note label `VariableID:9006:26` → `colors.textHeadingColour`; Piano shortcut-only `VariableID:9006:26`).
 *
 * Display-only — state is driven by `isPressed` / `state`. No focus/button semantics.
 */

/** Figma `State` variant options on the PianoKey component set. */
export type PianoKeyState = 'default' | 'ghost' | 'pressed' | 'hint';

export interface PianoKeyProps {
  note: string;
  shortcutLabel: string;
  isPressed: boolean;
  isBlack: boolean;
  /** Remote peer is holding this note (local key idle); Keyboard / instrument tile purple outline. */
  isGhost?: boolean;
  /** `default` = v1.4.0 behaviour. `instrument` = Keyboard / instrument-screen treatment from Figma. */
  variant?: 'default' | 'instrument';
  /**
   * Figma `State` variant. `hint` = State=Hint (peachy surface, orange border, orange labels).
   * Pressed appearance uses `isPressed` or `state="pressed"`. `ghost` is reserved (same as `default` until implemented).
   */
  state?: PianoKeyState;
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
  isGhost = false,
  variant = 'default',
  state = 'default',
}: PianoKeyProps) {
  const showPressed = isPressed || state === 'pressed';
  const showHint = !showPressed && state === 'hint';
  const showGhost =
    !showPressed && !showHint && (isGhost || state === 'ghost');

  if (variant === 'instrument') {
    return (
      <InstrumentKeyBody
        note={note}
        shortcutLabel={shortcutLabel}
        isBlack={isBlack}
        showPressed={showPressed}
        showHint={showHint}
        showGhost={showGhost}
      />
    );
  }

  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH;
  const height = isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT;

  if (showHint) {
    const paddingH = isBlack ? layout.gap8 : layout.gap16;
    const paddingV = layout.gap8;
    const containerStyle: React.CSSProperties = {
      width,
      height,
      paddingLeft: paddingH,
      paddingRight: paddingH,
      paddingTop: paddingV,
      paddingBottom: paddingV,
      background: semanticColors.backdropStaticElevatedSurface,
      border: `${layout.strokeS}px solid ${semanticColors.strokeColourPressed}`,
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
      color: colors.textHeadingColour,
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

  const paddingH = layout.gap8;
  const paddingV = isBlack ? layout.gap8 : layout.gap16;

  let background: string;
  if (showPressed) {
    background = semanticColors.backdropSurfaceColouredSurface;
  } else if (isBlack) {
    background = semanticColors.backdropStatesHoverSurface;
  } else {
    background = semanticColors.backdropStaticDarkenedWhite;
  }

  const borderColor = showGhost
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
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    textAlign: 'center',
    color: showGhost
      ? themeTokens.purple.primary50
      : showPressed
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
  isBlack,
  showPressed,
  showHint,
  showGhost,
}: {
  note: string;
  shortcutLabel: string;
  isBlack: boolean;
  showPressed: boolean;
  showHint: boolean;
  showGhost: boolean;
}) {
  const w = isBlack ? INSTR_BLACK_SZ : INSTR_WHITE_W;
  const h = isBlack ? INSTR_BLACK_SZ : INSTR_WHITE_H;

  if (showHint) {
    const padH = layout.gap8;
    const padV = layout.gap4;
    const borderW = layout.strokeM;
    const background = semanticColors.backdropStaticElevatedSurface;
    const borderCol = semanticColors.strokeColourPressed;

    const shortcutStyle: React.CSSProperties = {
      fontFamily,
      fontSize: typography.bodyS.fontSize,
      fontWeight: 400,
      lineHeight: `${typography.bodyS.lineHeight}px`,
      letterSpacing: typography.bodyS.letterSpacing,
      textAlign: 'center',
      color: colors.textPressed,
    };

    const noteStyle: React.CSSProperties = {
      fontFamily,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      lineHeight: `${typography.label.lineHeight}px`,
      letterSpacing: typography.label.letterSpacing,
      fontStretch: `${typography.label.fontWidth}%`,
      textAlign: 'center',
      color: colors.textHeadingColour,
    };

    const containerStyle: React.CSSProperties = {
      width: w,
      height: h,
      paddingLeft: padH,
      paddingRight: padH,
      paddingTop: padV,
      paddingBottom: padV,
      background,
      border: `${borderW}px solid ${borderCol}`,
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

  let background: string;
  if (showPressed) {
    background = semanticColors.backdropSurfaceColouredSurface;
  } else if (isBlack) {
    background = semanticColors.backdropStaticLightenedBlack;
  } else {
    background = semanticColors.backdropStaticDarkenedWhite;
  }

  const borderCol = showGhost
    ? themeTokens.purple.primary50
    : semanticColors.strokeMedium;

  const shortcutStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.bodyS.fontSize,
    fontWeight: 400,
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    textAlign: 'center',
    color: showPressed
      ? colors.textPressed
      : showGhost
        ? themeTokens.purple.primary50
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
    color: showPressed
      ? colors.textPressed
      : showGhost
        ? themeTokens.purple.primary50
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
