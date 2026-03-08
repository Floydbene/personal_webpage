import React from "react";
import { useTheme } from "../context/ThemeContext";
import { themes } from "../themes/themeConfig";
import "./ThemesPage.css";

const ThemesPage = () => {
  const { currentThemeId, setTheme } = useTheme();
  const themeEntries = Object.values(themes);

  return (
    <div className="themes-page">
      <h1 className="themes-page-title">Choose Your Theme</h1>
      <p className="themes-page-subtitle">
        Pick a color scheme that suits your vibe. Changes apply instantly.
      </p>

      <div className="themes-grid">
        {themeEntries.map((theme) => {
          const isActive = currentThemeId === theme.id;
          return (
            <button
              key={theme.id}
              className={`theme-card ${isActive ? "theme-card--active" : ""}`}
              onClick={() => setTheme(theme.id)}
            >
              {isActive && <span className="theme-card-badge">Current</span>}

              {/* Mini preview */}
              <div
                className="theme-preview"
                style={{ background: theme.colors.background }}
              >
                {/* Faux nav bar */}
                <div
                  className="tp-nav"
                  style={{
                    background: theme.colors.navBackground,
                    borderBottom: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <span
                    className="tp-nav-dot"
                    style={{ background: theme.colors.primary }}
                  />
                  <span
                    className="tp-nav-line"
                    style={{ background: theme.colors.textMuted }}
                  />
                  <span
                    className="tp-nav-line tp-nav-line--short"
                    style={{ background: theme.colors.textMuted }}
                  />
                </div>

                {/* Faux content area */}
                <div className="tp-body">
                  <div
                    className="tp-heading-line"
                    style={{ background: theme.colors.text }}
                  />
                  <div
                    className="tp-text-line"
                    style={{ background: theme.colors.textSecondary }}
                  />
                  <div className="tp-cards-row">
                    <div
                      className="tp-card"
                      style={{
                        background: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <span
                        className="tp-card-accent"
                        style={{ background: theme.colors.primary }}
                      />
                    </div>
                    <div
                      className="tp-card"
                      style={{
                        background: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <span
                        className="tp-card-accent"
                        style={{ background: theme.colors.accent }}
                      />
                    </div>
                  </div>
                  <div className="tp-tags-row">
                    <span
                      className="tp-tag"
                      style={{
                        background: `${theme.colors.primary}22`,
                        color: theme.colors.primary,
                      }}
                    />
                    <span
                      className="tp-tag"
                      style={{
                        background: `${theme.colors.accent}22`,
                        color: theme.colors.accent,
                      }}
                    />
                    <span
                      className="tp-tag tp-tag--wide"
                      style={{
                        background: `${theme.colors.primary}15`,
                        color: theme.colors.textMuted,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="theme-card-info">
                <span className="theme-card-name">{theme.name}</span>
                <span className="theme-card-colors">
                  <span
                    className="color-dot"
                    style={{ background: theme.colors.primary }}
                  />
                  <span
                    className="color-dot"
                    style={{ background: theme.colors.accent }}
                  />
                  <span
                    className="color-dot"
                    style={{ background: theme.colors.text }}
                  />
                  <span
                    className="color-dot"
                    style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemesPage;
