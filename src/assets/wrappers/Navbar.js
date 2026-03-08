import styled from 'styled-components';

const Wrapper = styled.nav`
  background: color-mix(in srgb, var(--theme-navBackground) 80%, transparent);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  border-bottom: 1px solid color-mix(in srgb, var(--theme-border) 40%, transparent);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.4s ease;

  .nav-center {
    width: var(--view-width);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1.25rem 2rem;
  }

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-family: var(--font-heading);
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    color: var(--theme-text);
    font-weight: 600;
    letter-spacing: -0.02em;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .logo:hover {
    color: var(--theme-accent);
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    color: var(--theme-text);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    margin-top: 1rem;
    align-items: center;
  }

  .nav-link {
    text-transform: lowercase;
    color: var(--theme-textSecondary);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .nav-link:hover {
    color: var(--theme-text);
    background: color-mix(in srgb, var(--theme-accent) 8%, transparent);
  }

  .active {
    color: var(--theme-accent);
    background: color-mix(in srgb, var(--theme-accent) 10%, transparent);
  }

  .dots-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;

    &:hover {
      color: var(--theme-accent);
      background: color-mix(in srgb, var(--theme-accent) 8%, transparent);
    }
  }

  @media (min-width: 768px) {
    .nav-center {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .nav-links {
      margin-top: 0;
    }
  }

  @media (max-width: 767px) {
    .hamburger {
      display: block;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 1rem;
      gap: 0;

      &.show {
        display: flex;
      }
    }

    .nav-link {
      padding: 0.6rem 0;
      width: 100%;
      border-radius: 0;
    }

    .dots-btn {
      padding: 0.6rem 0;
      border-radius: 0;
    }
  }
`;

export default Wrapper;
