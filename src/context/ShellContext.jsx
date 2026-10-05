import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ShellContext = createContext();

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
};

/**
 * Owns nothing but "is the panel up?".
 *
 * Starts closed and stays closed until the user opens it.
 * The Terminal stays mounted while hidden to preserve cwd and scrollback.
 */
export const ShellProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openShell = useCallback(() => setIsOpen(true), []);
  const closeShell = useCallback(() => setIsOpen(false), []);
  const toggleShell = useCallback(() => setIsOpen((open) => !open), []);

  // Escape dismisses the floating shell regardless of where focus moved.
  // Capture it before the page underneath handles its own Escape shortcut.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onEscape = (event) => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      closeShell();
    };

    window.addEventListener("keydown", onEscape, true);
    return () => window.removeEventListener("keydown", onEscape, true);
  }, [isOpen, closeShell]);

  // Backtick anywhere on the page brings it up, the way a console key should.
  // Guarded on the focused element so it never eats a literal backtick from
  // someone typing into the command bar — or into the shell itself.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "`" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (typing) return;

      event.preventDefault();
      setIsOpen((open) => !open);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The window floats, it is not modal — the page stays scrollable behind it
  // and never reflows around it. Published on the root anyway, so page CSS can
  // react to the shell being open without reaching into the component.
  useEffect(() => {
    document.documentElement.dataset.shell = isOpen ? "open" : "closed";
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, openShell, closeShell, toggleShell }),
    [isOpen, openShell, closeShell, toggleShell]
  );

  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
};
