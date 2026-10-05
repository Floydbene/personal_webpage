import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useShell } from "../context/ShellContext";
import { L, displayPath } from "./filesystem";
import { banner, complete, runLine } from "./commands";
import "./terminal.css";

const QUICK = ["cat resume", "ls", "tree", "neofetch", "help", "exit"];

/* The window floats, so it owns four numbers instead of one height. */
const MIN_W = 360;
const MIN_H = 220;
const MARGIN = 16;

/* Every edge and corner is a grab point; `se` also takes arrow keys. */
const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

const clampRect = (rect) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(Math.max(rect.w, MIN_W), vw - MARGIN * 2);
  const h = Math.min(Math.max(rect.h, MIN_H), vh - MARGIN * 2);
  return {
    w,
    h,
    x: Math.min(Math.max(rect.x, MARGIN), Math.max(MARGIN, vw - w - MARGIN)),
    y: Math.min(Math.max(rect.y, MARGIN), Math.max(MARGIN, vh - h - MARGIN)),
  };
};

const fullRect = () => ({
  x: MARGIN,
  y: MARGIN,
  w: window.innerWidth - MARGIN * 2,
  h: window.innerHeight - MARGIN * 2,
});

/* A prominent, centred workspace with a ten-percent gutter on every side. */
const defaultRect = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return { x: vw * 0.1, y: vh * 0.1, w: vw * 0.8, h: vh * 0.8 };
};

/* Resizing anchors the opposite edge, so dragging the top or left never
   shunts the whole window — it just grows it the other way. */
const resizeRect = (from, dir, dx, dy) => {
  let { x, y, w, h } = from;

  if (dir.includes("e")) {
    w = Math.min(
      Math.max(from.w + dx, MIN_W),
      window.innerWidth - from.x - MARGIN
    );
  }

  if (dir.includes("s")) {
    h = Math.min(
      Math.max(from.h + dy, MIN_H),
      window.innerHeight - from.y - MARGIN
    );
  }

  if (dir.includes("w")) {
    x = Math.max(MARGIN, Math.min(from.x + dx, from.x + from.w - MIN_W));
    w = from.x + from.w - x;
  }

  if (dir.includes("n")) {
    y = Math.max(MARGIN, Math.min(from.y + dy, from.y + from.h - MIN_H));
    h = from.y + from.h - y;
  }

  return { x, y, w, h };
};

/* ------------------------------------------------------------------
   one line of scrollback
   ------------------------------------------------------------------ */

