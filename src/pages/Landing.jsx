import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { siteIndex, indexGroups, profile } from "../Data";
import { useTheme } from "../context/ThemeContext";
import { themes } from "../themes/themeConfig";
import Masthead from "../components/Masthead";
import useLandingEntrance from "../components/useLandingEntrance";
import IndexRow from "../components/IndexRow";
import "../components/landing.css";


const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Landing = () => {
  const [searchParams] = useSearchParams();
  const { currentThemeId, compact } = useTheme();

  const siteRef = useRef(null);
  useLandingEntrance(siteRef, searchParams);
  const railRef = useRef(null);
  const railOffsetRef = useRef(0);
  const rowRefs = useRef({});
  const groupRefs = useRef({});
  const pendingGroupRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const scrolledStateRef = useRef(false);
  const copiedTimer = useRef(null);

  const [filter, setFilter] = useState("all");
  const [activeGroup, setActiveGroup] = useState(indexGroups[0]?.id || "work");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasPassedIntro, setHasPassedIntro] = useState(false);
  const [openRef, setOpenRef] = useState(null);
  const [cursor, setCursor] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  // Set by ?entry= / ?section=, cleared once the target is actually on screen.
  const [scrollTarget, setScrollTarget] = useState(null);

  const visible = useMemo(
    () =>
      filter === "all"
        ? siteIndex
        : siteIndex.filter((entry) => entry.group === filter),
    [filter]
  );

  const flatPosition = useMemo(() => {
    const map = {};
    visible.forEach((entry, i) => {
      map[entry.ref] = i;
    });
    return map;
  }, [visible]);

  const grouped = useMemo(
    () =>
      indexGroups
        .map((group) => ({
          ...group,
          entries: visible.filter((entry) => entry.group === group.id),
        }))
        .filter((group) => group.entries.length > 0),
    [visible]
  );

  // Compact is the dense base; with it off every row sits open and static.
  const roomy = !compact;

  const toggle = useCallback((ref) => {
    setOpenRef((current) => (current === ref ? null : ref));
  }, []);

  const move = useCallback(
    (delta) => {
      setCursor((current) => {
        if (!visible.length) return -1;
        const from = current < 0 ? (delta > 0 ? -1 : 0) : current;
        return Math.min(Math.max(from + delta, 0), visible.length - 1);
      });
    },
    [visible.length]
  );

  // Filter changes invalidate the cursor position.
  useEffect(() => {
    setCursor(-1);
    if (filter !== "all") setActiveGroup(filter);
  }, [filter]);

  /**
   * `?entry=06` and `?section=build` are how the shell hands a file back to the
   * page — `open trini` closes the terminal and lands you on that row with it
   * already expanded. They double as shareable deep links.
   */
  useEffect(() => {
    const entry = searchParams.get("entry");
    const section = searchParams.get("section");

    if (entry) {
      const match = siteIndex.find((item) => item.ref === entry);
      if (match) {
        setFilter("all");
        setOpenRef(match.ref);
        setActiveGroup(match.group);
        setScrollTarget({ kind: "row", id: match.ref });
        return;
      }
    }

    if (section && indexGroups.some((group) => group.id === section)) {
      setFilter("all");
      setActiveGroup(section);
      setScrollTarget({ kind: "group", id: section });
    }
  }, [searchParams]);

  // Waits for the filter to actually be "all" so the target has been rendered.
  useEffect(() => {
    if (!scrollTarget || filter !== "all") return;

    const node =
      scrollTarget.kind === "row"
        ? rowRefs.current[scrollTarget.id]
        : groupRefs.current[scrollTarget.id];

    if (!node) return;

    node.scrollIntoView({
      block: scrollTarget.kind === "row" ? "center" : "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    setScrollTarget(null);
  }, [scrollTarget, filter, grouped]);

  useEffect(() => {
    const syncScrollState = () => {
      scrollFrameRef.current = null;
      const progress = Math.min(Math.max(window.scrollY / 220, 0), 1);
      const nextScrolled = progress > 0.35;
      const workTop = groupRefs.current.work?.getBoundingClientRect().top;
      setHasPassedIntro(workTop !== undefined && workTop < window.innerHeight);
      const rail = railRef.current;
      if (rail && workTop !== undefined) {
        const baseTop = rail.getBoundingClientRect().top - railOffsetRef.current;
        const offset = window.innerWidth >= 1024 ? Math.max(0, workTop - baseTop) : 0;
        railOffsetRef.current = offset;
        rail.style.setProperty("--rail-offset", `${offset}px`);
      }
      const site = siteRef.current;

      if (site) {
        site.style.setProperty(
          "--masthead-scale",
          (1 - progress * 0.34).toFixed(3)
        );
        site.style.setProperty(
          "--masthead-y",
          `${(-0.18 * progress).toFixed(3)}rem`
        );
        site.style.setProperty("--lede-y", `${(-0.38 * progress).toFixed(3)}rem`);
        site.style.setProperty(
          "--lede-opacity",
          (1 - progress * 0.28).toFixed(3)
        );
      }

      if (scrolledStateRef.current !== nextScrolled) {
        scrolledStateRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    const onScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = requestAnimationFrame(syncScrollState);
    };

    syncScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const sections = indexGroups
      .map((group) => groupRefs.current[group.id])
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const nearest = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          )[0];

        if (nearest?.target.dataset.group) {
          setActiveGroup(nearest.target.dataset.group);
        }
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [grouped]);

  useEffect(() => {
    if (filter !== "all" || !pendingGroupRef.current) return;

    const groupId = pendingGroupRef.current;
    pendingGroupRef.current = null;
    requestAnimationFrame(() => {
      groupRefs.current[groupId]?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  }, [filter, grouped]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Keep the keyboard cursor on screen without yanking the page around.
  useEffect(() => {
    if (cursor < 0) return;
    const entry = visible[cursor];
    if (!entry) return;
    rowRefs.current[entry.ref]?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [cursor, visible]);

  // Global keys. Arrows only take over once the cursor is already engaged,
  // so normal scrolling is never hijacked from someone who never opted in.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.target.closest?.(".tty, .settings")) return;
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "Escape") {
        if (typing) target.blur();
        else setOpenRef(null);
        return;
      }

      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "j" || (event.key === "ArrowDown" && cursor >= 0)) {
        event.preventDefault();
        move(1);
        return;
      }

      if (event.key === "k" || (event.key === "ArrowUp" && cursor >= 0)) {
        event.preventDefault();
        move(-1);
        return;
      }

      // Enter is left alone when a button or link already has focus — the
      // browser fires its click, and handling it here too would toggle twice
      // and cancel itself out.
      if (
        event.key === "Enter" &&
        cursor >= 0 &&
        visible[cursor] &&
        !target.closest?.("button, a, [role='button']")
      ) {
        event.preventDefault();
        toggle(visible[cursor].ref);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cursor, move, toggle, visible]);

  // Without the log line to write into, the button is the only place left to
  // confirm the copy happened.
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyFailed(false);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFailed(true);
    }
  };

  const jumpToGroup = (groupId) => {
    setActiveGroup(groupId);

    if (filter !== "all") {
      pendingGroupRef.current = groupId;
      setFilter("all");
      return;
    }

    groupRefs.current[groupId]?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const railLinks = indexGroups.map((group) => (
    <button
      key={group.id}
      type="button"
      className="si-filter"
      aria-current={(filter === "all" ? activeGroup === group.id : filter === group.id) ? "true" : undefined}
      onClick={() => jumpToGroup(group.id)}
    >
      {group.label}
    </button>
  ));

  return (
    <div
      className="site-index"
      data-scrolled={isScrolled}
      data-past-intro={hasPassedIntro}
      ref={siteRef}
    >
      <aside className="si-sidebar">
        <Masthead />

        <nav
          ref={railRef}
          className="si-filters"
          aria-label="Index"
        >
          {railLinks}
        </nav>
      </aside>

      <main className="si-main">
        <section className="si-intro">
          <p className="si-intro__label">Selected work · 2019—2026</p>
          <p>
            I started at Princeton in 2019 as an avid rower, with a strong
            interest in chemistry and molecular biology. I planned to study
            Chemical and Biological Engineering. When COVID-19 moved lectures
            online and suspended in-person labs, much of what had drawn me
            to that path disappeared.
          </p>
          <p>
            Around the same time, I took my first class in data structures
            and algorithms. I was surprised by how much I could build with
            a basic understanding of programming. I switched to Computer
            Science and focused my studies on statistics and machine learning,
            as my interest in those fields and natural language processing grew.
          </p>
          <p>
            Since graduating, I’ve worked in fast-paced startups, learning
            what it takes to build and run high-quality software and models
            in production. My experience as a Forward Deployed Engineer has
            convinced me that working closely with the people who use software
            will shape the future of how we build it. I’m also interested in
            creating educational content, and I’ve started sharing what I learn
            through the posts on this site.
          </p>
          <div className="si-index-help">
            <span>{compact ? "Choose a row to take a closer look." : "The full picture, at your own pace."}</span>
            {compact && <span className="si-key-help"><kbd>j</kbd> <kbd>k</kbd> move · <kbd>↵</kbd> open</span>}
          </div>
        </section>

        <nav className="si-filters si-filters--inline" aria-label="Index">
          {railLinks}
        </nav>

        {grouped.length === 0 ? (
          <p className="si-empty">
            Nothing under that filter. Pick another above.
          </p>
        ) : (
          grouped.map((group) => (
            <section
              className="si-group"
              id={`index-${group.id}`}
              data-group={group.id}
              key={group.id}
              ref={(el) => {
                groupRefs.current[group.id] = el;
              }}
            >
              <div className="si-group__head">
                <h2 className="si-group__title">{group.label}</h2>
                <span className="si-group__note">
                  {group.note} — {group.entries.length}
                </span>
              </div>

              <ul className="si-rows">
                {group.entries.map((entry) => (
                  <IndexRow
                    key={entry.ref}
                    entry={entry}
                    isOpen={roomy || openRef === entry.ref}
                    isCursor={cursor === flatPosition[entry.ref]}
                    isStatic={roomy}
                    onToggle={roomy ? undefined : () => toggle(entry.ref)}
                    rowRef={(el) => {
                      rowRefs.current[entry.ref] = el;
                    }}
                  />
                ))}
              </ul>
            </section>
          ))
        )}

        <footer className="si-footer">
          <div className="si-footer__row">
            <p className="si-footer__mark">Floyd Benedikter</p>
            <button
              type="button"
              className="si-contact"
              onClick={copyEmail}
              data-copied={copied}
            >
              {copied ? "Email copied" : "Copy email"}
            </button>
            <a className="si-contact" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a
              className="si-contact"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="si-contact"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
          <p className="si-copy-status" role="status">
            {copyFailed ? "Copy unavailable — use the email link, or select the address." : copied ? "Email address copied to clipboard." : ""}
          </p>
          <p className="si-footer__fine">
            {themes[currentThemeId].name} · {compact ? "compact" : "roomy"}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
