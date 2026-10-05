import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { posts, postSections } from "../Data";
import "../components/posts.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Posts = () => {
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(
    postSections[0]?.id || null
  );

  const sections = useMemo(
    () =>
      postSections
        .map((section) => ({
          ...section,
          entries: posts.filter((post) => post.section === section.id),
        }))
        .filter((section) => section.entries.length > 0),
    []
  );

  const jumpTo = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="posts">
      <aside className="ps-rail">
        <header className="ps-masthead">
          <p className="ps-label ps-enter" style={{ "--i": 0 }}>
            Teaching notes
          </p>
          <h1 className="ps-wordmark ps-enter" style={{ "--i": 1 }}>
            Posts
          </h1>
          <p className="ps-lede ps-enter" style={{ "--i": 2 }}>
            Ideas worked through in code, explained in plain language.
            Start at the beginning or return to a topic.
          </p>
        </header>

        {sections.length > 1 && <nav
          className="ps-sections ps-enter"
          aria-label="Post sections"
          style={{ "--i": 3 }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="ps-section-link"
              aria-current={activeSection === section.id ? "true" : undefined}
              onClick={() => jumpTo(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>}
      </aside>

      <main className="ps-main">
        {sections.length === 0 ? (
          <p className="ps-empty">No posts filed yet. Check back.</p>
        ) : (
          sections.map((section) => (
            <section
              className="ps-section"
              id={`posts-${section.id}`}
              key={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
            >
              <div className="ps-section__head">
                <h2 className="ps-section__title">{section.label}</h2>
                <span className="ps-section__note">
                  {section.note} — {section.entries.length}
                </span>
              </div>
              <p className="ps-section__intro">Worked examples with companion notebooks. Follow the numbers or choose a subject.</p>

              <ol className="ps-rows">
                {section.entries.map((post) => (
                  <li className="ps-row" key={post.slug}>
                    <Link
                      className="ps-row__link"
                      to={`/posts/${post.slug}`}
                    >
                      <span className="ps-row__ref">{post.ref}</span>
                      <span className="ps-row__body">
                        <span className="ps-row__title">{post.title}</span>
                        <span className="ps-row__summary">
                          {post.summary}
                        </span>
                        <span className="ps-row__level">{post.level}{post.status === "review" ? " · Working draft" : ""}</span>
                      </span>
                      <span className="ps-row__meta">{post.status === "draft" ? "In progress" : `${post.minutes} min`}</span>
                      <span className="ps-row__caret" aria-hidden="true">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default Posts;
