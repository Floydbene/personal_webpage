# Theme System

Two independent axes: **palette** (colour) and **density**. They compose — any
palette works at either density. Both persist to `localStorage` and are applied
to `<html>` by `ThemeProvider` on mount.

| Axis | Values | Storage key | Applied as |
| --- | --- | --- | --- |
| Palette | `amber` · `bone` · `citron` | `themeId` | `--theme-*` custom properties + `data-appearance` |
| Density | `true` · `false` | `uiCompact` | `data-compact` |

Both are switched from the settings tray in the navbar
(`src/components/Settings.jsx`), which also opens the shell. One trigger for all
three beats three competing affordances in a nav bar, and the palette rows still
show their own swatch so selection stays direct rather than nested.

## Palettes

All three are authored in **OKLCH**, not hex. Lightness in OKLCH is perceptually
uniform, so equal steps *look* equal — which is what makes the muted/secondary
text tiers land predictably across all three. Neutrals are not grey: each carries
a small amount of chroma from its own palette's hue, which is what ties the
surfaces to the accent instead of leaving them floating.

### `amber` — default, dark

Warm ink-black ground, paper-warm type, amber accent. The reference is a 1980s
amber CRT, chosen partly because it is emphatically *not* the green terminal and
not cyan-on-dark.

- Ground `oklch(0.165 0.014 55)` · text `oklch(0.94 0.018 85)`
- Primary `oklch(0.78 0.155 68)` · accent `oklch(0.70 0.185 42)`

### `bone` — light

Newsprint paper and deep ink blue — cool ink on warm stock, the way printed
matter actually looks, so neither reads as neutral. The one warm colour left is
the oxblood accent, reserved for things that need to alarm. The best of the three
for `/resume`, which is a dense serif document.

- Ground `oklch(0.968 0.007 92)` · text `oklch(0.238 0.019 258)`
- Primary `oklch(0.425 0.142 262)` · accent `oklch(0.440 0.132 26)`
- Against the paper: text 15.1:1, primary 7.7:1, `textMuted` 6.3:1

### `citron` — dark

Cool near-black with just enough violet to read as deliberate, against an acid
citron, with magenta as the secondary. The loud one.

- Ground `oklch(0.155 0.028 290)` · text `oklch(0.955 0.012 300)`
- Primary `oklch(0.855 0.175 108)` · accent `oklch(0.735 0.175 330)`

Muted text tiers are set to clear WCAG AA (4.5:1) against their own ground —
`textMuted` is the tightest of the three tiers, so check it first if you retune
any palette.

## Density

**Compact** (default) is dense and tabular: index rows sit on a fixed column grid
with tabular numerals and expand one at a time. Turning it off gives the same
markup a larger scale, looser rhythm, visible imagery, and every row already
open. The difference is entirely CSS: compact is the base stylesheet and the
roomy layout hangs off `:root[data-compact="false"]` in
`src/components/landing.css`. There is no second component tree.

The index used to carry its own command bar. It does not any more — that role
moved to `index-sh`, the floating shell window in `src/shell/`, which is off by default
and reachable from the settings tray or the backtick key.

## Typography

Two families, both variable:

- **Archivo** — display and body. The `wdth` axis (62–125) does the work that a
  second display face would otherwise do: `wdth 112` for the wordmark, `94–100`
  for row names and section heads.
- **Azeret Mono** — refs, spans, labels, tags, the prompt. Mono is reserved for
  machine-readable parts. Prose never gets it, or the page reads as mono cosplay.

**Libre Baskerville** is loaded for `/resume` only, which keeps its own serif
identity.

## Files

```
src/
├── themes/themeConfig.js       # palettes, DEFAULT_COMPACT, applyTheme(), getThemeOptions()
├── context/ThemeContext.jsx    # palette + density state, localStorage, <html> attrs
├── components/
│   ├── Settings.jsx            # the tray: density, palette, shell
│   ├── controls.css            # the tray's styles
│   └── landing.css             # index styles incl. all [data-compact=false] overrides
└── index.css                   # fallback palette + shared/resume/research styles
```

`index.css` duplicates the `amber` values on bare `:root`. That is deliberate —
without it the page paints unstyled for one frame before React mounts. If you
change `amber`, change that block too.

## Adding a palette

Add an entry to `themes` in `themeConfig.js`. It needs `id`, `name`, `tagline`,
`appearance` (`dark` | `light`), a full `colors` object, a `legacy` block, and
`fonts: FONTS`. It then appears in the navbar swatches and in the `theme <id>`
command automatically.

The `legacy` block (`--prim`, `--primary-900`…`-500`, `--background`, `--card`,
`--white`) still exists because a few older styled-components read those names.
Omit it and those components fall back to the previous palette's values.
