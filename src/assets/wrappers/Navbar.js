import styled from 'styled-components';

const Wrapper = styled.nav`
  background: color-mix(in srgb, var(--theme-navBackground) 86%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid color-mix(in srgb, var(--theme-border) 65%, transparent);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.4s ease, border-color 0.4s ease;

  .nav-center {
    width: var(--view-width);
    max-width: 1240px;
    margin: 0 auto;
    padding: 0.875rem 0;
  }

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Lowercase, mono, tight — reads as a shell prompt without shouting. */
  .logo {
    font-family: var(--font-mono);
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--theme-text);
    cursor: pointer;
    user-select: none;
    transition: color 0.3s ease;
  }

  .logo-dim {
    color: var(--theme-textMuted);
    transition: color 0.3s ease;
  }

  .logo:hover .logo-dim {
    color: var(--theme-primary);
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    color: var(--theme-text);
    font-size: 1.05rem;
    cursor: pointer;
    padding: 0.5rem;
    min-width: 44px;
    min-height: 44px;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    margin-left: auto;
  }

  .nav-cli {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    min-height: 44px;
    padding: 0.65rem 1rem;
    border: 1px solid var(--theme-primary);
    border-radius: 0.2rem;
    background: var(--theme-primary);
    color: var(--theme-background);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 180ms ease, color 180ms ease;
  }

  .nav-cli:hover,
  .nav-cli[aria-expanded="true"] {
    background: var(--theme-background);
    color: var(--theme-primary);
  }

  .nav-cli:focus-visible {
    outline: 2px solid var(--theme-text);
    outline-offset: 4px;
  }

  .nav-cli kbd { font: inherit; opacity: 0.7; }

  .nav-link {
    position: relative;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--theme-textMuted);
    padding: 0.5rem 0.6rem;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    transition: color 0.25s ease;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0.6rem;
    right: 0.6rem;
    bottom: 0.3rem;
    height: 1px;
    background: var(--theme-primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-link:hover {
    color: var(--theme-text);
  }

  .nav-link:hover::after {
    transform: scaleX(1);
  }

  .nav-link.active {
    color: var(--theme-text);
  }

  .nav-link.active::after {
    transform: scaleX(1);
  }

  .nav-divider {
    width: 1px;
    height: 1.1rem;
    margin: 0 0.5rem;
    background: color-mix(in srgb, var(--theme-border) 80%, transparent);
    flex: none;
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: none;
  }

  @media (min-width: 768px) {
    .nav-center {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
  }

  @media (max-width: 767px) {
    .nav-center {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 0.75rem;
      align-items: center;
    }

    .nav-top { gap: 0.5rem; }
    .nav-cli { grid-column: 2; grid-row: 1; padding-inline: 0.75rem; }
    .nav-cli kbd { display: none; }

    .hamburger {
      display: block;
    }

    .nav-links {
      grid-column: 1 / -1;
      grid-row: 2;
      display: none;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid color-mix(in srgb, var(--theme-border) 50%, transparent);
      gap: 0.25rem;
      width: 100%;

      &.show {
        display: flex;
      }
    }

    .nav-link {
      padding: 0.6rem 0;
      width: 100%;
    }

    .nav-link::after {
      left: 0;
      right: 0;
      bottom: 0.4rem;
    }

    /* Controls sit side by side on their own line on small screens. */
    .nav-divider {
      width: 100%;
      height: 1px;
      margin: 0.5rem 0;
    }

    .dots-btn {
      padding: 0.6rem 0;
    }
  }
`;

export default Wrapper;
