/**
 * Three art-directed palettes, all built in OKLCH so lightness steps are
 * perceptually even and neutrals can be tinted toward each palette's own hue.
 *
 * Every neutral carries a little chroma from the accent family — that is what
 * keeps the greys from reading as generic UI grey and ties the whole surface
 * to one ink.
 */

const FONTS = {
  primary: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  heading: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Azeret Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  code: "'Azeret Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

export const themes = {
  /* Amber phosphor. Warm ink-black ground, paper-warm type, amber CRT accent.
     The historical amber terminal — deliberately not green, deliberately not cyan. */
  amber: {
    id: "amber",
    name: "Amber",
    tagline: "Warm ink, amber phosphor",
    appearance: "dark",
    colors: {
      background: "oklch(0.165 0.014 55)",
      backgroundSecondary: "oklch(0.215 0.016 55)",
      text: "oklch(0.94 0.018 85)",
      textSecondary: "oklch(0.80 0.020 80)",
      textMuted: "oklch(0.66 0.022 70)",
      primary: "oklch(0.78 0.155 68)",
      accent: "oklch(0.70 0.185 42)",
      border: "oklch(0.32 0.018 60)",
      cardBackground: "oklch(0.205 0.016 55)",
      navBackground: "oklch(0.165 0.014 55)",
      codeBackground: "oklch(0.195 0.016 55)",
      codeText: "oklch(0.90 0.018 85)",
      codeKeyword: "oklch(0.78 0.155 68)",
      codeString: "oklch(0.80 0.115 130)",
      codeFunction: "oklch(0.85 0.130 95)",
      codeComment: "oklch(0.58 0.020 65)",
      codeType: "oklch(0.80 0.100 45)",
      codeVariable: "oklch(0.88 0.030 80)",
      codeConstant: "oklch(0.78 0.140 30)",
      codeNumber: "oklch(0.82 0.110 120)",
      codeControl: "oklch(0.72 0.150 20)",
      codeOperator: "oklch(0.86 0.020 80)",
      noiseOpacity: "0.035",
    },
    legacy: {
      prim: "oklch(0.78 0.155 68)",
      "primary-900": "oklch(0.70 0.185 42)",
      "primary-800": "oklch(0.74 0.170 50)",
      "primary-700": "oklch(0.78 0.155 58)",
      "primary-600": "oklch(0.82 0.140 66)",
      "primary-500": "oklch(0.86 0.120 74)",
      background: "oklch(0.165 0.014 55)",
      card: "oklch(0.205 0.016 55)",
      white: "oklch(0.94 0.018 85)",
    },
    fonts: FONTS,
  },

  /* Bone. Newsprint stock and deep ink blue, the way printed matter actually
     looks — cool ink on warm paper, so neither reads as neutral. The one warm
     colour left is the oxblood accent, kept for things that need to alarm.

     Every token below is checked against the paper for WCAG AA (text sits at
     15:1, the ink at 7.7:1, muted labels at 6.3:1). `border` is deliberately
     low-contrast: it is a hairline, never type. */
  bone: {
    id: "bone",
    name: "Bone",
    tagline: "Newsprint and ink blue",
    appearance: "light",
    colors: {
      background: "oklch(0.968 0.007 92)",
      backgroundSecondary: "oklch(0.938 0.009 92)",
      text: "oklch(0.238 0.019 258)",
      textSecondary: "oklch(0.398 0.021 258)",
      textMuted: "oklch(0.468 0.022 258)",
      primary: "oklch(0.425 0.142 262)",
      accent: "oklch(0.440 0.132 26)",
      border: "oklch(0.862 0.011 92)",
      cardBackground: "oklch(0.948 0.008 92)",
      navBackground: "oklch(0.968 0.007 92)",
      codeBackground: "oklch(0.928 0.010 92)",
      codeText: "oklch(0.258 0.019 258)",
      codeKeyword: "oklch(0.435 0.142 262)",
      codeString: "oklch(0.432 0.098 158)",
      codeFunction: "oklch(0.448 0.118 300)",
      codeComment: "oklch(0.545 0.016 258)",
      codeType: "oklch(0.442 0.078 205)",
      codeVariable: "oklch(0.312 0.019 258)",
      codeConstant: "oklch(0.448 0.130 26)",
      codeNumber: "oklch(0.438 0.108 148)",
      codeControl: "oklch(0.442 0.140 330)",
      codeOperator: "oklch(0.338 0.019 258)",
      noiseOpacity: "0.02",
    },
    legacy: {
      prim: "oklch(0.425 0.142 262)",
      "primary-900": "oklch(0.325 0.118 262)",
      "primary-800": "oklch(0.365 0.130 262)",
      "primary-700": "oklch(0.425 0.142 262)",
      "primary-600": "oklch(0.485 0.140 262)",
      "primary-500": "oklch(0.545 0.130 262)",
      background: "oklch(0.968 0.007 92)",
      card: "oklch(0.948 0.008 92)",
      white: "oklch(0.238 0.019 258)",
    },
    fonts: FONTS,
  },

  /* Citron. Cool near-black with just enough violet to feel deliberate,
     against an acid citron. The loud one. */
  citron: {
    id: "citron",
    name: "Citron",
    tagline: "Cool black, acid citron",
    appearance: "dark",
    colors: {
      background: "oklch(0.155 0.028 290)",
      backgroundSecondary: "oklch(0.205 0.032 290)",
      text: "oklch(0.955 0.012 300)",
      textSecondary: "oklch(0.815 0.018 295)",
      textMuted: "oklch(0.675 0.030 292)",
      primary: "oklch(0.855 0.175 108)",
      accent: "oklch(0.735 0.175 330)",
      border: "oklch(0.315 0.032 292)",
      cardBackground: "oklch(0.195 0.032 290)",
      navBackground: "oklch(0.155 0.028 290)",
      codeBackground: "oklch(0.185 0.030 290)",
      codeText: "oklch(0.925 0.014 300)",
      codeKeyword: "oklch(0.735 0.175 330)",
      codeString: "oklch(0.855 0.175 108)",
      codeFunction: "oklch(0.865 0.130 195)",
      codeComment: "oklch(0.585 0.030 292)",
      codeType: "oklch(0.835 0.120 175)",
      codeVariable: "oklch(0.895 0.030 300)",
      codeConstant: "oklch(0.815 0.150 60)",
      codeNumber: "oklch(0.865 0.140 130)",
      codeControl: "oklch(0.775 0.160 340)",
      codeOperator: "oklch(0.875 0.020 300)",
      noiseOpacity: "0.03",
    },
    legacy: {
      prim: "oklch(0.855 0.175 108)",
      "primary-900": "oklch(0.735 0.175 330)",
      "primary-800": "oklch(0.775 0.165 345)",
      "primary-700": "oklch(0.815 0.150 20)",
      "primary-600": "oklch(0.835 0.160 70)",
      "primary-500": "oklch(0.855 0.175 108)",
      background: "oklch(0.155 0.028 290)",
      card: "oklch(0.195 0.032 290)",
      white: "oklch(0.955 0.012 300)",
    },
    fonts: FONTS,
  },
};

export const DEFAULT_THEME_ID = "amber";

/**
 * Density of the index. One switch, not two named modes: on is the dense
 * tabular house style, off is the roomier image-forward reading.
 *
 * Drives `data-compact` on <html>; landing.css keeps the compact layout as its
 * base and hangs the roomy overrides off `[data-compact="false"]`.
 */
export const DEFAULT_COMPACT = true;

export const applyTheme = (theme) => {
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  if (theme.legacy) {
    Object.entries(theme.legacy).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });

  root.dataset.appearance = theme.appearance;
};

export const getThemeById = (id) => themes[id] || themes[DEFAULT_THEME_ID];

export const getThemeOptions = () =>
  Object.values(themes).map(({ id, name, tagline, appearance, colors }) => ({
    id,
    name,
    tagline,
    appearance,
    swatches: [colors.primary, colors.accent, colors.text, colors.background],
  }));
