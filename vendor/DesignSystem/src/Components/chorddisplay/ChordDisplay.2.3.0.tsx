import React from "react";
import InternalKeyInput from "../internalkeyinput/InternalKeyInput.1.0.0";
import { Tag } from "../tag/Tag.1.0.0";
import { getPlayerTheme, type ThemeIndex } from "../../tokens/theme-map";
import { layout, semanticColors } from "../../tokens/design-tokens";

export type ChordDisplayVariant = "default" | "themed" | "oscilloscope";

export interface ChordDisplayNote {
  note: string;
  partOfChord: boolean;
}

/**
 * Chord card: `default` (local orange), `themed` (remote player colour), or `oscilloscope` (solo waveform canvas).
 * Padding: `Type=Default` / `Themed` — `VariableID:9053:54` → `layout.gap16`. `Oscilloscope` — horizontal `9053:54`, vertical `9053:53`.
 */
export interface ChordDisplayProps {
  variant: ChordDisplayVariant;
  notes?: ChordDisplayNote[];
  chordName?: string;
  themeIndex?: ThemeIndex;
  oscilloscopeRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
  style?: React.CSSProperties;
}

const CARD_HEIGHT = 180;

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  variant,
  notes = [],
  chordName,
  themeIndex = 0,
  oscilloscopeRef,
  className,
  style,
}) => {
  const isOsc = variant === "oscilloscope";
  const themedIdx = themeIndex as ThemeIndex;
  const theme = getPlayerTheme(themedIdx);

  const borderColor =
    variant === "themed"
      ? theme.primary50
      : semanticColors.strokeColour;

  const backgroundColor = (() => {
    if (variant === "oscilloscope") {
      return semanticColors.backdropStaticBlack;
    }
    if (variant === "themed") {
      return theme.primary50;
    }
    return semanticColors.backdropSurfaceColouredSurface;
  })();

  const paddingStyle: React.CSSProperties = isOsc
    ? {
        paddingLeft: layout.gap16,
        paddingRight: layout.gap16,
        paddingTop: layout.gap8,
        paddingBottom: layout.gap8,
      }
    : {
        padding: layout.gap16,
      };

  const shellStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    boxSizing: "border-box",
    minWidth: 0,
    flex: 1,
    height: CARD_HEIGHT,
    minHeight: CARD_HEIGHT,
    borderRadius: layout.radiusM,
    borderWidth: layout.strokeM,
    borderStyle: "solid",
    ...paddingStyle,
    ...style,
    borderColor,
    background: backgroundColor,
  };

  const noteItems = notes;
  const hasNotes = noteItems.length > 0;
  const showTag = Boolean(chordName?.trim());

  const innerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 0,
    minHeight: 0,
    width: "100%",
  };

  const tagVariant = variant === "themed" ? "themed" : "default";
  const noteVariant = variant === "themed" ? "themed" : "default";

  return (
    <div
      className={className}
      style={shellStyle}
      role="region"
      aria-label="Chord display"
    >
      {isOsc ? (
        <div style={{ flex: 1, minHeight: 0, width: "100%", position: "relative" }}>
          <canvas
            ref={oscilloscopeRef}
            aria-hidden
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </div>
      ) : (
        <div style={innerStyle}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: 0,
            }}
          >
            {hasNotes ? (
              <InternalKeyInput
                notes={noteItems}
                variant={noteVariant}
                themeIndex={themedIdx}
              />
            ) : null}
          </div>
          {showTag ? (
            <Tag
              label={chordName!.trim()}
              variant={tagVariant}
              themeIndex={themedIdx}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
