import React, { useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { posts, postSections } from "../Data";
import { nextPost } from "../content/posts";
import PostAside from "../components/PostAside";
import PostContents from "../components/PostContents";
import PostCode from "../components/PostCode";
import "../components/posts.css";

const Inline = ({ text }) =>
  Array.isArray(text)
    ? text.map((part, index) => {
        if (typeof part === "string") return part;
        if (part.kind === "code") return <code key={index}>{part.text}</code>;
        if (part.kind === "strong") return <strong key={index}>{part.text}</strong>;
        return <a key={index} href={part.href} download={part.download || undefined}>{part.text}</a>;
      })
    : text;

const Block = ({ block, number, figureNumber }) => {
  switch (block.kind) {
    case "equation":
      return (
        <div className="post__equation" role="region" aria-label={block.text} tabIndex={0}>
          {/* MathML is authored in the local post content, never supplied by visitors. */}
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label={block.text} dangerouslySetInnerHTML={{ __html: block.mathml }} />
        </div>
      );
    case "lede":
      return <p className="post__lede"><Inline text={block.text} /></p>;
    case "h":
      return (
        <h2 className="post__h" id={block.id} tabIndex={-1}>
          <a href={`#${block.id}`}>
            <span className="post__section-number">{String(number).padStart(2, "0")}</span>
            {block.text}
          </a>
        </h2>
      );
    case "figure":
      return (
        <figure className="post__figure">
          <a className="post__figure-image" href={block.src} target="_blank" rel="noreferrer" aria-label={`Open full-size figure: ${block.alt} (opens in a new tab)`}>
            <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" />
          </a>
          <figcaption><span className="post__figure-number">Figure {figureNumber}</span><Inline text={block.caption} /> <a href={block.src} target="_blank" rel="noreferrer">View full size <span className="sr-only">(opens in a new tab)</span>↗</a></figcaption>
        </figure>
      );
    case "table":
      return (
        <div className="post__table-scroll" role="region" aria-label={block.caption} tabIndex={0}>
          <table className="post__table">
            <caption>{block.caption}</caption>
            <thead><tr>{block.headers.map((cell, i) => <th key={i} scope="col"><Inline text={cell} /></th>)}</tr></thead>
            <tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0
              ? <th key={j} scope="row"><Inline text={cell} /></th>
              : <td key={j}><Inline text={cell} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "list":
      return (
        <ul className="post__list">
          {block.items.map((item, index) => (
            <li key={index}><Inline text={item} /></li>
          ))}
        </ul>
      );
    case "code":
      return <PostCode block={block} />;
    case "note":
      return <PostAside block={block}><Inline text={block.text} /></PostAside>;
    default:
      return <p className="post__p"><Inline text={block.text} /></p>;
  }
};

const Post = () => {
  const { slug } = useParams();
  const { hash } = useLocation();
  const articleRef = useRef(null);
  const frameRef = useRef(null);

  const post = posts.find((entry) => entry.slug === slug);
  const section = postSections.find((item) => item.id === post?.section);
  const headings = post?.body.filter((block) => block.kind === "h") || [];
  const postIndex = posts.findIndex((entry) => entry.slug === slug);
  const previous = posts[postIndex - 1];
  const related = postIndex < posts.length - 1 ? nextPost(slug, posts) : null;

  // Pair optional context with the paragraph it annotates. The same source
  // order becomes a margin note on wide screens and a disclosure below it.
  const readingBlocks = [];
  let figureNumber = 0;
  post?.body.forEach((block, index) => {
    if (block.kind === "figure") figureNumber += 1;
    const element = <Block block={block} number={headings.indexOf(block) + 1} figureNumber={figureNumber} key={index} />;
    const preceding = post.body[index - 1];
    if (block.kind === "note" && ["note", "tip"].includes(block.type) && block.disclosure && preceding && ["p", "lede"].includes(preceding.kind)) {
      const paragraph = readingBlocks.pop();
      readingBlocks.push(<div className="post__annotated" key={`note-${index}`}>{paragraph}{element}</div>);
    } else readingBlocks.push(element);
  });

  useEffect(() => {
    if (!post) return undefined;
    const previousTitle = document.title;
    const title = `${post.title} — Floyd Benedikter`;
    const loadedArticle = previousTitle === title;
    document.title = title;
    const values = {
      'name:description': post.summary,
      'property:og:type': 'article',
      'property:og:title': title,
      'property:og:description': post.summary,
      'name:twitter:card': 'summary',
      'name:twitter:title': title,
      'name:twitter:description': post.summary,
    };
    const restore = Object.entries(values).map(([key, value]) => {
      const divider = key.indexOf(':');
      const attribute = key.slice(0, divider);
      const name = key.slice(divider + 1);
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
      const existing = tag;
      const previous = tag?.getAttribute('content');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
      return () => {
        if (loadedArticle && name === 'description') {
          tag.setAttribute('content', 'Forward deployed software engineer. An index of work, builds and writing — Princeton to Miami to London to New Jersey.');
        } else if (loadedArticle || !existing) {
          tag.remove();
        } else {
          tag.setAttribute('content', previous || '');
        }
      };
    });
    return () => {
      document.title = loadedArticle ? 'Floyd Benedikter — Forward Deployed Software Engineer' : previousTitle;
      restore.forEach((reset) => reset());
    };
  }, [post]);

  useEffect(() => {
    if (!hash) return undefined;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [slug, hash]);

  // Progress across the article itself, not the whole document, so the rule
  // reads full exactly when the prose ends rather than at the footer.
  useEffect(() => {
    if (!post || post.status === "draft") return undefined;

    const sync = () => {
      frameRef.current = null;
      const node = articleRef.current;
      if (!node) return;

      const travel = node.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - node.offsetTop;
      const progress =
        travel <= 0 ? 1 : Math.min(Math.max(scrolled / travel, 0), 1);

      node.style.setProperty("--read", progress.toFixed(4));
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [post]);

  if (!post) {
    return (
      <div className="post">
        <p className="ps-empty">
          No post filed under “{slug}”.{" "}
          <Link className="ps-inline-link" to="/posts">
            Back to the posts index
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <article className="post" ref={articleRef}>
      {post.status !== "draft" && <div className="post__progress" aria-hidden="true" />}

      <header className="post__head" id="article-start" tabIndex={-1}>
        <Link className="post__back" to="/posts">
          ← Posts
        </Link>

        <p className="ps-label">
          {section?.label} — {post.ref}
        </p>

        <h1 className="post__title">{post.title}</h1>
        <p className="post__standfirst">{post.summary}</p>

        <dl className="post__meta">
          <div>
            <dt>Level</dt>
            <dd>{post.level}</dd>
          </div>
          <div>
            <dt>{post.status === "draft" ? "Status" : "Read"}</dt>
            <dd>{post.status === "draft" ? "In progress" : `${post.minutes} min`}</dd>
          </div>
          <div>
            <dt>Filed</dt>
            <dd>{post.span}</dd>
          </div>
          {post.status === "review" && <div><dt>Status</dt><dd>{post.draftVersion ? `Draft ${post.draftVersion}` : "Working draft"}</dd></div>}
        </dl>
      </header>

      <div className="post__reader">
      {post.status !== "draft" && headings.length > 0 && <PostContents headings={headings} articleRef={articleRef} slug={slug} />}
      <div className="post__body">
        {post.learningGoals?.length > 0 && <section className="post__brief" aria-label="Before you read">
          <h2 className="ps-label">What you’ll learn</h2>
          <ul>{post.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
          {post.prerequisites && <p><strong>Before you start</strong> {post.prerequisites}</p>}
        </section>}
        {post.status === "draft" ? (
          <section className="post__draft">
            <h2 className="post__h">On the workbench.</h2>
          <p className="post__p">This post is still being written. In the meantime, explore the projects and research that inform these notes.</p>
            <Link className="ps-inline-link" to="/?section=build">Explore the projects →</Link>
          </section>
        ) : readingBlocks}
      </div>
      </div>

      {(previous || related) && <nav className="post__related" aria-label="More in this series">
        {previous && <Link to={`/posts/${previous.slug}`}><span className="ps-label">← Previous · {previous.ref}</span><span>{previous.title}</span></Link>}
        {related && <Link to={`/posts/${related.slug}`}><span className="ps-label">Next · {related.ref} →</span><span>{related.title}</span></Link>}
      </nav>}

      <footer className="post__foot">
        {post.tags?.length > 0 && (
          <ul className="post__tags">
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <Link className="ps-inline-link" to="/posts">
          All posts →
        </Link>
      </footer>
    </article>
  );
};

export default Post;
