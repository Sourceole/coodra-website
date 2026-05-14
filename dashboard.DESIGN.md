---
version: "alpha"
name: "Coodra Dashboard"
description: "Design contract for the retailer dashboard (light and dark themes)."
colors:
  primary: "#1b2540"
  secondary: "#5f6f83"
  tertiary: "#2ed3b7"
  neutral: "#f5f7fb"
  surface-light-shell: "#f5f7fb"
  surface-light-main: "#ffffff"
  surface-light-card: "#f3f5f8"
  border-light-main: "#d6dde8"
  border-light-card: "#cfd7e3"
  surface-dark-shell: "#171a20"
  surface-dark-main: "#23272f"
  surface-dark-card: "#23272f"
  border-dark-main: "#3a404b"
  border-dark-card: "#3a404b"
  on-light: "#111827"
  on-dark: "#e9eff8"
typography:
  title-lg:
    fontFamily: "Inter"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
  title-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: "1.35"
    letterSpacing: "0em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "0em"
  label-sm:
    fontFamily: "Inter"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "0.08em"
rounded:
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "18px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "16px"
  xl: "24px"
components:
  dashboard-main:
    backgroundColor: "{colors.surface-dark-main}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  dashboard-card:
    backgroundColor: "{colors.surface-dark-card}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  dashboard-card-light:
    backgroundColor: "{colors.surface-light-card}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  billing-plan-card:
    backgroundColor: "{colors.surface-light-card}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
---

## Overview
Coodra Dashboard should feel clean, premium, and operationally clear: strong hierarchy, high legibility, and consistent spacing across every nav tab.

## Colors
Use neutrals for the shell and cards. Reserve accent color for status and key action feedback, not for structural surfaces.

## Typography
Titles are compact and high-contrast. Labels are small uppercase metadata. Numeric values should be stable and easy to scan.

## Layout
Use a consistent inset rhythm from nav surface to inner cards. Prefer one spacing scale and avoid one-off per-tab spacing overrides.

## Elevation & Depth
Depth is subtle and consistent: a single main-surface shadow plus soft card shadows. Avoid stacking multiple unrelated contour wrappers.

## Shapes
Rounded corners are systematic: main surface `lg/xl`, cards `md`, controls `sm/md`.

## Components
Define dashboard primitives once (main surface, card, billing plan card) and reuse token references across light and dark themes.

## Do's and Don'ts
- Do keep theme parity for structure and spacing.
- Do centralize dashboard tokens in this file before adding style overrides.
- Don't add isolated color/spacer overrides when a tokenized primitive can be updated once.
- Don't use multiple competing "final override" blocks for the same selector.
