import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;

  .sidebar {
    width: 250px;
    background: var(--theme-navBackground);
    border-right: 1px solid var(--theme-border);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--theme-border);
  }

  .user-email {
    color: var(--theme-textMuted);
    font-size: var(--small-text);
    word-break: break-all;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: var(--borderRadius);
    color: var(--theme-text);
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      background: var(--theme-backgroundSecondary);
      color: var(--theme-accent);
    }

    &.active {
      color: var(--theme-accent);
      background: var(--theme-backgroundSecondary);
    }
  }

  .sign-out-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: none;
    border-radius: var(--borderRadius);
    background: transparent;
    color: var(--theme-textMuted);
    cursor: pointer;
    font-size: 1rem;
    transition: var(--transition);

    &:hover {
      color: var(--theme-accent);
      background: var(--theme-backgroundSecondary);
    }
  }

  .admin-content {
    flex: 1;
    padding: 2rem;
    background: var(--theme-background);
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .sidebar {
      width: 100%;
      flex-direction: row;
      align-items: center;
      padding: 0.75rem 1rem;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .sidebar-header {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .user-email {
      display: none;
    }

    .sidebar-nav {
      flex-direction: row;
    }

    .sign-out-btn {
      margin-left: auto;
    }

    .admin-content {
      padding: 1rem;
    }
  }
`;

export default Wrapper;
