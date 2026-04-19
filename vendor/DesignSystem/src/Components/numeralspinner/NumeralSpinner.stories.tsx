import type { Meta, StoryObj } from '@storybook/react';
import NumeralSpinner from './NumeralSpinner.1.0.0';

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const meta: Meta<typeof NumeralSpinner> = {
  component: NumeralSpinner,
  title: 'Components/NumeralSpinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'select',
      options: [...digits],
      description: 'Digit to display (0–9)',
    },
  },
};
export default meta;

type Story = StoryObj<typeof NumeralSpinner>;

export const Default: Story = {
  args: { value: '0' },
};

export const AllDigits: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {digits.map((d) => (
        <NumeralSpinner key={d} value={d} />
      ))}
    </div>
  ),
};
