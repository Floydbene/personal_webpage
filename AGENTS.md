## Design Context

### Users
Recruiters, potential employers, collaborators, and fellow developers visiting Floyd Benedikter's personal portfolio. They're evaluating technical skill, creativity, and personality — often scanning quickly before deciding to dig deeper. Context: desktop during work hours, mobile during commutes.

### Brand Personality
**Bold, experimental, playful.** This isn't a safe corporate portfolio — it's a statement piece that shows Floyd takes risks and has taste. The site should feel like opening a creative person's sketchbook, not reading a resume PDF.

### Aesthetic Direction
- **Visual tone**: Creative portfolio — art-directed, visually surprising, Awwwards-caliber.
- **References**: Awwwards winners, creative agency portfolios, art-directed editorial sites.
- **Anti-references**: Generic developer portfolios with card grids, timeline components, and dark-mode-with-cyan.
- **Theme**: Dark-first, done with intention.

### Established Direction — "the index"
The landing page is a single numbered catalogue (work / build / write), not a
stack of sections. Rows expand in place. There are deliberately **no cards, no
timeline, and no image grid** anywhere on it — those were the anti-references
the page used to be built from.

- **Density**: one switch, not two named modes. Compact (default — dense,
  tabular, `j`/`k` keyboard nav) is the base; turning it off relaxes the same
  markup into a roomier, image-forward reading. Swapped via `data-compact` on
  `<html>`; both live in `src/components/landing.css`.
- **The shell**: `index-sh` (`src/shell/`) is a read-only filesystem over the
  CV — `cd`, `cat`, `open`, `grep`, `tree`. A floating window — draggable by
  its tab strip, resizable from any edge, never reflows the page — and **off by
  default**, opened from the settings tray or the backtick key. It replaced the
  in-page command bar; the index itself no longer has a prompt.
- **Controls**: one settings tray in the navbar (`src/components/Settings.jsx`)
  holds density, palette and the shell. Not three separate switches.
- **Palettes**: three, all OKLCH, in `src/themes/themeConfig.js` — `amber`
  (default, warm ink + amber phosphor), `bone` (the light one — newsprint paper
  + deep ink blue, oxblood accent), `citron` (cool black + acid citron).
  Neutrals are tinted toward each palette's own hue; no flat greys.
- **Type**: Archivo (variable `wdth`, display + body) paired with Azeret Mono
  (refs, spans, labels, prompt). Libre Baskerville stays on `/resume` only.
  Mono is for machine-readable parts — never for prose, or the page reads as
  mono cosplay.
- **Watch for**: "very CLI" done lazily becomes *more* robotic, not less. The
  craft is tabular alignment, a real modular scale, and fast easing — not ASCII
  art or green-on-black.

### Design Principles
1. **Surprise over safety** — Every section should have at least one moment that makes you pause.
2. **Personality is the product** — Let quirks, humor, and taste come through.
3. **Craft over convention** — Reject the first "good enough" solution.
4. **Rhythm over uniformity** — Vary scale, spacing, and density across sections.
5. **Accessible boldness** — WCAG AA compliance. Bold design doesn't mean excluding anyone.
