import styled from 'styled-components';

const Wrapper = styled.nav`
  background: var(--theme-navBackground);
  transition: 0.3s linear;

  .nav-center {
    width: var(--view-width);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1.5rem 2rem;
  }

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: clamp(1.5rem, 3vw, 3rem);
    color: var(--theme-text);
    font-weight: 100;
    letter-spacing: 2px;
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
    gap: 0.5rem;
    margin-top: 1rem;
    align-items: center;
  }

  .nav-link {
    text-transform: lowercase;
    color: var(--theme-text);
    padding: 0.5rem 0.5rem 0.5rem 0;
    transition: var(--transition);
    letter-spacing: 2px;
  }

  .nav-link:hover {
    color: var(--theme-accent);
  }

  .active {
    color: var(--theme-accent);
  }

  .dots-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: var(--transition);
    display: flex;
    align-items: center;

    &:hover {
      color: var(--theme-accent);
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
    }

    .dots-btn {
      padding: 0.6rem 0;
    }
  }
`;

export default Wrapper;
