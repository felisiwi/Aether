import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  VideoPreviewCard,
  VideoPreviewCardType,
  VideoPreviewCardState,
} from "./VideoPreviewCard.1.0.0";

const typeOptions: VideoPreviewCardType[] = ["video", "text"];
const stateOptions: VideoPreviewCardState[] = [
  "inactive",
  "default",
  "hover",
  "active",
  "action",
  "actionTap",
];

const SAMPLE_IMAGE =
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/536270/header.jpg";

const meta: Meta<typeof VideoPreviewCard> = {
  title: "Components/VideoPreviewCard",
  component: VideoPreviewCard,
  argTypes: {
    type: {
      control: "select",
      options: typeOptions,
    },
    state: {
      control: "select",
      options: stateOptions,
    },
    backgroundImage: { control: "text" },
    title: { control: "text" },
    primaryData: { control: "text" },
    primaryDataActive: { control: "text" },
    secondaryData: { control: "text" },
  },
  args: {
    type: "text",
    state: "default",
    backgroundImage: SAMPLE_IMAGE,
    title: "Ancestors: The Humankind Odyssey",
    primaryData: "Played 2w ago",
    secondaryData: "75h total",
  },
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof VideoPreviewCard>;

export const Default: Story = {};

/**
 * Implements the Figma prototype flow for the **Text** type (Smart Animate is not replicated;
 * state changes are instant). Hover the card to see Default → Hover; click to go to Active;
 * click again to return to Hover; mouse leave from Active → Default.
 */
export const InteractiveText: Story = {
  render: function InteractiveTextRender() {
    const [state, setState] = React.useState<VideoPreviewCardState>("default");

    return (
      <div style={{ maxWidth: 451 }}>
        <p
          style={{
            color: "#aaa",
            fontSize: 12,
            marginBottom: 12,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          State: <strong style={{ color: "#fff" }}>{state}</strong> — hover to enter Hover, click
          for Active, click again for Hover, leave to reset to Default.
        </p>
        <VideoPreviewCard
          type="text"
          state={state}
          backgroundImage={SAMPLE_IMAGE}
          title="Ancestors: The Humankind Odyssey"
          primaryData="Played 2w ago"
          primaryDataActive="Open in Steam"
          secondaryData="75h total"
          onMouseEnter={() => {
            if (state === "default") setState("hover");
          }}
          onMouseLeave={() => {
            if (state === "hover" || state === "active") setState("default");
          }}
          onClick={() => {
            if (state === "hover") setState("active");
            else if (state === "active") setState("hover");
          }}
        />
      </div>
    );
  },
};

export const TextHover: Story = {
  args: { type: "text", state: "hover" },
};

export const TextActive: Story = {
  args: {
    type: "text",
    state: "active",
    primaryData: "Played 2w ago",
    primaryDataActive: "Open in Steam",
  },
};

export const TextAction: Story = {
  args: {
    type: "text",
    state: "action",
  },
};

export const TextActionTap: Story = {
  args: {
    type: "text",
    state: "actionTap",
  },
};

export const VideoInactive: Story = {
  args: { type: "video", state: "inactive" },
};

export const VideoHover: Story = {
  args: { type: "video", state: "hover" },
};

export const VideoActive: Story = {
  args: { type: "video", state: "active" },
};

export const VideoAction: Story = {
  args: {
    type: "video",
    state: "action",
    primaryData: "Trailer playing",
    secondaryData: "click to pause",
  },
};

export const AllTextStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {stateOptions.map((s) => (
        <div key={s}>
          <div
            style={{
              color: "#999",
              fontSize: 12,
              marginBottom: 4,
              fontFamily: "monospace",
            }}
          >
            Text / {s}
          </div>
          <VideoPreviewCard
            type="text"
            state={s}
            backgroundImage={SAMPLE_IMAGE}
            title="Ancestors: The Humankind Odyssey"
            primaryData={s === "active" ? "Open in Steam" : "Played 2w ago"}
            secondaryData="75h total"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllVideoStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {stateOptions.map((s) => (
        <div key={s}>
          <div
            style={{
              color: "#999",
              fontSize: 12,
              marginBottom: 4,
              fontFamily: "monospace",
            }}
          >
            Video / {s}
          </div>
          <VideoPreviewCard
            type="video"
            state={s}
            backgroundImage={SAMPLE_IMAGE}
            title="Ancestors: The Humankind Odyssey"
            primaryData={
              s === "action" || s === "actionTap"
                ? "Trailer playing"
                : "Played 2w ago"
            }
            secondaryData={
              s === "action" || s === "actionTap"
                ? "click to pause"
                : "75h total"
            }
          />
        </div>
      ))}
    </div>
  ),
};
