import type { Meta, StoryObj } from "@storybook/react";
import { TagRow, TagConfig } from "./TagRow.1.0.0";
import { TagType, TagState } from "../tag/GameCardTag.1.0.0";

const tagTypeOptions: TagType[] = ["default", "success"];
const tagStateOptions: TagState[] = ["active", "default", "inactive"];

interface StoryArgs {
  tagCount: number;
  tag1Label: string;
  tag1Type: TagType;
  tag1State: TagState;
  tag2Label: string;
  tag2Type: TagType;
  tag2State: TagState;
  tag3Label: string;
  tag3Type: TagType;
  tag3State: TagState;
  tag4Label: string;
  tag4Type: TagType;
  tag4State: TagState;
  tag5Label: string;
  tag5Type: TagType;
  tag5State: TagState;
}

function argsToTags(args: StoryArgs): TagConfig[] {
  const all: TagConfig[] = [
    { label: args.tag1Label, type: args.tag1Type, state: args.tag1State },
    { label: args.tag2Label, type: args.tag2Type, state: args.tag2State },
    { label: args.tag3Label, type: args.tag3Type, state: args.tag3State },
    { label: args.tag4Label, type: args.tag4Type, state: args.tag4State },
    { label: args.tag5Label, type: args.tag5Type, state: args.tag5State },
  ];
  return all.slice(0, args.tagCount);
}

const meta: Meta<StoryArgs> = {
  title: "Components/TagRow",
  argTypes: {
    tagCount: {
      control: { type: "range", min: 1, max: 5, step: 1 },
      description: "Number of tags to display (1–5)",
    },
    tag1Label: { control: "text", name: "Tag 1 — Label" },
    tag1Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 1 — Type" },
    tag1State: { control: "inline-radio", options: tagStateOptions, name: "Tag 1 — State" },
    tag2Label: { control: "text", name: "Tag 2 — Label" },
    tag2Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 2 — Type" },
    tag2State: { control: "inline-radio", options: tagStateOptions, name: "Tag 2 — State" },
    tag3Label: { control: "text", name: "Tag 3 — Label" },
    tag3Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 3 — Type" },
    tag3State: { control: "inline-radio", options: tagStateOptions, name: "Tag 3 — State" },
    tag4Label: { control: "text", name: "Tag 4 — Label" },
    tag4Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 4 — Type" },
    tag4State: { control: "inline-radio", options: tagStateOptions, name: "Tag 4 — State" },
    tag5Label: { control: "text", name: "Tag 5 — Label" },
    tag5Type: { control: "inline-radio", options: tagTypeOptions, name: "Tag 5 — Type" },
    tag5State: { control: "inline-radio", options: tagStateOptions, name: "Tag 5 — State" },
  },
  args: {
    tagCount: 5,
    tag1Label: "Tag 1",
    tag1Type: "default",
    tag1State: "default",
    tag2Label: "Tag 2",
    tag2Type: "default",
    tag2State: "default",
    tag3Label: "Tag 3",
    tag3Type: "default",
    tag3State: "default",
    tag4Label: "Tag 4",
    tag4Type: "default",
    tag4State: "default",
    tag5Label: "Tag 5",
    tag5Type: "default",
    tag5State: "default",
  },
  render: (args) => <TagRow tags={argsToTags(args)} />,
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const MixedTypes: Story = {
  args: {
    tagCount: 3,
    tag1Label: "Design",
    tag1Type: "default",
    tag1State: "active",
    tag2Label: "Approved",
    tag2Type: "success",
    tag2State: "active",
    tag3Label: "Draft",
    tag3Type: "default",
    tag3State: "inactive",
  },
};

export const AllSuccess: Story = {
  args: {
    tagCount: 4,
    tag1Label: "Passed",
    tag1Type: "success",
    tag1State: "active",
    tag2Label: "Verified",
    tag2Type: "success",
    tag2State: "default",
    tag3Label: "Complete",
    tag3Type: "success",
    tag3State: "active",
    tag4Label: "Done",
    tag4Type: "success",
    tag4State: "default",
  },
};

export const SingleTag: Story = {
  args: {
    tagCount: 1,
    tag1Label: "Solo",
    tag1Type: "default",
    tag1State: "active",
  },
};
