// Theme configurations with colors, fonts, and styles
export const themes = {
  darkPlus: {
    id: "darkPlus",
    name: "Dark+",
    colors: {
      background: "#1e1e1e",
      backgroundSecondary: "#252526",
      text: "#d4d4d4",
      textSecondary: "#cccccc",
      textMuted: "#858585",
      primary: "#569cd6",
      accent: "#4ec9b0",
      border: "#3e3e42",
      cardBackground: "#252526",
      navBackground: "#1e1e1e",
      codeBackground: "#1e1e1e",
      codeText: "#d4d4d4",
      codeKeyword: "#569cd6",
      codeString: "#ce9178",
      codeFunction: "#dcdcaa",
      codeComment: "#6a9955",
      codeType: "#4ec9b0",
      codeVariable: "#9cdcfe",
      codeConstant: "#4fc1ff",
      codeNumber: "#b5cea8",
      codeControl: "#c586c0",
      codeOperator: "#d4d4d4",
    },
    legacy: {
      prim: "#569cd6",
      "primary-900": "#4ec9b0",
      "primary-800": "#5acfb5",
      "primary-700": "#6dd5bb",
      "primary-600": "#80dbc1",
      "primary-500": "#93e1c7",
      background: "#1e1e1e",
      card: "#252526",
      white: "#d4d4d4",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Cascadia Code', 'Monaco', 'Courier New', monospace",
    },
  },

  cursorDark: {
    id: "cursorDark",
    name: "Cursor Dark",
    colors: {
      background: "#0a0a0a",
      backgroundSecondary: "#1a1a2e",
      text: "#ffffff",
      textSecondary: "#e0e0e0",
      textMuted: "#a0a0a0",
      primary: "#5e81ac",
      accent: "#88c0d0",
      border: "#3a3a4a",
      cardBackground: "#16213e",
      navBackground: "#0f1419",
      codeBackground: "#1e1e1e",
      codeText: "#d4d4d4",
      codeKeyword: "#569cd6",
      codeString: "#ce9178",
      codeFunction: "#dcdcaa",
      codeComment: "#6a9955",
    },
    legacy: {
      prim: "#88c0d0",
      "primary-900": "#5e81ac",
      "primary-800": "#6b90b8",
      "primary-700": "#7a9dc4",
      "primary-600": "#8aabd0",
      "primary-500": "#9bb9dc",
      background: "#0a0a0a",
      card: "#16213e",
      white: "#ffffff",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Cascadia Code', 'Monaco', 'Courier New', monospace",
    },
  },

  midnightBlue: {
    id: "midnightBlue",
    name: "Midnight Blue",
    colors: {
      background: "#0c1821",
      backgroundSecondary: "#1b2a41",
      text: "#f0f4f8",
      textSecondary: "#d9e2ec",
      textMuted: "#9fb3c8",
      primary: "#3d5a80",
      accent: "#98c1d9",
      border: "#2e4057",
      cardBackground: "#1b2a41",
      navBackground: "#0c1821",
      codeBackground: "#162032",
      codeText: "#e3e8ef",
      codeKeyword: "#7fcdff",
      codeString: "#c3e88d",
      codeFunction: "#ffd580",
      codeComment: "#5c7a99",
    },
    legacy: {
      prim: "#98c1d9",
      "primary-900": "#3d5a80",
      "primary-800": "#4d6a90",
      "primary-700": "#5d7aa0",
      "primary-600": "#6d8ab0",
      "primary-500": "#7d9ac0",
      background: "#0c1821",
      card: "#1b2a41",
      white: "#f0f4f8",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Cascadia Code', 'Monaco', 'Courier New', monospace",
    },
  },

  solarizedDark: {
    id: "solarizedDark",
    name: "Solarized Dark",
    colors: {
      background: "#002b36",
      backgroundSecondary: "#073642",
      text: "#fdf6e3",
      textSecondary: "#eee8d5",
      textMuted: "#93a1a1",
      primary: "#268bd2",
      accent: "#2aa198",
      border: "#586e75",
      cardBackground: "#073642",
      navBackground: "#002b36",
      codeBackground: "#073642",
      codeText: "#fdf6e3",
      codeKeyword: "#268bd2",
      codeString: "#2aa198",
      codeFunction: "#b58900",
      codeComment: "#586e75",
    },
    legacy: {
      prim: "#2aa198",
      "primary-900": "#268bd2",
      "primary-800": "#3695d6",
      "primary-700": "#469fda",
      "primary-600": "#56a9de",
      "primary-500": "#66b3e2",
      background: "#002b36",
      card: "#073642",
      white: "#fdf6e3",
    },
    fonts: {
      primary:
        "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Source Code Pro', 'Monaco', monospace",
    },
  },

  nordDark: {
    id: "nordDark",
    name: "Nord",
    colors: {
      background: "#2e3440",
      backgroundSecondary: "#3b4252",
      text: "#eceff4",
      textSecondary: "#e5e9f0",
      textMuted: "#d8dee9",
      primary: "#88c0d0",
      accent: "#8fbcbb",
      border: "#4c566a",
      cardBackground: "#3b4252",
      navBackground: "#2e3440",
      codeBackground: "#3b4252",
      codeText: "#eceff4",
      codeKeyword: "#81a1c1",
      codeString: "#a3be8c",
      codeFunction: "#88c0d0",
      codeComment: "#616e88",
    },
    legacy: {
      prim: "#8fbcbb",
      "primary-900": "#88c0d0",
      "primary-800": "#92c7d5",
      "primary-700": "#9cceda",
      "primary-600": "#a6d5df",
      "primary-500": "#b0dce4",
      background: "#2e3440",
      card: "#3b4252",
      white: "#eceff4",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'JetBrains Mono', 'Monaco', monospace",
    },
  },

  dracula: {
    id: "dracula",
    name: "Dracula",
    colors: {
      background: "#282a36",
      backgroundSecondary: "#44475a",
      text: "#f8f8f2",
      textSecondary: "#f1f1eb",
      textMuted: "#6272a4",
      primary: "#bd93f9",
      accent: "#ff79c6",
      border: "#44475a",
      cardBackground: "#383a59",
      navBackground: "#282a36",
      codeBackground: "#282a36",
      codeText: "#f8f8f2",
      codeKeyword: "#ff79c6",
      codeString: "#f1fa8c",
      codeFunction: "#50fa7b",
      codeComment: "#6272a4",
    },
    legacy: {
      prim: "#ff79c6",
      "primary-900": "#bd93f9",
      "primary-800": "#c49dfa",
      "primary-700": "#cba7fb",
      "primary-600": "#d2b1fc",
      "primary-500": "#d9bbfd",
      background: "#282a36",
      card: "#383a59",
      white: "#f8f8f2",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Cascadia Code', 'Monaco', monospace",
    },
  },

  light: {
    id: "light",
    name: "Clean Light",
    colors: {
      background: "#ffffff",
      backgroundSecondary: "#f5f5f5",
      text: "#1a1a1a",
      textSecondary: "#333333",
      textMuted: "#666666",
      primary: "#0066cc",
      accent: "#0080ff",
      border: "#d0d0d0",
      cardBackground: "#f9f9f9",
      navBackground: "#ffffff",
      codeBackground: "#f5f5f5",
      codeText: "#1a1a1a",
      codeKeyword: "#0033cc",
      codeString: "#008000",
      codeFunction: "#795e26",
      codeComment: "#008000",
    },
    legacy: {
      prim: "#0080ff",
      "primary-900": "#0066cc",
      "primary-800": "#1a75d1",
      "primary-700": "#3384d6",
      "primary-600": "#4d93db",
      "primary-500": "#66a2e0",
      background: "#ffffff",
      card: "#f9f9f9",
      white: "#ffffff",
    },
    fonts: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      code: "'Fira Code', 'Cascadia Code', 'Monaco', monospace",
    },
  },
};

// Helper function to apply theme
export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  // Apply legacy variables for backward compatibility
  if (theme.legacy) {
    Object.entries(theme.legacy).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  // Apply font variables
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
};

// Get theme by id
export const getThemeById = (id) => {
  return themes[id] || themes.darkPlus;
};

// Get all theme options for selector
export const getThemeOptions = () => {
  return Object.values(themes).map((theme) => ({
    id: theme.id,
    name: theme.name,
  }));
};
