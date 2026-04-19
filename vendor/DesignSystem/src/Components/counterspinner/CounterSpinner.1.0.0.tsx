import React from 'react';
import NumeralSpinner, { type NumeralSpinnerDigit } from '../numeralspinner/NumeralSpinner.1.0.0';

/**
 * CounterSpinner — three-digit counter (hundreds + tens) from Variables Figma file (node 14204-72511).
 *
 * Composes three NumeralSpinner components: hundreds (1–9), tens first digit (0–9), tens second digit (0).
 * Figma variants: Hundred's=1..9, Ten's=00|10|20|...|90.
 *
 * Design-to-code: Figma source
 *   https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14204-72511
 *
 * Leaf component: NumeralSpinner (src/Components/numeralspinner) — exists in registry; reused.
 */

const HUNDREDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const TENS_OPTIONS = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'] as const;

export type CounterSpinnerHundreds = (typeof HUNDREDS)[number];
export type CounterSpinnerTens = (typeof TENS_OPTIONS)[number];

export interface CounterSpinnerProps {
  /** Hundreds digit (1–9) */
  hundreds?: CounterSpinnerHundreds;
  /** Tens value as two digits: 00, 10, 20, ..., 90 */
  tens?: CounterSpinnerTens;
  className?: string;
  style?: React.CSSProperties;
}

export default function CounterSpinner({
  hundreds = '1',
  tens = '00',
  className,
  style,
}: CounterSpinnerProps) {
  const tensFirst: NumeralSpinnerDigit = tens[0] as NumeralSpinnerDigit;
  const tensSecond: NumeralSpinnerDigit = tens[1] as NumeralSpinnerDigit;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
      role="img"
      aria-label={`Counter ${hundreds}${tens}`}
    >
      <NumeralSpinner value={hundreds} />
      <NumeralSpinner value={tensFirst} />
      <NumeralSpinner value={tensSecond} />
    </div>
  );
}
