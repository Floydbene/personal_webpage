import styled from 'styled-components';

const Wrapper = styled.section`
  max-width: 700px;

  h2 {
    margin-bottom: 1.5rem;
    color: var(--theme-text);
  }

  .placeholder {
    color: var(--theme-textMuted);
    font-style: italic;
  }

  .todo-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--theme-border);
      border-radius: var(--borderRadius);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--theme-accent);
      }
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--borderRadius);
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 1rem;
      transition: var(--transition);

      &:hover {
        opacity: 0.85;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .todo-list {
    list-style: none;
    padding: 0;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--theme-border);
    transition: var(--transition);

    &:hover {
      background: var(--theme-backgroundSecondary);
    }

    input[type='checkbox'] {
      accent-color: var(--theme-accent);
      width: 1.1rem;
      height: 1.1rem;
      cursor: pointer;
    }

    .todo-title {
      flex: 1;
      color: var(--theme-text);
    }

    .todo-title.completed {
      text-decoration: line-through;
      color: var(--theme-textMuted);
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--theme-textMuted);
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      transition: var(--transition);

      &:hover {
        color: #e74c3c;
      }
    }
  }

  .empty-state {
    text-align: center;
    color: var(--theme-textMuted);
    padding: 2rem;
    font-style: italic;
  }
`;

export default Wrapper;
