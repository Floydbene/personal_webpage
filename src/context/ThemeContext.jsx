import React, { createContext, useContext, useState, useEffect } from "react";
import {
  themes,
  applyTheme,
  getThemeById,
  DEFAULT_THEME_ID,
  DEFAULT_COMPACT,
} from "../themes/themeConfig";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    const saved = localStorage.getItem("themeId");
    // Palettes were replaced wholesale — anything stored from the old set
    // (darkPlus, dracula, nordDark, …) no longer resolves, so fall through.
    return saved && themes[saved] ? saved : DEFAULT_THEME_ID;
  });

  const [compact, setCompactState] = useState(() => {
    const saved = localStorage.getItem("uiCompact");
    return saved === null ? DEFAULT_COMPACT : saved === "true";
  });

  const currentTheme = getThemeById(currentThemeId);

  useEffect(() => {
    localStorage.setItem("themeId", currentThemeId);
    applyTheme(currentTheme);
  }, [currentThemeId, currentTheme]);

  useEffect(() => {
    localStorage.setItem("uiCompact", String(compact));
    document.documentElement.dataset.compact = String(compact);
  }, [compact]);

  const setTheme = (themeId) => {
    if (themes[themeId]) setCurrentThemeId(themeId);
  };

  const setCompact = (next) => setCompactState(Boolean(next));

  const toggleCompact = () => setCompactState((current) => !current);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        currentThemeId,
        setTheme,
        themes,
        compact,
        setCompact,
        toggleCompact,
        isDarkMode: currentTheme.appearance !== "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
