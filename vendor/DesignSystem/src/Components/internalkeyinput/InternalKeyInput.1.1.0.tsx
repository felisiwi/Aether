import React from "react";
import { Note } from "../note/Note.1.1.0";
import type { NoteType } from "../note/Note.1.1.0";
import { layout } from "../../tokens/design-tokens";

export interface InternalKeyInputNote {
  note: string;
  type: NoteType;
}

/**
 * Up to 8 {@link Note}s in a ChordDisplay note area (Figma `InternalKeyInput` 15398:179895).
 * Root stack gap: `VariableID:9053:53` → `layout.gap8`; row itemSpacing: `VariableID:9053:55` → `layout.gap24`.
 */
export interface InternalKeyInputProps {
  notes: InternalKeyInputNote[];
  themeIndex?: 0 | 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_NOTES = 8;

export const InternalKeyInput: React.FC<InternalKeyInputProps> = ({
  notes,
  themeIndex = 0,
  className,
  style,
}) => {
  const items = notes.slice(0, MAX_NOTES);

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: layout.gap8,
    background: "none",
    ...style,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: layout.gap24,
  };

  if (items.length === 0) {
    return (
      <div
        className={className}
        style={rootStyle}
        role="group"
        aria-label="Chord notes"
      />
    );
  }

  const row1 = items.length <= 4 ? items : items.slice(0, 4);
  const row2 = items.length > 4 ? items.slice(4) : [];

  return (
    <div
      className={className}
      style={rootStyle}
      role="group"
      aria-label="Chord notes"
    >
      <div style={rowStyle}>
        {row1.map((n, index) => (
          <Note
            key={`r0-${index}-${n.note}`}
            note={n.note}
            type={n.type}
            size="large"
            themeIndex={themeIndex}
          />
        ))}
      </div>
      {row2.length > 0 ? (
        <div style={rowStyle}>
          {row2.map((n, index) => (
            <Note
              key={`r1-${index}-${n.note}`}
              note={n.note}
              type={n.type}
              size="large"
              themeIndex={themeIndex}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

InternalKeyInput.displayName = "InternalKeyInput";
export default InternalKeyInput;
