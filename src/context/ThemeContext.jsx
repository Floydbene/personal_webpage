import React, { createContext, useContext, useState, useEffect } from "react";
import { themes, applyTheme, getThemeById } from "../themes/themeConfig";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Default to Dark+ theme
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    const saved = localStorage.getItem("themeId");
    return saved || "darkPlus";
  });

  const currentTheme = getThemeById(currentThemeId);

  useEffect(() => {
    localStorage.setItem("themeId", currentThemeId);
    applyTheme(currentTheme);
  }, [currentThemeId, currentTheme]);

  const setTheme = (themeId) => {
    setCurrentThemeId(themeId);
  };

  // Legacy compatibility - check if current theme is dark
  const isDarkMode = currentThemeId !== "light";

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        currentThemeId,
        setTheme,
        isDarkMode, // For backward compatibility
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
