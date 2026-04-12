import React from "react";
import { typography, fontFamily, colors, semanticColors, layout } from "../../tokens/design-tokens";

export type WaveformType = "sine" | "triangle" | "sawtooth" | "square";
export type WaveformSelectorVariant = "default" | "colour" | "theme";
export interface WaveformSelectorProps { value: WaveformType; onChange: (waveform: WaveformType) => void; variant?: WaveformSelectorVariant; darkMode?: boolean; disabled?: boolean; className?: string; style?: React.CSSProperties; }

const WAVEFORMS: WaveformType[] = ["sine", "triangle", "sawtooth", "square"];
const bodyS = typography.bodyS;

function getTokens(variant: WaveformSelectorVariant, dark: boolean) {
  const unselectedText = dark ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  const ringUnselected = dark ? semanticColors.strokeInvertedSolid : semanticColors.strokeSolid;
  switch (variant) {
    case "colour": return { selectedText: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, unselectedText, ringSelected: semanticColors.buttonSurfacePrimary, ringUnselected, dotColor: semanticColors.buttonSurfacePrimary };
    case "theme": return { selectedText: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, unselectedText, ringSelected: semanticColors.backdropSurfaceThemedSurface, ringUnselected, dotColor: semanticColors.backdropSurfaceThemedSurface };
    default: return { selectedText: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, unselectedText, ringSelected: dark ? semanticColors.strokeInvertedSolid : semanticColors.strokeSolid, ringUnselected, dotColor: dark ? semanticColors.strokeInvertedSolid : semanticColors.strokeSolid };
  }
}

export const WaveformSelector: React.FC<WaveformSelectorProps> = ({ value, onChange, variant = "default", darkMode = false, disabled = false, className, style }) => {
  const tokens = getTokens(variant, darkMode);
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: layout.gap4, opacity: disabled ? 0.4 : 1, ...style }} role="radiogroup" aria-label="Waveform">
      {WAVEFORMS.map((w) => { const selected = value === w; return (
        <label key={w} onClick={() => !disabled && onChange(w)} style={{ display: "flex", alignItems: "center", gap: layout.gap8, fontFamily, fontSize: bodyS.fontSize, lineHeight: `${bodyS.lineHeight}px`, letterSpacing: bodyS.letterSpacing, color: selected ? tokens.selectedText : tokens.unselectedText, cursor: disabled ? "default" : "pointer" }}>
          <span role="radio" aria-checked={selected} tabIndex={disabled ? -1 : 0} onKeyDown={(e) => { if (disabled) return; if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(w); } }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: layout.gap16, height: layout.gap16, borderRadius: layout.radiusRound, borderWidth: layout.strokeM, borderStyle: "solid", borderColor: selected ? tokens.ringSelected : tokens.ringUnselected, boxSizing: "border-box", flexShrink: 0 }}>
            {selected && <span style={{ width: layout.gap8, height: layout.gap8, borderRadius: layout.radiusRound, backgroundColor: tokens.dotColor }} />}
          </span>
          {w}
        </label>
      ); })}
    </div>
  );
};
WaveformSelector.displayName = "WaveformSelector";
export default WaveformSelector;
