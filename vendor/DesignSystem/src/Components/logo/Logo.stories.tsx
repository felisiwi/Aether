import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import "../../tokens/semantic-tokens.css";
import { layout, semanticColors, typography, fontFamily, colors } from "../../tokens/design-tokens";
import { Logo } from "./Logo.1.0.2";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  argTypes: {
    colour: {
      control: { type: "select" },
      options: ["White", "Black", "Colour"],
    },
    width: { control: "text" },
    height: { control: "text" },
  },
  args: {
    colour: "Black",
    height: layout.paddingVerticalSection,
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

const caption: React.CSSProperties = {
  fontFamily,
  fontSize: typography.bodyS.fontSize,
  lineHeight: `${typography.bodyS.lineHeight}px`,
  letterSpacing: typography.bodyS.letterSpacing,
};

/** Dark surface so the White variant is visible (`docs/STORYBOOK.md` — decorator, not `data-theme` on the component). */
export const White: Story = {
  args: { colour: "White" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: semanticColors.backdropStaticBlack,
          padding: layout.gap24,
          minHeight: layout.gap160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Light / default surface — Black variant. */
export const Black: Story = {
  args: { colour: "Black" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: semanticColors.backdropNautralBackground,
          padding: layout.gap24,
          minHeight: layout.gap160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Inverted backdrop — Colour variant reads as brand fill on dark. */
export const Colour: Story = {
  args: { colour: "Colour" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: semanticColors.backdropInvertedBackground,
          padding: layout.gap24,
          minHeight: layout.gap160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: layout.gap32,
        padding: layout.gap24,
        alignItems: "stretch",
        background: semanticColors.backdropNautralBackground,
      }}
    >
      {/* Story-level surfaces only (not inside Logo). One column = one padded canvas. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: layout.gap8,
          alignItems: "center",
          flex: "1 1 0",
          minWidth: 0,
          padding: layout.gap24,
          minHeight: layout.gap160,
          borderRadius: layout.radiusS,
          background: semanticColors.backdropStaticBlack,
        }}
      >
        <span style={{ ...caption, color: colors.textInverted }}>White (on dark)</span>
        <Logo colour="White" height={layout.paddingVerticalSection} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: layout.gap8,
          alignItems: "center",
          flex: "1 1 0",
          minWidth: 0,
          padding: layout.gap24,
          minHeight: layout.gap160,
          borderRadius: layout.radiusS,
          background: semanticColors.backdropNautralBackground,
          border: `${layout.strokeS}px solid ${semanticColors.strokeWeak}`,
        }}
      >
        <span style={{ ...caption, color: colors.textHeadingNeutral }}>Black (on light)</span>
        <Logo colour="Black" height={layout.paddingVerticalSection} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: layout.gap8,
          alignItems: "center",
          flex: "1 1 0",
          minWidth: 0,
          padding: layout.gap24,
          minHeight: layout.gap160,
          borderRadius: layout.radiusS,
          background: semanticColors.backdropInvertedBackground,
        }}
      >
        <span style={{ ...caption, color: colors.textInverted }}>Colour (on inverted)</span>
        <Logo colour="Colour" height={layout.paddingVerticalSection} />
      </div>
    </div>
  ),
};
