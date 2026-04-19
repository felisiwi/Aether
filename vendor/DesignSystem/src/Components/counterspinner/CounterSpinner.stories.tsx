import type { Meta, StoryObj } from '@storybook/react';
import CounterSpinner from './CounterSpinner.1.0.0';

const hundreds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const tensOptions = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'] as const;

const meta: Meta<typeof CounterSpinner> = {
  component: CounterSpinner,
  title: 'Components/CounterSpinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hundreds: {
      control: 'select',
      options: [...hundreds],
      description: 'Hundreds digit (1–9)',
    },
    tens: {
      control: 'select',
      options: [...tensOptions],
      description: 'Tens value (00, 10, …, 90)',
    },
  },
};
export default meta;

type Story = StoryObj<typeof CounterSpinner>;

export const Default: Story = {
  args: { hundreds: '1', tens: '00' },
};
