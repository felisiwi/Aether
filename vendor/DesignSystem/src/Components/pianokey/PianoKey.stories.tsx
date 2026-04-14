import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PianoKey from './PianoKey.1.5.1';
import { typography, fontFamily, colors, layout, semanticColors } from '../../tokens/design-tokens';

const meta: Meta<typeof PianoKey> = {
  component: PianoKey,
  title: 'Components/PianoKey',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single piano key. **`variant="default"`** (Figma Instrument=Piano): shortcut only inside the key, bottom-aligned — matches v1.4.0. **`variant="instrument"`** (Figma Instrument=Keyboard): compact rounded cell with note + shortcut centred. ' +
          'Display-only — no focus or button semantics.',
      },
    },
  },
  argTypes: {
    note: { control: 'text' },
    shortcutLabel: { control: 'text' },
    isPressed: { control: 'boolean' },
    isBlack: { control: 'boolean' },
    variant: { control: 'radio', options: ['default', 'instrument'] },
  },
};
export default meta;

type Story = StoryObj<typeof PianoKey>;

export const WhiteKeyDefault: Story = {
  args: {
    note: 'G3',
    shortcutLabel: 'B',
    isPressed: false,
    isBlack: false,
    variant: 'default',
  },
};

export const WhiteKeyPressed: Story = {
  args: {
    note: 'G3',
    shortcutLabel: 'B',
    isPressed: true,
    isBlack: false,
    variant: 'default',
  },
};

export const BlackKeyDefault: Story = {
  args: {
    note: 'F#3',
    shortcutLabel: 'H',
    isPressed: false,
    isBlack: true,
    variant: 'default',
  },
};

export const Piano: Story = {
  args: {
    note: 'C#4',
    shortcutLabel: 'Z',
    isPressed: false,
    isBlack: false,
    variant: 'instrument',
  },
};

export const Keyboard: Story = {
  args: {
    note: 'C#4',
    shortcutLabel: 'S',
    isPressed: false,
    isBlack: true,
    variant: 'instrument',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'flex-end', padding: layout.gap24 }}>
      <PianoKey note="F3" shortcutLabel="V" isPressed={false} isBlack={false} variant="default" />
      <PianoKey note="G3" shortcutLabel="B" isPressed={true} isBlack={false} variant="default" />
      <PianoKey note="F#3" shortcutLabel="H" isPressed={false} isBlack={true} variant="default" />
      <PianoKey note="G#3" shortcutLabel="J" isPressed={true} isBlack={true} variant="default" />
    </div>
  ),
};

export const OctavePreview: Story = {
  render: () => {
    const whiteWidth = layout.gap48;
    const blackWidth = layout.gap32;
    const noteRowHeight = typography.label.lineHeight;

    const noteLabelBase: React.CSSProperties = {
      fontFamily,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      lineHeight: `${noteRowHeight}px`,
      letterSpacing: typography.label.letterSpacing,
      fontStretch: `${typography.label.fontWidth}%`,
      textAlign: 'center',
      display: 'block',
    };

    const whites = [
      { note: 'C3', shortcutLabel: 'Z' },
      { note: 'D3', shortcutLabel: 'X' },
      { note: 'E3', shortcutLabel: 'C' },
      { note: 'F3', shortcutLabel: 'V' },
      { note: 'G3', shortcutLabel: 'B' },
      { note: 'A3', shortcutLabel: 'N' },
      { note: 'B3', shortcutLabel: 'M' },
    ];

    const blacks = [
      { note: 'C#3', shortcutLabel: 'S', afterWhiteIndex: 0 },
      { note: 'D#3', shortcutLabel: 'D', afterWhiteIndex: 1 },
      { note: 'F#3', shortcutLabel: 'H', afterWhiteIndex: 3 },
      { note: 'G#3', shortcutLabel: 'J', afterWhiteIndex: 4 },
      { note: 'A#3', shortcutLabel: 'G', afterWhiteIndex: 5 },
    ];

    const blackLeft = (afterWhiteIndex: number) =>
      (afterWhiteIndex + 1) * whiteWidth - blackWidth / 2;

    return (
      <div
        style={{
          padding: layout.gap24,
          background: semanticColors.backdropStaticDarkenedWhite,
          borderRadius: layout.radiusS,
          display: 'inline-block',
        }}
      >
        <div style={{ position: 'relative', height: noteRowHeight, marginBottom: layout.gap8 }}>
          {blacks.map((bk) => (
            <span
              key={bk.note}
              style={{
                ...noteLabelBase,
                position: 'absolute',
                left: blackLeft(bk.afterWhiteIndex),
                width: blackWidth,
                color: colors.textBodyNeutral,
              }}
            >
              {bk.note}
            </span>
          ))}
        </div>

        <div style={{ position: 'relative', display: 'inline-flex' }}>
          {whites.map((wk) => (
            <PianoKey key={wk.note} {...wk} isPressed={false} isBlack={false} variant="default" />
          ))}
          {blacks.map((bk) => (
            <div
              key={bk.note}
              style={{ position: 'absolute', left: blackLeft(bk.afterWhiteIndex), top: 0, zIndex: 1 }}
            >
              <PianoKey {...bk} isPressed={false} isBlack={true} variant="default" />
            </div>
          ))}
        </div>

        <div style={{ display: 'inline-flex', marginTop: layout.gap8 }}>
          {whites.map((wk) => (
            <span
              key={wk.note}
              style={{
                ...noteLabelBase,
                width: whiteWidth,
                color: colors.textBodyNeutral,
              }}
            >
              {wk.note}
            </span>
          ))}
        </div>
      </div>
    );
  },
};
