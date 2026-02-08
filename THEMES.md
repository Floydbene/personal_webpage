# Theme System Documentation

## Overview

This website features a modular theme system that allows users to choose from multiple professionally designed color palettes with custom fonts and code highlighting. The system is fully backward compatible with existing CSS variables like `--prim`, `--primary-900`, etc.

## Default Theme

The site defaults to **Cursor Dark** theme - a black background with midnight blue accents and white text, featuring Cursor-style syntax highlighting for code sections.

## Available Themes

### 1. Cursor Dark (Default)

- **Background:** Deep black (#0a0a0a)
- **Accent:** Nordic blue tones
- **Font:** Inter for UI, Fira Code for code
- **Code highlighting:** VS Code dark style

### 2. Midnight Blue

- **Background:** Dark blue (#0c1821)
- **Accent:** Light blue (#98c1d9)
- **Font:** Inter for UI, Fira Code for code
- **Code highlighting:** Custom blue theme

### 3. Solarized Dark

- **Background:** Solarized base (#002b36)
- **Accent:** Cyan (#2aa198)
- **Font:** Source Sans Pro for UI, Source Code Pro for code
- **Code highlighting:** Solarized palette

### 4. Nord

- **Background:** Nord polar night (#2e3440)
- **Accent:** Nord frost (#88c0d0)
- **Font:** Inter for UI, JetBrains Mono for code
- **Code highlighting:** Nord palette

### 5. Dracula

- **Background:** Dracula dark (#282a36)
- **Accent:** Purple (#bd93f9) and pink (#ff79c6)
- **Font:** Inter for UI, Fira Code for code
- **Code highlighting:** Dracula palette

### 6. Clean Light

- **Background:** White (#ffffff)
- **Accent:** Blue (#0066cc)
- **Font:** Inter for UI, Fira Code for code
- **Code highlighting:** VS Code light style

## How to Use

1. Click the **palette icon** (🎨) in the navigation bar
2. Select your preferred theme from the modal
3. Your choice is automatically saved to localStorage

## Architecture

### Files Structure

```
src/
├── themes/
│   └── themeConfig.js          # Theme definitions and utilities
├── context/
│   └── ThemeContext.jsx        # React context for theme state
├── components/
│   ├── ThemeSelector.jsx       # Theme picker modal UI
│   └── ThemeSelector.css       # Theme picker styles
└── index.css                   # CSS consuming theme variables
```

### Theme Configuration

Each theme in `themeConfig.js` includes:

- **colors:** Full palette (background, text, borders, code syntax)
- **legacy:** Backward-compatible variables (`--prim`, `--primary-900`, `--background`, `--card`, `--white`)
- **fonts:** Primary (UI) and code (monospace) font families

### CSS Variables

All theme colors are exposed as CSS variables:

**New Theme Variables:**

- `--theme-background`
- `--theme-text`
- `--theme-primary`
- `--theme-accent`
- `--theme-codeBackground`
- `--theme-codeKeyword`
- `--theme-codeString`
- `--theme-codeFunction`
- `--theme-codeComment`
- And more...

**Legacy Variables (automatically parametrized per theme):**

- `--prim` (primary accent color)
- `--primary-900` through `--primary-500` (color shades)
- `--background`
- `--card`
- `--white`

These legacy variables now change dynamically based on the selected theme, ensuring all existing styles work with the new theme system.

## Adding New Themes

1. Add a new theme object to `themes` in `themeConfig.js`:

```javascript
myNewTheme: {
  id: 'myNewTheme',
  name: 'My New Theme',
  colors: {
    background: '#...',
    text: '#...',
    // ... all required colors
  },
  legacy: {
    prim: '#...',
    'primary-900': '#...',
    'primary-800': '#...',
    'primary-700': '#...',
    'primary-600': '#...',
    'primary-500': '#...',
    background: '#...',
    card: '#...',
    white: '#...',
  },
  fonts: {
    primary: "'Font Name', sans-serif",
    code: "'Code Font', monospace",
  },
}
```

2. The theme will automatically appear in the theme selector!

**Important:** Make sure to define all legacy variables to ensure backward compatibility with existing styles.

## Persistence

User theme preference is stored in `localStorage` under the key `themeId` and persists across sessions.
