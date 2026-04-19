import React from 'react';

/**
 * VariablesFrame — Frame from Variables Figma file (node 13998-5871).
 *
 * Design-to-code: Figma source
 *   https://www.figma.com/design/cEvsxKUutB8c3TbI3RHk0n/Variables-Figma-file?node-id=13998-5871
 *
 * Structure: Run fetch-figma-node.js with fileKey cEvsxKUutB8c3TbI3RHk0n and nodeId 13998-5871
 * to get the exact node tree; then update this component to match layout and nesting.
 * Tokens (radius, padding) from design system dependency-graph derivedTokens where applicable.
 */

// Design system derived tokens (from dependency-graph.json derivedTokens.default)
const RADIUS_CONTAINER = 24;
const PADDING_BUTTON = 16;

export interface VariablesFrameProps {
  children?: React.ReactNode;
  /** Optional padding override (default from design system) */
  padding?: number;
  /** Optional corner radius override */
  radius?: number;
  /** Optional inline style */
  style?: React.CSSProperties;
  className?: string;
}

export default function VariablesFrame({
  children,
  padding = PADDING_BUTTON,
  radius = RADIUS_CONTAINER,
  style,
  className,
}: VariablesFrameProps) {
  return (
    <div
      className={className}
      style={{
        padding,
        borderRadius: radius,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
