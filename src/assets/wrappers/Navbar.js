import styled from 'styled-components';

const Wrapper = styled.nav`
  background: var(--background);
  transition: 0.3s linear;
  .nav-center {
    width: var(--view-width);
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
  }
  .logo {
    font-size: clamp(1.5rem, 3vw, 3rem);
    color: var(--prim);
    font-weight: 100;
    letter-spacing: 2px;
  }
  .nav-links {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .nav-link {
    text-transform: lowercase;
    color: white;
    padding: 0.5rem 0.5rem 0.5rem 0;
    transition: var(--transition);
    letter-spacing: 2px;
  }
  .nav-link:hover {
    color: var(--prim);
  }
  .active {
    color: var(--prim);
  }
  @media (min-width: 768px) {
    .nav-center {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .nav-links {
      flex-direction: row;
      margin-top: 0;
    }
  }
`;

export default Wrapper;
