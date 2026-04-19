import type { Meta, StoryObj } from '@storybook/react';
import VariablesFrame from './VariablesFrame.1.0.0';

const meta: Meta<typeof VariablesFrame> = {
  component: VariablesFrame,
  title: 'Components/VariablesFrame',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    padding: { control: 'number', description: 'Padding override' },
    radius: { control: 'number', description: 'Corner radius override' },
  },
};
export default meta;

type Story = StoryObj<typeof VariablesFrame>;

export const Default: Story = {
  args: {
    children: 'Frame content (design tokens: radius 24, padding 16)',
  },
};

export const CustomPaddingAndRadius: Story = {
  args: {
    padding: 24,
    radius: 12,
    children: 'Custom padding and radius',
  },
};
