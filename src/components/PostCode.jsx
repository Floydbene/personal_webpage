import { useEffect, useRef, useState } from "react";

export default function PostCode({ block }) {
  const codeRef = useRef(null);
  const timerRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [copyState, setCopyState] = useState("Copy");

  useEffect(() => {
    const node = codeRef.current;
    let mounted = true;
    const check = () => {
      if (mounted) setOverflow(node.scrollWidth > node.clientWidth + 1);
    };
    const observer = new ResizeObserver(check);
    observer.observe(node);
    check();
    document.fonts?.ready.then(check);
    return () => {
      mounted = false;
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, [block.text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.text);
      setCopyState("Copied");
    } catch {
      setCopyState("Select text to copy");
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyState("Copy"), 2500);
  };

  return (
    <div className="post__code-example">
      <div className="post__code-toolbar">
        <span>{block.lang || "Code"}</span>
        {overflow && <span className="post__code-hint">Scroll sideways →</span>}
        <button type="button" onClick={copy} aria-label={`Copy ${block.lang || "code"} example`}>
          <span role="status">{copyState}</span>
        </button>
      </div>
      <pre className="post__code" ref={codeRef} tabIndex={0} aria-label={`${block.lang || "Code"} example${overflow ? "; scroll horizontally to read" : ""}`}>
        <code>{block.text}</code>
      </pre>
    </div>
  );
}
