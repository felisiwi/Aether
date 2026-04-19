import type { Meta, StoryObj } from '@storybook/react';
import WpmData from './WpmData.1.1.0';

const meta: Meta<typeof WpmData> = {
  component: WpmData,
  title: 'Components/WpmData',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 999 },
      description: 'WPM value (0–999)',
    },
    state: {
      control: 'select',
      options: ['Passive', 'Active', 'Inactive'],
      description: 'Visual state',
    },
  },
};
export default meta;

type Story = StoryObj<typeof WpmData>;

export const Default: Story = {
  args: { value: 100, state: 'Passive' },
};

export const Active: Story = {
  args: { value: 100, state: 'Active' },
};

export const Inactive: Story = {
  args: { value: 100, state: 'Inactive' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <WpmData value={100} state="Passive" />
      <WpmData value={100} state="Active" />
      <WpmData value={100} state="Inactive" />
    </div>
  ),
};
