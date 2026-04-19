import React from 'react';
import { typography as typographyTokens, fontFamily, colors as colorTokens } from '../../tokens/design-tokens';
import NumeralSpinner, { type NumeralSpinnerDigit } from '../numeralspinner/NumeralSpinner.1.0.0';

/**
 * WpmData v1.1.0 — WPM (words per minute) display: three digits + "WPM" label.
 * Figma node 14215-82300. States: Passive (default), Active (orange), Inactive (disabled).
 *
 * Layout from snapshot (State=Passive frame): vertical, center-aligned, padding 0, height 48 (HUG).
 * Composes three NumeralSpinner (100s, 10s, 1s) and a Label-typography "WPM" line.
 * Reuses NumeralSpinner from registry (leaf).
 *
 * Design-to-code: https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14215-82300
 */

const DIGITS: NumeralSpinnerDigit[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const labelStyle = typographyTokens.label;
const labelLineHeight = labelStyle.lineHeight;

export type WpmDataState = 'Passive' | 'Active' | 'Inactive';

export interface WpmDataProps {
  /** WPM value 0–999 */
  value?: number;
  /** Visual state: Passive (default), Active (orange), Inactive (grey) */
  state?: WpmDataState;
  className?: string;
  style?: React.CSSProperties;
}

// From design-tokens (Text/Practical text; Light mode). Re-export Figma variables and run generate-design-tokens to update.
const COLORS = {
  Passive: { number: colorTokens.textHeadingNeutral, label: colorTokens.textBodyNeutral },
  Active: { number: colorTokens.textHeadingColour, label: colorTokens.textBodyNeutral },
  Inactive: { number: colorTokens.textDisabled, label: colorTokens.textDisabled },
} as const;

export default function WpmData({
  value = 0,
  state = 'Passive',
  className,
  style,
}: WpmDataProps) {
  const clamped = Math.max(0, Math.min(999, Math.round(value)));
  const hundreds = Math.floor(clamped / 100) % 10;
  const tens = Math.floor((clamped % 100) / 10);
  const ones = clamped % 10;
  const d1: NumeralSpinnerDigit = DIGITS[hundreds];
  const d2: NumeralSpinnerDigit = DIGITS[tens];
  const d3: NumeralSpinnerDigit = DIGITS[ones];
  const colors = COLORS[state];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 0,
        padding: 0,
        position: 'relative',
        flexShrink: 0,
        boxSizing: 'border-box',
        minWidth: 51, // Figma snapshot: State=Passive width 51 (HUG)
        height: 48, // Figma snapshot: State=Passive height 48 (HUG) — prevents Storybook/canvas from stretching
        ...style,
      }}
      role="img"
      aria-label={`${clamped} WPM`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          color: colors.number,
        }}
      >
        <NumeralSpinner value={d1} />
        <NumeralSpinner value={d2} />
        <NumeralSpinner value={d3} />
      </div>
      <p
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          fontFamily: fontFamily,
          fontSize: labelStyle.fontSize ?? 10,
          fontWeight: labelStyle.fontWeight,
          lineHeight: labelLineHeight,
          textAlign: 'center',
          color: colors.label,
          fontFeatureSettings: "'ss01', 'lnum', 'tnum'",
        }}
      >
        WPM
      </p>
    </div>
  );
}
