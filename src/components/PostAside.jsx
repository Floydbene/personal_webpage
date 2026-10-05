import React, { useEffect, useState } from "react";
import { GiOwl, GiBee, GiHedgehog, GiFoxHead, GiTortoise } from "react-icons/gi";
import { asideTypes } from "../content/postAsides";

const animals = { note: GiOwl, tip: GiBee, danger: GiHedgehog, misconception: GiFoxHead, recap: GiTortoise };

export const AsideAnimal = ({ type }) => {
  const Icon = animals[type] || GiOwl;
  return <Icon aria-hidden="true" focusable="false" />;
};

export default function PostAside({ block, children }) {
  const type = asideTypes[block.type] ? block.type : "note";
  const category = asideTypes[type];
  const optional = block.disclosure === true && ["note", "tip"].includes(type);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!optional) return undefined;
    const query = window.matchMedia("(min-width: 90rem)");
    const sync = () => setOpen(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [optional]);

  const heading = <>
    <span className="post__note-animal"><AsideAnimal type={type} /></span>
    <span className="post__note-heading">
      <span className="post__note-label">{category.label}</span>
      {block.title && <span className="post__note-title">{block.title}</span>}
    </span>
  </>;

  if (optional) return (
    <aside className="post__note post__note--optional" data-aside={type} aria-label={block.title || category.label}>
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary className="post__note-head">
          {heading}<span className="post__note-expand" aria-hidden="true">{open ? "−" : "+"}</span>
        </summary>
        <p className="post__note-text">{children}</p>
      </details>
    </aside>
  );

  return (
    <aside className="post__note" data-aside={type} aria-label={block.title ? `${category.label}: ${block.title}` : category.label}>
      <div className="post__note-head">{heading}</div>
      <p className="post__note-text">{children}</p>
    </aside>
  );
}
