import React from "react";
import { typography, fontFamily, colors, semanticColors, layout } from "../../tokens/design-tokens";

export type SettingsPanelVariant = "default" | "colour" | "theme";
export interface SettingsPanelProps { label: string; children: React.ReactNode; variant?: SettingsPanelVariant; darkMode?: boolean; className?: string; style?: React.CSSProperties; }

const overline = typography.overline;

function getTokens(variant: SettingsPanelVariant, dark: boolean) {
  const labelColor = dark ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  switch (variant) {
    case "colour": return { labelColor: colors.textHeadingColour, borderColor: dark ? semanticColors.strokeInvertedStrong : semanticColors.strokeStrong };
    case "theme": return { labelColor: semanticColors.backdropSurfaceThemedSurface, borderColor: dark ? semanticColors.strokeInvertedStrong : semanticColors.strokeStrong };
    default: return { labelColor, borderColor: dark ? semanticColors.strokeInvertedStrong : semanticColors.strokeStrong };
  }
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ label, children, variant = "default", darkMode = false, className, style }) => {
  const tokens = getTokens(variant, darkMode);
  return (
    <section className={className} style={{ flex: "1 1 0", minWidth: 0, borderTop: `${layout.strokeS}px solid ${tokens.borderColor}`, paddingTop: layout.gap16, display: "flex", flexDirection: "column", gap: layout.gap8, ...style }} aria-label={label}>
      <div style={{ fontFamily, fontSize: overline.fontSize, fontWeight: overline.fontWeight, lineHeight: `${overline.lineHeight}px`, letterSpacing: overline.letterSpacing, fontStretch: `${overline.fontWidth}%`, textTransform: "uppercase", color: tokens.labelColor, marginBottom: layout.gap8, fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{label}</div>
      {children}
    </section>
  );
};
SettingsPanel.displayName = "SettingsPanel";
export default SettingsPanel;