const Line = ({ line, onRun, onNavigate }) => {
  switch (line.kind) {
    case "blank":
      return <div className="tty-line tty-line--blank" aria-hidden="true" />;

    case "rule":
      return <div className="tty-rule" aria-hidden="true" />;

    case "echo":
      return (
        <div className="tty-line tty-line--echo">
          <span className="tty-line__prompt">{line.key}</span>
          <span>{line.text}</span>
        </div>
      );

    case "branch":
      return (
        <div className="tty-line tty-line--branch">
          <span className="tty-line__spine">{line.prefix}</span>
          <span data-type={line.nodeType}>{line.text}</span>
        </div>
      );

    case "kv":
      return (
        <div
          className="tty-line tty-line--kv"
          data-wide={line.wide ? "true" : undefined}
          data-strong={line.strong ? "true" : undefined}
        >
          <span className="tty-line__key">{line.key}</span>
          <span className="tty-line__value">{line.text}</span>
        </div>
      );

    case "link":
      return (
        <div className="tty-line tty-line--kv">
          <span className="tty-line__key">{line.key}</span>
          {line.internal ? (
            <button
              type="button"
              className="tty-link"
              onClick={() => onNavigate(line.href)}
            >
              {line.text}
              <span aria-hidden="true"> →</span>
            </button>
          ) : (
            <a
              className="tty-link"
              href={line.href}
              target="_blank"
              rel="noreferrer"
            >
              {line.text}
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </div>
      );

    // Directory listings stay clickable, so the shell is still usable with a
    // thumb and no keyboard.
    case "listing":
      return (
        <div className="tty-line tty-listing">
          {line.items.map((item) => (
            <button
              key={item.name}
              type="button"
              className="tty-listing__item"
              data-type={item.type}
              onClick={() =>
                item.target &&
                onRun(
                  `${item.type === "dir" ? "cd" : "cat"} /${item.target.replace(
                    /\/$/,
                    ""
                  )}`
                )
              }
              disabled={!item.target}
            >
              {item.name}
            </button>
          ))}
        </div>
      );

    default:
      return (
        <div className="tty-line" data-kind={line.kind}>
          {line.text}
        </div>
      );
  }
};

/* ------------------------------------------------------------------
   the terminal
   ------------------------------------------------------------------ */

/**
 * A read-only shell over the CV and project index, floating over the page as a
 * window you can move and resize: an editor's tab strip on top, no scrim, and
 * no reflow underneath — the index stays visible and scrollable behind it,
 * which is what makes `open` handing a file back to the page legible.
 *
 * Stays mounted while closed — `data-open="false"` hides it — so toggling back
 * in returns you to the directory, scrollback and position you left, which is
 * the whole point of a shell having state.
 */
const Terminal = () => {
  const { isOpen, closeShell } = useShell();
  const { themes, currentThemeId, setTheme } = useTheme();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const returnFocusRef = useRef(null);
  const wasOpenRef = useRef(false);
  const scrollRef = useRef(null);
  const lineId = useRef(0);
  const previousCwd = useRef([]);
  const dragFrom = useRef(null);

  const [cwd, setCwdState] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyAt, setHistoryAt] = useState(-1);
  const [rect, setRect] = useState(null);
  const [restoreTo, setRestoreTo] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [scrollback, setScrollback] = useState(() =>
    banner().map((line) => ({ ...line, id: ++lineId.current }))
  );

  const prompt = `floyd@benedikter ${displayPath(cwd)} $`;

  const print = useCallback((lines) => {
    setScrollback((current) => [
      ...current,
      ...lines.map((line) => ({ ...line, id: ++lineId.current })),
    ]);
  }, []);

  const goto = useCallback(
    (href) => {
      closeShell();
      navigate(href);
    },
    [closeShell, navigate]
  );

  const execute = useCallback(
    (raw) => {
      const line = raw.trim();

      // Commands also arrive from the quick chips and from clicking a listing,
      // and after either of those the caret belongs back on the prompt.
      inputRef.current?.focus();

      print([{ ...L.echo(line), key: prompt }]);
      setHistoryAt(-1);

      if (!line) return;

      const nextHistory =
        history[history.length - 1] === line ? history : [...history, line];
      setHistory(nextHistory);

      runLine(line, {
        cwd,
        setCwd: (next) => {
          previousCwd.current = cwd;
          setCwdState(next);
        },
        jumpBack: () => {
          const back = previousCwd.current;
          previousCwd.current = cwd;
          setCwdState(back);
        },
        print,
        clear: () => setScrollback([]),
        history: nextHistory,
        navigate,
        closeShell,
        themes,
        themeId: currentThemeId,
        setTheme,
      });
    },
    [
      closeShell,
      currentThemeId,
      cwd,
      history,
      navigate,
      print,
      prompt,
      setTheme,
      themes,
    ]
  );

  const submit = (event) => {
    event.preventDefault();
    execute(value);
    setValue("");
  };

  /* --- keys ---------------------------------------------------- */

  // Everything is stopped from bubbling: the landing page has its own global
  // handler for `/`, `j`, `k` and Escape, and it must not see keys typed in
  // here.
  const onKeyDown = (event) => {
    event.stopPropagation();

    if (event.ctrlKey && (event.key === "l" || event.key === "L")) {
      event.preventDefault();
      setScrollback([]);
      return;
    }

    if (event.ctrlKey && (event.key === "c" || event.key === "u")) {
      event.preventDefault();
      if (event.key === "c" && value) {
        print([{ ...L.echo(`${value}^C`), key: prompt }]);
      }
      setValue("");
      return;
    }

    // Tab completes, but only with something to complete — an empty prompt
    // leaves Tab alone so keyboard users can still reach the links and the
    // close button.
    if (event.key === "Tab" && value.trim()) {
      event.preventDefault();
      const { line, candidates } = complete(value, cwd);
      setValue(line);
      if (candidates.length > 1) {
        print([
          { ...L.echo(value), key: prompt },
          L.listing(candidates.map((name) => ({ name, type: "hint" }))),
        ]);
      }
      return;
    }

    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = historyAt < 0 ? history.length - 1 : Math.max(historyAt - 1, 0);
      setHistoryAt(next);
      setValue(history[next]);
      return;
    }

    if (event.key === "ArrowDown" && historyAt >= 0) {
      event.preventDefault();
      const next = historyAt + 1;
      if (next >= history.length) {
        setHistoryAt(-1);
        setValue("");
      } else {
        setHistoryAt(next);
        setValue(history[next]);
      }
    }
  };

  /* --- focus and scroll ---------------------------------------- */

  useEffect(() => {
    if (isOpen) {
      setRect(defaultRect());
      returnFocusRef.current = document.activeElement;
      inputRef.current?.focus();
    } else if (wasOpenRef.current) {
      const previous = returnFocusRef.current;
      const target = previous?.isConnected && previous !== document.body &&
        previous.getClientRects().length > 0 && !previous.closest('.tty')
        ? previous
        : document.querySelector('.nav-cli');
      target?.focus({ preventScroll: true });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const pane = scrollRef.current;
    if (pane && isOpen) pane.scrollTop = pane.scrollHeight;
  }, [scrollback, isOpen, rect]);

  /* --- moving and resizing ------------------------------------- */

  // Measured lazily so the first open picks up the real viewport rather than a
  // guess made during the first render.
  useEffect(() => {
    if (rect === null) setRect(defaultRect());
  }, [rect]);

  useEffect(() => {
    const onResize = () => setRect(defaultRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const startDrag = (mode) => (event) => {
    // The tab strip is both the drag surface and the home of the window
    // buttons, so a press that starts on a control is not a drag.
    if (mode === "move" && event.target.closest("button")) return;
    if (!rect) return;

    event.preventDefault();
    dragFrom.current = { mode, px: event.clientX, py: event.clientY, from: rect };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(mode);
  };

  const onDragMove = (event) => {
    const drag = dragFrom.current;
    if (!drag) return;

    const dx = event.clientX - drag.px;
    const dy = event.clientY - drag.py;

    setRect(
      drag.mode === "move"
        ? clampRect({ ...drag.from, x: drag.from.x + dx, y: drag.from.y + dy })
        : resizeRect(drag.from, drag.mode, dx, dy)
    );
  };

  const onDragEnd = (event) => {
    dragFrom.current = null;
    setDragging(null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  // Keyboard equivalents, because a drag surface alone is not an affordance
  // everyone can use: arrows move from the grip, resize from the corner.
  const onGripKey = (event) => {
    const step = event.shiftKey ? 64 : 16;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[
      event.key
    ];
    if (!delta) return;
    event.preventDefault();
    setRect((current) =>
      current
        ? clampRect({ ...current, x: current.x + delta[0], y: current.y + delta[1] })
        : current
    );
  };

  const onCornerKey = (event) => {
    const step = event.shiftKey ? 96 : 24;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[
      event.key
    ];
    if (!delta) return;
    event.preventDefault();
    setRect((current) =>
      current ? resizeRect(current, "se", delta[0], delta[1]) : current
    );
  };

  const maximised =
    rect !== null &&
    Math.abs(rect.w - (window.innerWidth - MARGIN * 2)) < 2 &&
    Math.abs(rect.h - (window.innerHeight - MARGIN * 2)) < 2;

  const toggleMaximise = () => {
    if (maximised) {
      setRect(clampRect(restoreTo ?? defaultRect()));
      return;
    }
    setRestoreTo(rect);
    setRect(fullRect());
  };

  // Clicking dead space in a terminal should put you back on the prompt — but
  // not if you were highlighting output to copy it.
  const refocus = (event) => {
    if (event.target.closest("button, a, input")) return;
    if (!window.getSelection()?.isCollapsed) return;
    inputRef.current?.focus();
  };

  return (
    <section
      className="tty"
      id="portfolio-cli"
      data-open={isOpen}
      data-dragging={dragging || undefined}
      style={
        rect === null
          ? undefined
          : {
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.w}px`,
              height: `${rect.h}px`,
            }
      }
      role="region"
      aria-label="Terminal — read-only shell over the CV"
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="tty__frame" onClick={refocus}>
        <header
          className="tty__bar"
          onPointerDown={startDrag("move")}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span
            className="tty__grip"
            role="button"
            tabIndex={0}
            aria-label="Move the terminal window — arrow keys"
            title="Drag to move · arrow keys"
            onKeyDown={onGripKey}
          />

          <div className="tty__tabs" role="tablist">
            <span className="tty__tab" role="tab" aria-selected="true">
              Terminal
            </span>
          </div>

          <span className="tty__meta">
            <strong>index-sh</strong> · {displayPath(cwd)} · read-only
          </span>

          <div className="tty__actions">
            <button
              type="button"
              className="tty__action"
              onClick={toggleMaximise}
              aria-pressed={maximised}
              title={maximised ? "Restore window size" : "Fill the viewport"}
            >
              <span aria-hidden="true">{maximised ? "◱" : "▣"}</span>
              <span className="sr-only">
                {maximised ? "Restore window size" : "Fill the viewport"}
              </span>
            </button>
            <button
              type="button"
              className="tty__action"
              onClick={closeShell}
              title="Close the terminal (esc)"
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Close the terminal</span>
            </button>
          </div>
        </header>

        <div className="tty__pane" ref={scrollRef}>
          <div className="tty__log" role="log" aria-live="polite">
            {scrollback.map((line) => (
              <Line
                key={line.id}
                line={line}
                onRun={execute}
                onNavigate={goto}
              />
            ))}
          </div>
        </div>

        <form className="tty__input" onSubmit={submit}>
          <span className="tty__prompt" aria-hidden="true">
            {prompt}
          </span>
          <div className="tty__field">
            <input
              id="tty-input"
              ref={inputRef}
              data-empty={!value ? "true" : undefined}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Command"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              aria-describedby="tty-hint"
            />
            {!value && <span className="tty__caret" aria-hidden="true" />}
          </div>
        </form>

        <footer className="tty__foot">
          <ul className="tty__quick">
            {QUICK.map((command) => (
              <li key={command}>
                <button type="button" onClick={() => execute(command)}>
                  {command}
                </button>
              </li>
            ))}
          </ul>
          <p className="tty__hint" id="tty-hint">
            <kbd>tab</kbd> complete · <kbd>↑</kbd> history · <kbd>ctrl-l</kbd>{" "}
            clear · <kbd>esc</kbd> close
          </p>
        </footer>
      </div>

      {HANDLES.map((dir) => (
        <span
          key={dir}
          className="tty__resize"
          data-dir={dir}
          onPointerDown={startDrag(dir)}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          {...(dir === "se"
            ? {
                role: "separator",
                tabIndex: 0,
                "aria-label": "Resize the terminal window — arrow keys",
                onKeyDown: onCornerKey,
              }
            : { "aria-hidden": "true" })}
        />
      ))}
    </section>
  );
};

export default Terminal;
