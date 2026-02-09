import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "./CodeWindow.css";

const CodeWindow = () => {
  const { isDarkMode } = useTheme();
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const codeLines = [
    "import { TypeScript, Python } from './Languages';",
    "",
    "import { FullStack, ForwardDeployed } from './Roles/Engineer';",
    "",
    "import { React, Vite, Zustand, ShadCN } from './Frontend';",
    "",
    "import { Foundry, PySpark, AWS } from './Backend';",
    "",
    "import { Healthcare, Fashion, PublicTransport } from './Industries';",
    "",
    "export const Floyd = createEngineer({",
    "  experience: '2 years full stack development',",
    "  industries: [Healthcare, Fashion, PublicTransport],",
    "  languages: [TypeScript, Python],",
    "  frontend: [React, Vite, Zustand, ShadCN],",
    "  backend: [Foundry, PySpark, AWS],",
    "  builds: ['SaaS apps', 'Mobile apps', 'Websites'],",
    "  specialization: 'Scalable solutions with robust ecosystems',",
    "});",
  ];

  useEffect(() => {
    if (currentLineIndex < codeLines.length) {
      const currentLine = codeLines[currentLineIndex];

      if (currentCharIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (newLines[currentLineIndex]) {
              newLines[currentLineIndex] = {
                text:
                  newLines[currentLineIndex].text +
                  currentLine[currentCharIndex],
                complete: false,
              };
            } else {
              newLines[currentLineIndex] = {
                text: currentLine[currentCharIndex],
                complete: false,
              };
            }
            return newLines;
          });
          setCurrentCharIndex((prev) => prev + 1);
        }, 30); // typing speed

        return () => clearTimeout(timeout);
      } else {
        // Mark line as complete and move to next line after a brief pause
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (newLines[currentLineIndex]) {
              newLines[currentLineIndex].complete = true;
            }
            return newLines;
          });
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 100);

        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, codeLines]);

  return (
    <div
      className={`code-window-container ${isDarkMode ? "dark" : "light"} fade-in`}
    >
      <div className="code-window-wrapper">
        <div className="about-section">
          <h2 className="about-heading">About Me</h2>
          <p className="about-text">
            I'm a Full Stack Web Developer with 2 years of experience building
            impactful solutions across healthcare, fashion, and public transport
            startups. I specialize in{" "}
            <span className="tech-green">TypeScript</span> and{" "}
            <span className="tech-green">Python</span>, leveraging their vast
            and robust ecosystems for server-side development.
          </p>
          <p className="about-text">
            I craft modern frontend applications using{" "}
            <span className="tech-blue">React</span>,{" "}
            <span className="tech-blue">Vite</span>,{" "}
            <span className="tech-blue">Zustand</span>, and{" "}
            <span className="tech-blue">ShadCN</span>, while building resilient
            backends with <span className="tech-red">Foundry</span>,{" "}
            <span className="tech-red">PySpark</span>, and{" "}
            <span className="tech-red">AWS</span>. From SaaS platforms to mobile
            apps and websites, I bring ideas to life with scalable,
            production-ready code.
          </p>
        </div>

        <div className="code-window-section">
          <div className="code-window">
            <div className="window-header">
              <div className="window-controls">
                <div className="control-button close"></div>
                <div className="control-button minimize"></div>
                <div className="control-button maximize"></div>
              </div>
              <div className="window-title">Floyd.js</div>
              <div className="window-spacer"></div>
            </div>
            <div className="window-content">
              <div className="line-numbers">
                {displayedLines.map((_, index) => (
                  <div key={index} className="line-number">
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="code-lines">
                {displayedLines.map((line, index) => {
                  if (!line)
                    return <div key={index} className="code-line"></div>;

                  return (
                    <div key={index} className="code-line">
                      {line.complete ? (
                        renderSyntaxHighlight(line.text)
                      ) : (
                        <span>{line.text}</span>
                      )}
                      {index === currentLineIndex &&
                        currentCharIndex <
                          codeLines[currentLineIndex]?.length && (
                          <span className="cursor-blink">|</span>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Syntax highlighting function that returns React elements
const renderSyntaxHighlight = (line) => {
  if (!line) return null;

  const tokens = [];
  let currentIndex = 0;

  // Pattern to match keywords, strings, functions, properties
  const patterns = [
    {
      regex:
        /\b(import|from|export|const|let|var|function|return|if|else|for|while)\b/g,
      className: "keyword",
    },
    { regex: /('[^']*'|"[^"]*")/g, className: "string" },
    { regex: /(\w+)(?=\()/g, className: "function" },
    { regex: /(\w+)(?=:)/g, className: "property" },
  ];

  // Find all matches
  const matches = [];
  patterns.forEach(({ regex, className }) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className,
      });
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const filteredMatches = [];
  let lastEnd = -1;
  matches.forEach((match) => {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  });

  // Build the result with matched and unmatched parts
  filteredMatches.forEach((match, idx) => {
    // Add text before this match
    if (match.start > currentIndex) {
      tokens.push(
        <span key={`text-${idx}`}>
          {line.substring(currentIndex, match.start)}
        </span>,
      );
    }
    // Add the matched text with styling
    tokens.push(
      <span key={`match-${idx}`} className={match.className}>
        {match.text}
      </span>,
    );
    currentIndex = match.end;
  });

  // Add any remaining text
  if (currentIndex < line.length) {
    tokens.push(<span key="text-end">{line.substring(currentIndex)}</span>);
  }

  return <>{tokens}</>;
};

export default CodeWindow;
