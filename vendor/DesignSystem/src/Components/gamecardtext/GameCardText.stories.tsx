import type { Meta, StoryObj } from "@storybook/react";
import { GameCardText, GameCardTextState } from "./GameCardText.1.0.0";
import { TagType, TagState } from "../tag/GameCardTag.1.0.0";
import { TagConfig } from "../tagrow/TagRow.1.0.0";

const stateOptions: GameCardTextState[] = ["inactive", "default", "active"];
const tagTypeOptions: TagType[] = ["default", "success"];
const tagStateOptions: TagState[] = ["active", "default", "inactive"];

interface StoryArgs {
  state: GameCardTextState;
  hasPadding: boolean;
  title: string;
  showTitle: boolean;
  showTags: boolean;
  tagCount: number;
  tag1Label: string;
  tag1Type: TagType;
  tag2Label: string;
  tag2Type: TagType;
  tag3Label: string;
  tag3Type: TagType;
  tag4Label: string;
  tag4Type: TagType;
  tag5Label: string;
  tag5Type: TagType;
  primaryData: string;
  showPrimaryData: boolean;
  secondaryData: string;
  showSecondaryData: boolean;
  bodyText: string;
  showBodyText: boolean;
}

function buildTags(args: StoryArgs): TagConfig[] {
  const all: TagConfig[] = [
    { label: args.tag1Label, type: args.tag1Type },
    { label: args.tag2Label, type: args.tag2Type },
    { label: args.tag3Label, type: args.tag3Type },
    { label: args.tag4Label, type: args.tag4Type },
    { label: args.tag5Label, type: args.tag5Type },
  ];
  return all.slice(0, args.tagCount);
}

const meta: Meta<StoryArgs> = {
  title: "Components/GameCardText",
  argTypes: {
    state: {
      control: "inline-radio",
      options: stateOptions,
      description: "Component state",
    },
    hasPadding: {
      control: "boolean",
      description: "Whether the component has padding",
    },
    title: { control: "text", description: "Game title" },
    showTitle: { control: "boolean", description: "Show title" },
    showTags: { control: "boolean", description: "Show tag row" },
    tagCount: {
      control: { type: "range", min: 1, max: 5, step: 1 },
      description: "Number of tags (1–5)",
    },
    tag1Label: { control: "text", name: "Tag 1 — Label" },
    tag1Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 1 — Type" },
    tag2Label: { control: "text", name: "Tag 2 — Label" },
    tag2Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 2 — Type" },
    tag3Label: { control: "text", name: "Tag 3 — Label" },
    tag3Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 3 — Type" },
    tag4Label: { control: "text", name: "Tag 4 — Label" },
    tag4Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 4 — Type" },
    tag5Label: { control: "text", name: "Tag 5 — Label" },
    tag5Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 5 — Type" },
    primaryData: { control: "text", description: "Primary data (e.g. price)" },
    showPrimaryData: { control: "boolean", description: "Show primary data line" },
    secondaryData: { control: "text", description: "Secondary data (e.g. original price)" },
    showSecondaryData: { control: "boolean", description: "Show secondary data" },
    bodyText: { control: "text", description: "Body text content" },
    showBodyText: { control: "boolean", description: "Show body text" },
  },
  args: {
    state: "default",
    hasPadding: false,
    title: "Game title",
    showTitle: true,
    showTags: true,
    tagCount: 5,
    tag1Label: "Tag 1",
    tag1Type: "default",
    tag2Label: "Tag 2",
    tag2Type: "default",
    tag3Label: "Tag 3",
    tag3Type: "default",
    tag4Label: "Tag 4",
    tag4Type: "default",
    tag5Label: "Tag 5",
    tag5Type: "default",
    primaryData: "£18.89",
    showPrimaryData: true,
    secondaryData: "£20.99",
    showSecondaryData: true,
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    showBodyText: true,
  },
  render: (args) => (
    <GameCardText
      state={args.state}
      hasPadding={args.hasPadding}
      title={args.title}
      showTitle={args.showTitle}
      showTags={args.showTags}
      tags={buildTags(args)}
      primaryData={args.primaryData}
      showPrimaryData={args.showPrimaryData}
      secondaryData={args.secondaryData}
      showSecondaryData={args.showSecondaryData}
      bodyText={args.bodyText}
      showBodyText={args.showBodyText}
    />
  ),
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const Active: Story = {
  args: { state: "active" },
};

export const Inactive: Story = {
  args: { state: "inactive" },
};

export const WithPadding: Story = {
  args: { state: "default", hasPadding: true },
};

export const MinimalCard: Story = {
  args: {
    state: "active",
    showTitle: true,
    showTags: false,
    showSecondaryData: false,
    showBodyText: false,
    title: "Cyberpunk 2077",
    primaryData: "£24.99",
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["inactive", "default", "active"] as const).map((s) => (
        <div key={s}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              marginBottom: 4,
              opacity: 0.5,
            }}
          >
            state="{s}"
          </div>
          <GameCardText
            {...args}
            state={s}
            tags={buildTags(args)}
          />
        </div>
      ))}
    </div>
  ),
};
