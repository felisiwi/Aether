import type { Meta, StoryObj } from '@storybook/react';
import BasicButton from './BasicButton.1.2.0';
import { ICON_NAMES } from '../icon/icon-names';

const meta: Meta<typeof BasicButton> = {
  component: BasicButton,
  title: 'Components/BasicButton',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Figma **Basic/Buttons** (`13669:55650`). Use `type` for the native HTML button type: **`button`** (default), **`submit`**, or **`reset`** — important inside forms.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'subtle'],
    },
    size: { control: 'select', options: ['small', 'large'] },
    colourFill: { control: 'boolean' },
    insideWrapper: { control: 'boolean' },
    latching: { control: 'boolean' },
    showText: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    iconName: { control: 'select', options: [...ICON_NAMES] },
    iconWeight: { control: 'select', options: ['regular', 'fill'] },
    disabled: { control: 'boolean' },
    state: {
      control: 'select',
      options: ['active', 'pressed', 'disabled', 'disabledPressed', 'focus'],
    },
    children: { control: 'text', name: 'Text' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native `<button type>` — default `button`.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof BasicButton>;

export const PrimaryOutline: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    children: 'Button',
  },
};

export const PrimaryFilled: Story = {
  args: {
    variant: 'primary',
    colourFill: true,
    children: 'Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    showIcon: true,
    iconName: 'arrow-right',
    children: 'Next',
  },
};

export const IconOnly: Story = {
  render: () => (
    <BasicButton
      variant="secondary"
      colourFill={false}
      showText={false}
      showIcon
      iconName="close"
      aria-label="Close"
    />
  ),
};

export const LatchingToggle: Story = {
  args: {
    variant: 'tertiary',
    colourFill: false,
    latching: true,
    children: 'Toggle (click)',
  },
};

export const InsideWrapper: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    insideWrapper: true,
    children: '44px min',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    disabled: true,
    children: 'Disabled',
  },
};

export const DisabledPressed: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    disabled: true,
    state: 'disabledPressed',
    children: 'Disabled pressed',
  },
};

export const FocusState: Story = {
  args: {
    variant: 'primary',
    colourFill: false,
    state: 'focus',
    children: 'Focus (preview)',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['primary', 'secondary', 'tertiary', 'subtle'] as const).map((v) => (
          <BasicButton key={v} variant={v} colourFill={false}>
            {v}
          </BasicButton>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['primary', 'secondary', 'tertiary', 'subtle'] as const).map((v) => (
          <BasicButton key={`${v}-fill`} variant={v} colourFill>
            {v} fill
          </BasicButton>
        ))}
      </div>
    </div>
  ),
};
