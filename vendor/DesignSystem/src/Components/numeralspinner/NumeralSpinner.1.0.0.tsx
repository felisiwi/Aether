import React from 'react';
import { typography as typographyTokens, fontFamily } from '../../tokens/design-tokens';

const titleM = typographyTokens.titleM;
const titleMWithLineHeight = { ...titleM, lineHeight: titleM.lineHeight };

/**
 * NumeralSpinner — digit spinner (0–9) from Variables Figma file (node 14200-71584).
 *
 * Design-to-code: Figma source
 *   https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=14200-71584
 *
 * Typography from design tokens (Title-M): design-tokens.ts is generated from dependency-graph;
 * re-export Figma variables and run build-dependency-graph + generate-design-tokens to update.
 */
const DIGIT_HEIGHT = titleM.lineHeight;
const DIGIT_WIDTH = 17;

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NumeralSpinnerDigit = (typeof DIGITS)[number];

export interface NumeralSpinnerProps {
  /** Digit to display (0–9) */
  value?: NumeralSpinnerDigit;
  className?: string;
  style?: React.CSSProperties;
}

export default function NumeralSpinner({
  value = '0',
  className,
  style,
}: NumeralSpinnerProps) {
  const index = DIGITS.indexOf(value);
  const offsetY = index * -DIGIT_HEIGHT;

  return (
    <div
      className={className}
      style={{
        height: DIGIT_HEIGHT,
        width: DIGIT_WIDTH,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
      role="img"
      aria-label={`Digit ${value}`}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: `translateX(-50%) translateY(${offsetY}px)`,
          width: DIGIT_WIDTH,
          fontFamily: fontFamily,
          fontVariationSettings: "'wdth' " + (titleMWithLineHeight.fontWidth ?? 108),
          fontFeatureSettings: "'ss01', 'lnum', 'tnum'",
          fontSize: titleMWithLineHeight.fontSize,
          fontWeight: titleMWithLineHeight.fontWeight,
          lineHeight: DIGIT_HEIGHT,
          textAlign: 'center',
        }}
      >
        {DIGITS.map((d) => (
          <div
            key={d}
            style={{
              height: DIGIT_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
