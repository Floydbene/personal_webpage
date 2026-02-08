import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { getThemeOptions } from "../themes/themeConfig";
import { FaPalette, FaTimes } from "react-icons/fa";
import "./ThemeSelector.css";

const ThemeSelector = () => {
  const { currentThemeId, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const themeOptions = getThemeOptions();

  const toggleSelector = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector-wrapper">
      <button
        onClick={toggleSelector}
        className="theme-selector-button"
        aria-label="Select theme"
        title="Change theme"
      >
        <FaPalette />
      </button>

      {isOpen && (
        <>
          <div
            className="theme-selector-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="theme-selector-modal">
            <div className="theme-selector-header">
              <h3>Select Theme</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="theme-selector-close"
                aria-label="Close theme selector"
              >
                <FaTimes />
              </button>
            </div>
            <div className="theme-selector-options">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`theme-option ${currentThemeId === theme.id ? "active" : ""}`}
                >
                  <span className="theme-option-name">{theme.name}</span>
                  {currentThemeId === theme.id && (
                    <span className="theme-option-checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
