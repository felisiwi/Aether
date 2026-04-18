import React from "react";
import BinaryController from "../binarycontroller/BinaryController.1.0.0";
import { layout } from "../../tokens/design-tokens";

export interface KeyOctaveControllerProps {
  keyValue: string;
  octaveValue: string;
  onKeyUp: () => void;
  onKeyDown: () => void;
  onOctaveUp: () => void;
  onOctaveDown: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Key + octave display with two {@link BinaryController}s side by side.
 *
 * Snapshot `KeyOctaveController--…-15403-230651.json`: root `itemSpacing` `VariableID:9053:53`
 * → Layout/gap-8 (`layout.gap8`); `layoutMode` HORIZONTAL, `counterAxisAlignItems` MAX →
 * cross-axis end alignment; `primaryAxisAlignItems` CENTER.
 */
export const KeyOctaveController: React.FC<KeyOctaveControllerProps> = ({
  keyValue,
  octaveValue,
  onKeyUp,
  onKeyDown,
  onOctaveUp,
  onOctaveDown,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: layout.gap8,
        boxSizing: "border-box",
        ...style,
      }}
      role="group"
      aria-label="Key and octave"
    >
      <BinaryController
        title="Key"
        value={keyValue}
        onUp={onKeyUp}
        onDown={onKeyDown}
      />
      <BinaryController
        title="Octave"
        value={octaveValue}
        onUp={onOctaveUp}
        onDown={onOctaveDown}
        upIcon="chevron-right"
        downIcon="chevron-left"
      />
    </div>
  );
};

KeyOctaveController.displayName = "KeyOctaveController";
export default KeyOctaveController;
