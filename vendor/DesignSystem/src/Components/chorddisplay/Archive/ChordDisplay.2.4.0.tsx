import React from "react";
import InternalKeyInput from "../internalkeyinput/InternalKeyInput.1.1.0";
import { Tag } from "../tag/Tag.1.0.0";
import { ChordCollection, type ChordCollectionHint } from "../chordcollection/ChordCollection.1.0.0";
import { ChordBar } from "../chordbar/ChordBar.1.0.0";
import { getPlayerTheme, type ThemeIndex } from "../../tokens/theme-map";
import { layout, semanticColors } from "../../tokens/design-tokens";

export type ChordDisplayVariant = "default" | "themed" | "oscilloscope";

export type ChordDisplayNoteType = "white" | "orange" | "themed";

export interface ChordDisplayNote {
  note: string;
  type: ChordDisplayNoteType;
}

export interface ChordDisplayProgressionHints {
  resolve: ChordCollectionHint[];
  tension: ChordCollectionHint[];
  move: ChordCollectionHint[];
}

/**
 * Chord card: `default` (local orange), `themed` (remote player colour), or `oscilloscope` (solo waveform canvas).
 * Padding: horizontal `VariableID:9053:54` (`layout.gap16`), vertical `VariableID:9053:53` (`layout.gap8`).
 */
export interface ChordDisplayProps {
  variant: ChordDisplayVariant;
  notes?: ChordDisplayNote[];
  chordName?: string;
  themeIndex?: ThemeIndex;
  chordHints?: ChordCollectionHint[];
  progressionHints?: ChordDisplayProgressionHints;
  oscilloscopeRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
  style?: React.CSSProperties;
}

const CARD_HEIGHT = 180;
const MAX_NOTES = 8;

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  variant,
  notes = [],
  chordName,
  themeIndex = 0,
  chordHints = [],
  progressionHints,
  oscilloscopeRef,
  className,
  style,
}) => {
  const isOsc = variant === "oscilloscope";
  const themedIdx = themeIndex as ThemeIndex;
  const theme = getPlayerTheme(themedIdx);

  const borderColor = variant === "themed" ? theme.primary50 : semanticColors.strokeColour;

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
        paddingLeft: layout.gap16,
        paddingRight: layout.gap16,
        paddingTop: layout.gap8,
        paddingBottom: layout.gap8,
      };

  const shellStyle: React.CSSProperties = {
    position: "relative",
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

  const hasDetectedChord = Boolean(chordName?.trim());
  const shouldShowGeneralHints = variant === "default" && !hasDetectedChord && chordHints.length > 0;
  const shouldShowProgressionHints = variant === "default" && hasDetectedChord && Boolean(progressionHints);

  const baseNotes = notes.slice(0, MAX_NOTES);
  const noteItems =
    variant === "default"
      ? [
          ...baseNotes,
          ...Array.from({ length: Math.max(0, MAX_NOTES - baseNotes.length) }, () => ({
            note: "---",
            type: "orange" as const,
          })),
        ]
      : baseNotes;
  const hasNotes = noteItems.length > 0;
  const showTag = Boolean(chordName?.trim());
  const tagVariant = variant === "themed" ? "themed" : "default";

  return (
    <div className={className} style={shellStyle} role="region" aria-label="Chord display">
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
        <>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: layout.gap24,
              minHeight: 0,
              width: "100%",
            }}
          >
            <div style={{ minHeight: layout.gap24, display: "flex", alignItems: "center" }}>
              {shouldShowGeneralHints ? (
                <ChordCollection type="general" hints={chordHints} />
              ) : null}
              {shouldShowProgressionHints && progressionHints ? (
                <ChordBar
                  resolveHints={progressionHints.resolve}
                  tensionHints={progressionHints.tension}
                  moveHints={progressionHints.move}
                />
              ) : null}
            </div>
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
              {hasNotes ? <InternalKeyInput notes={noteItems} themeIndex={themedIdx} /> : null}
            </div>
          </div>
          {showTag ? (
            <div
              style={{
                position: "absolute",
                bottom: layout.gap8,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Tag label={chordName!.trim()} variant={tagVariant} themeIndex={themedIdx} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
