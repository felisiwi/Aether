import type { Meta, StoryObj } from '@storybook/react';
import Icon from './Icon.1.2.0';
import { ICON_NAMES } from './icon-names';

const sizes = [16, 24, 32] as const;
const weights = ['regular', 'fill'] as const;

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'Components/Icon',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [...ICON_NAMES],
      description: 'Icon name (flat list from icon-names)',
    },
    size: {
      control: 'select',
      options: [...sizes],
      description: 'Size in px (16, 24, 32)',
    },
    weight: {
      options: ['regular', 'fill'],
      control: { type: 'radio', labels: { regular: 'Outline', fill: 'Filled' } },
      description: 'Outline or Filled. Same for Phosphor and custom (media) icons.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { name: 'play', size: 24, weight: 'regular' },
};

export const Fill: Story = {
  args: { name: 'close', size: 24, weight: 'fill' },
};

export const CustomIconFill: Story = {
  args: { name: 'play', size: 24, weight: 'fill' },
  description: 'Custom media icons also support weight; same selector as Phosphor.',
};

export const RegularVsFill: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="close" size={32} weight="regular" />
        <div style={{ fontSize: 12, marginTop: 4 }}>close regular</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="close" size={32} weight="fill" />
        <div style={{ fontSize: 12, marginTop: 4 }}>close fill</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="play" size={32} weight="regular" />
        <div style={{ fontSize: 12, marginTop: 4 }}>play regular</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="play" size={32} weight="fill" />
        <div style={{ fontSize: 12, marginTop: 4 }}>play fill</div>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <Icon name="play" size={16} />
      <Icon name="play" size={24} />
      <Icon name="play" size={32} />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 400 }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Icon name={name} size={24} />
          <span style={{ fontSize: 10, color: '#666' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
