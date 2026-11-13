---
name: "卫戍协议助手"
description: "Desktop-first, high-density Chinese operator catalog"
colors:
  paper: "#f4f5ef"
  surface: "#fff"
  surface-soft: "#eef1e8"
  ink: "#252b26"
  muted: "#636b60"
  line: "#d6dbd0"
  accent: "#465e3d"
  accent-soft: "#e4ebdc"
  danger: "#9b3540"
  danger-soft: "#f8e9e9"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.4
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  badge: "2px"
  control: "3px"
  card: "4px"
  panel: "6px"
spacing:
  tight: "4px"
  compact: "8px"
  grid: "12px"
  section: "16px"
  panel: "24px"
  page: "32px"
components:
  button-ban:
    backgroundColor: "#f8f9f6"
    rounded: "{rounded.control}"
    padding: "5px 8px"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "8px 18px"
  button-quiet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "5px 10px"
  button-reset:
    textColor: "{colors.accent}"
    padding: "4px 0 4px 12px"
  covenant-select:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "34px"
    padding: "4px 30px 4px 10px"
  status-filter:
    textColor: "{colors.muted}"
    padding: "6px 2px 12px"
  status-chip:
    backgroundColor: "#f2f6ed"
    textColor: "#405735"
    rounded: "{rounded.badge}"
    padding: "1px 6px"
  operator-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
---

# Design System: 卫戍协议助手

## Overview

**Creative North Star: "高密度干员图录"**

A compact Chinese operator catalog on pale gray-green paper. Real portraits carry recognition; fine rules and concise metadata support comparison. Desktop is primary, with a vertically stacked mobile layout. Ban feedback stays on the existing cards rather than becoming a separate results screen.

**Key Characteristics:**
- Portrait-led density, not dashboard decoration.
- Olive selection and availability, muted red bans.
- Stable portrait geometry with explicit status and reasons.

## Colors

### Primary
Olive (accent) marks ordinary selection, links and keyboard focus; pale olive (accent-soft) fills selected tier controls.

### Secondary
Muted red (danger / danger-soft) marks bans; available operators retain pale green status labels.

### Neutral
Gray-green paper supports white surfaces. Soft surfaces hold compact counts; ink carries primary text, muted carries supporting metadata, and line separates regions.

**The Explicit State Rule.** Color always accompanies a written status; banned covenant names also receive a strike-through.

## Typography

The Chinese system sans-serif stack is functional reading type, not a display identity. Frontmatter records the recurring desktop roles. Section headings reduce to (18px), card names to (13px), and body text to (13px) at the mobile breakpoint. Card reasons use (11px / 1.5). Counts use tabular numerals. The existing site-name treatment is (22px), reducing to (18px); it is not a reusable display-font prescription.

## Layout

The current homepage places Ban controls above status, tier and covenant filters, then the portrait grid. This is the implemented surface composition, not a universal page template. Main width is capped at (1408px), with desktop padding (30px 32px 48px) and mobile padding (18px 14px 32px).

Operator columns are 8 / 6 / 5 / 3 at default / ≤1199px / ≤850px / ≤600px. Row/column gaps change from (14px / 12px) to (10px / 8px) on mobile. Covenant buttons use 10 / 7 / 5 / 4 columns at the same thresholds, then 3 at ≤359px. On phones, the Ban workspace precedes the roster in normal vertical flow.

**Stable portrait geometry:** portrait frames retain a (1.25) aspect ratio, cover cropping and (center 35%) object position through Ban changes. Confirmed banned operators sort after all others, preserving source order within both groups. Clearing bans restores source order; explicit filters may change membership.

## Elevation & Depth

No shadows. White surfaces, pale state fills and thin solid borders establish hierarchy without lifts or translation.

## Shapes

Small-radius rectangles dominate; frontmatter records badge, control, card and panel corners. Borders are (1px). Portraits clip inside the card silhouette; tier and status badges overlay image corners.

## Components

- **Ban buttons:** compact covenant icon and name; selected bans use red tint, strike-through and a prohibition mark. Minimum height is (43px), becoming (44px) on mobile.
- **Action buttons:** olive solid primary, white outlined quiet action, and text-only reset. Hover deepens the primary, gives the clear-Ban action a red tint, or underlines reset. Disabled controls remain static.
- **Filters:** status controls are counted button groups, not page navigation; the active item has a (2px) underline. Tier choices use pale olive selection. Covenant filtering uses a native select, (34px) tall or (40px) on mobile; there is no text-search input.
- **Operator cards:** banned portraits use grayscale (1) and opacity (0.5); available portraits retain color. Desktop information padding is (9px 10px 11px), mobile (8px). Name minimum height is (22px) desktop / (38px) mobile; covenant area is (36px). Every card has a concise reason with a reserved minimum (40px), separated by a fine rule. This is not a fixed-height clipping region: long text wraps. Ban does not insert a new reason block.
- **Feedback and access:** focus is an olive (2px) outline offset by (4px). Counts announce through a polite live region. Portrait filter and opacity transition over (180ms ease-out); reduced-motion preference disables the transition. Rules use native details disclosure.

## Do's and Don'ts

### Do:
- Do preserve real portraits, written status and a reason area on every card.
- Do distinguish ordinary selection from Ban.
- Do retain keyboard focus, semantic controls and reduced-motion behavior.

### Don't:
- Don't change portrait dimensions or move available operators into the banned group.
- Don't communicate a ruling through grayscale or color alone.
