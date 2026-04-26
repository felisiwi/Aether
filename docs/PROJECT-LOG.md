# Aether — Project Log

Living document tracking active work, known issues, and ideas. Items move
between sections as their state changes. When Done items accumulate
(~50+), archive bulk to docs/DONE.md and keep only most-recently-shipped
here.

Historical UI bugs and fixes from the redesign work live in
[docs/archived/UI-FIXES.md](./archived/UI-FIXES.md) — that file is frozen, treat it as a
reference archive.

## Status key
🔴 Not started   🟡 In progress / sent to agent   ✅ Done

## Category tags
Each item should be prefixed with a category tag to make filtering and
scanning easy. Inspired by [Keep a Changelog](https://keepachangelog.com).

- **[Bug]** — something broken or behaving incorrectly vs spec
- **[Feature]** — new functionality
- **[UI]** — visual or interaction polish
- **[Infra]** — deployment, services, env vars, tooling
- **[Refactor]** — internal cleanup, no user-facing change

Items can have multiple tags if they cross categories — e.g.
`[Bug][UI]` for a visual bug. Tags go before the item title:

    ### [Bug][UI] Oscilloscope card hardcoded width 🔴

---

## In Progress

_Currently being worked on, regardless of category._

(none)

---

## Bugs

_Things that are broken or behave incorrectly vs spec. Ordered roughly
by priority. All items here should carry the [Bug] tag._

### [Bug][UI] JamBoard / EffectsBoard / Keyboard scaling and alignment 🔴
_Added 26 April 2026_

Two related layout issues that likely share a root cause:

1. Vertical alignment with Figma's grid drifts at production viewport
2. Layout looks bad on much larger viewports (e.g. iMac 5K) — sections don't
   scale or stretch nicely

Likely causes (untriaged):
- Double `paddingBottom: layout.gap48` in JamRoom.tsx (lines ~915 and ~1011)
  creates ~96px bottom gap instead of intended 48px
- `justifyContent: space-between` makes alignment viewport-dependent rather
  than locked to a fixed-height frame
- No breakpoint or proportional scaling logic for screens significantly
  larger than the Figma artboard

**Next step:** Claude Code investigation to measure rendered DOM vs Figma
spec at multiple viewport sizes (laptop and 5K), then decide on a layout
strategy that holds across both.

**Figma ref:** session screen, node-id 15881:92671

---

### [Bug][UI] LFO value has too many decimals — overflows DataWindow 🔴
_Added 26 April 2026_

LFO control reading runs past the edge of the DataWindow. Either round
the displayed value or constrain the format to fit.

---

### [Bug] LFO has minimal/no audible effect 🔴
_Added 26 April 2026_

Even with LFO active, modulation isn't clearly audible. Either the wiring
to the synth is broken, or the modulation depth/range is too narrow to be
perceptible. Investigate audio path + check that LFO output reaches the
destination parameter at meaningful amplitude.

---

### [Bug][UI] Aether logo using wrong theme variable 🔴
_Added 26 April 2026_

Logo currently uses `inverted-background` so it only renders correctly in
one mode. Should use the adaptive `background` token (or whichever
semantic token follows the active theme).

**File:** logo SVG / wrapper component (verify which)

---

### [Bug] Sustain default value is 65% — should be 100% 🔴
_Added 26 April 2026_

Initial sustain value when a new session loads is 65%. Spec is 100% as
default. No reset button needed — just change the initial state.

**File:** synth state initialiser (likely in client/src/lib or contexts)

---

### [Bug] Filter feels weak/ineffective on sine and triangle waves 🔴
_Added 26 April 2026_

Filter slider only audibly meaningful on sawtooth and square waves. This
is technically correct behaviour for a low-pass filter (sine has no
harmonics to cut, triangle has very few). But the UX is poor — slider
feels useless on half the waveforms.

Options:
- Switch to a different filter type that affects all waveforms (formant,
  resonant, comb)
- Disable/hide filter slider when sine or triangle is selected
- Add a second filter stage with a different character

Decision needed before any code change.

---

## Backlog

_Small to medium improvements. Ready to pick up. Add new items here when
scope is clear._

(none)

---

## Future Features

_Bigger ideas, not committed to. Move to Backlog when scoped and prioritised._

### [Feature][UI] Connect Drive and Glide sliders to synth 🔴
_Added 26 April 2026_

Drive and Glide sliders exist in the UI but aren't wired to the synth.
Need to expose the corresponding parameters in the audio engine and bind
the slider state to them.

---

## Done

_Recently completed. Most recent at top. Item format: short summary +
date. Full detail lives in git history; keep entries terse._

### [Infra] TURN credentials via metered.ca for VPN/restrictive networks ✅
_Shipped April 25 — 5-entry ICE config (UDP/TCP × ports 80/443 + TLS).
Free 20GB/month plan. Fixes connection failures for VPN users._
