import React from "react";
import ChordDisplay from "../chorddisplay/ChordDisplay.2.3.0";
import SliderController from "../slidercontroller/SliderController.1.0.0";
import { layout } from "../../tokens/design-tokens";
import type { ThemeIndex } from "../../tokens/theme-map";

/** Figma `JamBoard` / `Players=Solo` row: `itemSpacing` → `VariableID:9053:54` → `layout.gap16`. */
const ROW_GAP = layout.gap16;

/** Fixed row height from spec / snapshot (`Players=Solo` frame height 180). */
const ROW_HEIGHT = 180;

/**
 * Figma `ChordDisplay` (oscilloscope) instance width on JamBoard solo layout — no layout.* token; canvas area matches card.
 * See `JamBoard--…-15398-178005.json` (`absoluteBoundingBox.width` 660).
 */
const OSCILLOSCOPE_PANEL_WIDTH = 660;

export type JamBoardVariant = "solo" | "duo";

export interface JamBoardProps {
  variant: JamBoardVariant;
  localNotes?: Array<{ note: string; partOfChord: boolean }>;
  localChordName?: string;
  oscilloscopeRef?: React.RefObject<HTMLCanvasElement | null>;
  remoteNotes?: Array<{ note: string; partOfChord: boolean }>;
  remoteChordName?: string;
  remoteThemeIndex?: ThemeIndex;
  masterVolume: number;
  onMasterVolumeChange: (v: number) => void;
  remoteVolume?: number;
  onRemoteVolumeChange?: (v: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** VolumeController placeholder: padding `9053:53` → `layout.gap8`; inter-slider gap `9053:54` → `layout.gap16`. */
const volumePlaceholderStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: layout.gap16,
  paddingTop: layout.gap8,
  paddingBottom: layout.gap8,
  flexShrink: 0,
  boxSizing: "border-box",
};

const growChordStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
};

const oscilloscopeStyle: React.CSSProperties = {
  flex: `0 0 ${OSCILLOSCOPE_PANEL_WIDTH}px`,
  width: OSCILLOSCOPE_PANEL_WIDTH,
  minWidth: 0,
};

export const JamBoard: React.FC<JamBoardProps> = ({
  variant,
  localNotes = [],
  localChordName,
  oscilloscopeRef,
  remoteNotes = [],
  remoteChordName,
  remoteThemeIndex = 0,
  masterVolume,
  onMasterVolumeChange,
  remoteVolume = 0,
  onRemoteVolumeChange,
  className,
  style,
}) => {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: ROW_GAP,
    minHeight: ROW_HEIGHT,
    height: ROW_HEIGHT,
    minWidth: 0,
    boxSizing: "border-box",
    ...style,
  };

  return (
    <section
      className={className}
      style={rowStyle}
      aria-label="Jam board"
    >
      <ChordDisplay
        variant="default"
        notes={localNotes}
        chordName={localChordName}
        style={growChordStyle}
      />

      <div style={volumePlaceholderStyle}>
        <SliderController
          title="Master"
          value={masterVolume}
          suffix="%"
          min={0}
          max={100}
          step={1}
          onChange={onMasterVolumeChange}
          variant="default"
        />
        {variant === "duo" ? (
          <SliderController
            title="1"
            value={remoteVolume}
            suffix="%"
            min={0}
            max={100}
            step={1}
            onChange={onRemoteVolumeChange ?? (() => {})}
            variant={1}
          />
        ) : null}
      </div>

      {variant === "solo" ? (
        <ChordDisplay
          variant="oscilloscope"
          oscilloscopeRef={oscilloscopeRef}
          style={oscilloscopeStyle}
        />
      ) : (
        <ChordDisplay
          variant="themed"
          notes={remoteNotes}
          chordName={remoteChordName}
          themeIndex={remoteThemeIndex}
          style={growChordStyle}
        />
      )}
    </section>
  );
};

JamBoard.displayName = "JamBoard";
export default JamBoard;
