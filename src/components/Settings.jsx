import React, { useEffect, useRef, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { getThemeOptions } from "../themes/themeConfig";
import "./controls.css";

/** Appearance preferences: density and palette. */
const Settings = () => {
  const { currentThemeId, setTheme, compact, toggleCompact } = useTheme();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const options = getThemeOptions();

  // Click-away and Escape. Both are on the document because the tray is not
  // modal — the page underneath stays live while it is open.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector("button")?.focus();
  }, [open]);

  return (
    <div className="settings" ref={wrapRef}>
      <button
        type="button"
        ref={buttonRef}
        className="settings__trigger"
        aria-expanded={open}
        aria-controls="display-settings"
        onClick={() => setOpen((current) => !current)}
      >
        <FaSlidersH aria-hidden="true" />
        <span>Display</span>
      </button>

      {open && (
        <div className="settings__panel" id="display-settings" ref={panelRef} role="group" aria-label="Display settings">
          <section className="settings__group">
            <h2 className="settings__label">Density</h2>
            <button
              type="button"
              className="settings__row settings__row--toggle"
              aria-pressed={compact}
              onClick={toggleCompact}
            >
              <span className="settings__rowText">
                Compact
                <small>Dense tabular rows, expand to read</small>
              </span>
              <span className="settings__switch" aria-hidden="true" />
            </button>
          </section>

          <section className="settings__group">
            <h2 className="settings__label">Palette</h2>
            <div className="settings__palettes">
              {options.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className="settings__row"
                  aria-pressed={currentThemeId === theme.id}
                  onClick={() => setTheme(theme.id)}
                >
                  <span
                    className="swatch__chip"
                    style={{
                      "--chip-bg": theme.swatches[3],
                      "--chip-ink": theme.swatches[0],
                      "--chip-accent": theme.swatches[1],
                    }}
                    aria-hidden="true"
                  />
                  <span className="settings__rowText">
                    {theme.name}
                    <small>{theme.tagline}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
};

export default Settings;
