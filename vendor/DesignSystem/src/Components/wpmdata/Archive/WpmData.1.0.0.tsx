import React from 'react';
import { typography as typographyTokens, fontFamily, colors as colorTokens } from '../../../tokens/design-tokens';
import NumeralSpinner, { type NumeralSpinnerDigit } from '../../numeralspinner/NumeralSpinner.1.0.0';

/**
 * WpmData — WPM (words per minute) display: three digits + "WPM" label.
 * Figma node 14215-82300. States: Passive (default), Active (orange), Inactive (disabled).
 *
 * Composes three NumeralSpinner (100s, 10s, 1s) and a Label-typography "WPM" line.
 * Reuses NumeralSpinner from registry (leaf).
 *
 * Design-to-code: https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14215-82300
 *
 * Archived: superseded by WpmData.1.1.0 (layout from Figma snapshot, label lineHeight from tokens).
 */

const DIGITS: NumeralSpinnerDigit[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

type LabelTokens = { fontSize: number; fontWeight?: number; lineHeight?: number };
const typography = typographyTokens as unknown as Record<string, LabelTokens>;
const labelStyle = typography.Label ?? { fontSize: 10 };
// Figma: Auto layout padding 0, height 48 Hug. Digit row = 32px; label tight so total ~48.
const labelLineHeight = 10;

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
        gap: 0,
        padding: 0,
        position: 'relative',
        flexShrink: 0,
        boxSizing: 'border-box',
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
          fontSize: labelStyle.fontSize,
          fontWeight: (typography.label as { fontWeight?: number })?.fontWeight ?? 600,
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
