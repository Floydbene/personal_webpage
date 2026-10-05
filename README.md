#### My Personal WebPage

Welcome to my personal webpage. I built this page to practice some UI and React
functions and to show off a bit of myself. I hope you enjoy it!

## The index

The landing page is a single numbered catalogue — work, builds and writing in one
list — rather than a stack of sections. Rows expand in place. Deliberately no
cards, no timeline, no image grid.

<kbd>j</kbd>/<kbd>k</kbd> move the cursor, <kbd>enter</kbd> opens a row,
<kbd>esc</kbd> closes it.

It also takes commands, but not on the page — press <kbd>`</kbd> for **index-sh**,
a read-only shell over the CV in a floating, movable window. `ls`, `cd cv/work`,
`cat proda`, `cat resume`, `grep python`, `open trini`, `help`. It is off by
default and everything in it is reachable by mouse too.

## Features

- **A real shell** — `index-sh` mounts the CV and project index as a virtual
  filesystem derived from `src/Data.jsx`. `cd`/`cat`/`open`/`grep`/`tree`, tab
  completion, history. `open` hands a file back to the page. Off by default.
- **Compact density** — on by default: dense, tabular, one row open at a time.
  Off relaxes the same markup into a roomier, image-forward reading.
- **Three OKLCH palettes** — Amber, Bone, Citron. See [THEMES.md](./THEMES.md).
- **Fully static** — no backend, no database, no auth, no runtime network calls
  beyond Google Fonts.
- **Responsive** via container queries on the index itself, so rows reflow to
  their own width rather than the viewport's.
- **Accessible** — WCAG AA contrast, real focus rings, `prefers-reduced-motion`
  honoured throughout.

## Development

```bash
make install   # Install dependencies
make dev       # Start development server
make build     # Build for production
make preview   # Preview production build
```

## Tech Stack

- React 18
- Vite
- React Router
- Styled Components (navbar only — everything else is plain CSS)
- React Icons
