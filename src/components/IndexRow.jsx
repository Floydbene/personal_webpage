import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const IndexRow = ({
  entry,
  isOpen,
  isCursor,
  isStatic = false,
  onToggle,
  rowRef,
}) => {
  const detailId = `si-detail-${entry.ref}`;
  const visual = entry.image
    ? {
        src: entry.image,
        alt: entry.imageAlt || `${entry.name} project preview`,
        kind: "image",
      }
    : null;
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const previewRef = useRef(null);
  const expandedMediaRef = useRef(null);
  const restoreMediaFocus = useRef(false);
  const largeImage = entry.image ? visual : null;

  useEffect(() => {
    setIsMediaExpanded(false);
  }, [isStatic]);

  useEffect(() => {
    if (!restoreMediaFocus.current) return;
    restoreMediaFocus.current = false;
    const target = isMediaExpanded ? expandedMediaRef : previewRef;
    target.current?.focus({ preventScroll: true });
  }, [isMediaExpanded]);

  useEffect(() => {
    if (!isOpen) setIsMediaExpanded(false);
  }, [isOpen]);

  const toggleMedia = (event) => {
    event.stopPropagation();
    restoreMediaFocus.current = true;
    if (!isOpen && onToggle) onToggle();
    setIsMediaExpanded((current) => !current);
  };

  return (
    <li
      className="si-row"
      data-open={isOpen}
      data-cursor={isCursor}
      data-group={entry.group}
      data-media-expanded={isMediaExpanded}
      data-preview={Boolean(entry.image) || entry.group === "build"}
      ref={rowRef}
    >
      <div className="si-row__summary">
        {!isStatic && (
          <button
            type="button"
            className="si-row__toggle"
            aria-expanded={isOpen}
            aria-controls={detailId}
            onClick={onToggle}
          >
            <span className="sr-only">{entry.name} — {entry.role}, {entry.span}</span>
          </button>
        )}
        <span className="si-row__ref">{entry.ref}</span>

        {entry.image && (
          <button
            type="button"
            className="si-row__preview"
            ref={previewRef}
            aria-controls={detailId}
            aria-expanded={isMediaExpanded}
            aria-label={`${isMediaExpanded ? "Collapse" : "Expand"} image for ${
              entry.name
            }`}
            onClick={toggleMedia}
          >
            <img
              src={entry.image}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        )}
        {!entry.image && entry.group === "build" && (
          <span
            className="si-row__preview si-row__preview--empty"
            aria-hidden="true"
          />
        )}

        <span className="si-row__name">
          {entry.logo && (
            <img
              className="si-row__logo"
              src={entry.logo}
              alt=""
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="si-row__nameText">{entry.name}</span>
          {entry.current && (
            <span className="si-row__live" title="Current" aria-label="Current" />
          )}
        </span>

        <span className="si-row__role">{entry.role}</span>
        <span className="si-row__span">{entry.span}</span>
        <span className="si-row__caret" aria-hidden="true">
          ›
        </span>
      </div>

      {/* Stays mounted so the expand can animate, but hidden from assistive
          tech and taken out of the tab order while collapsed. */}
      <div
        className="si-row__detail"
        id={detailId}
        role="region"
        aria-label={`${entry.name} detail`}
        aria-hidden={!isOpen}
      >
        <div className="si-row__detailInner">
          <div className="si-row__detailBody">
            <div className="si-row__content">
              {largeImage && (
                <button
                  type="button"
                  className="si-row__projectMedia"
                  ref={expandedMediaRef}
                  aria-label={`Collapse image for ${entry.name}`}
                  aria-hidden={!isMediaExpanded}
                  tabIndex={isOpen && isMediaExpanded ? 0 : -1}
                  onClick={toggleMedia}
                  style={
                    entry.imageAspect
                      ? { "--media-aspect": entry.imageAspect }
                      : undefined
                  }
                >
                  <img
                    src={largeImage.src}
                    alt={largeImage.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              )}

              <p className="si-row__prose">{entry.body}</p>

              {entry.links?.length > 0 && (
                <div className="si-row__links">
                  {entry.links.map((link) =>
                    link.internal ? (
                      <Link
                        key={link.href}
                        className="si-link"
                        data-internal="true"
                        to={link.href}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        className="si-link"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="si-row__aside">
              {visual ? (
                <figure
                  className="si-row__media"
                  data-kind={visual.kind}
                  style={
                    entry.imageAspect
                      ? { "--media-aspect": entry.imageAspect }
                      : undefined
                  }
                >
                  <img
                    key={`${entry.ref}-${visual.src}`}
                    src={visual.src}
                    alt={visual.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  {entry.imageCaption && (
                    <figcaption>{entry.imageCaption}</figcaption>
                  )}
                </figure>
              ) : null}

              {entry.tags?.length > 0 && (
                <ul className="si-row__tags">
                  {entry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}

              <span className="si-label">{entry.place}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default IndexRow;
