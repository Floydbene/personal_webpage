import { useEffect, useRef, useState } from "react";

/** One contents list: a persistent rail on desktop, a disclosure on small screens. */
export default function PostContents({ headings, articleRef, slug }) {
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setActiveId(null);
    let frame;
    const article = articleRef.current;
    const navbar = document.querySelector('nav[aria-label="Main navigation"]');
    const nodes = [...article.querySelectorAll(".post__h[id]")];
    const sync = () => {
      frame = null;
      const navHeight = navbar?.getBoundingClientRect().height || 72;
      article.style.setProperty("--post-nav-height", `${navHeight}px`);
      const mobile = window.matchMedia("(max-width: 63.99rem)").matches;
      const threshold = navHeight + (mobile ? 92 : 56);
      let current = null;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= threshold) current = node.id;
        else break;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (frame == null) frame = requestAnimationFrame(sync);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    if (navbar) observer.observe(navbar);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [articleRef, slug]);

  useEffect(() => {
    if (!open) return undefined;
    const dismiss = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const outside = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector('[aria-current="location"]');
    if (!current || !list.clientHeight) return;
    const listBounds = list.getBoundingClientRect();
    const bounds = current.getBoundingClientRect();
    if (bounds.top < listBounds.top) list.scrollTop -= listBounds.top - bounds.top;
    else if (bounds.bottom > listBounds.bottom) list.scrollTop += bounds.bottom - listBounds.bottom;
  }, [activeId, open]);

  const current = headings.find((heading) => heading.id === activeId);
  const jump = (id) => {
    setOpen(false);
    // Native anchors keep history; focus leaves the menu when it closes.
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };

  return (
    <nav className="post__contents" aria-label="In this article" ref={navRef} data-open={open}>
      <p className="post__contents-label ps-label">In this article</p>
      <button className="post__contents-toggle" type="button" ref={buttonRef}
        aria-expanded={open} aria-controls="article-contents" onClick={() => setOpen(!open)}>
        <span>Contents</span>
        <span className="post__contents-current">{current?.navLabel || current?.text || "Introduction"}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ol id="article-contents" className="post__contents-list" ref={listRef}>
        <li><a href="#article-start" aria-current={!activeId ? "location" : undefined} onClick={() => jump("article-start")}>
          <span className="post__contents-number" aria-hidden="true">—</span><span>Introduction</span>
        </a></li>
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} aria-current={activeId === heading.id ? "location" : undefined} onClick={() => jump(heading.id)}>
              <span className="post__contents-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{heading.navLabel || heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
