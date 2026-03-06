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

    .form-inputs {
      flex: 1;
      display: flex;
      gap: 0.5rem;
    }

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

    .assign-input {
      flex: 0.5;
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
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--theme-border);
    transition: var(--transition);
    flex-wrap: wrap;

    &:hover {
      background: var(--theme-backgroundSecondary);
    }

    input[type='checkbox'] {
      accent-color: var(--theme-accent);
      width: 1.1rem;
      height: 1.1rem;
      cursor: pointer;
      margin-top: 0.15rem;
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-title {
      color: var(--theme-text);
      display: block;
    }

    .todo-title.completed {
      text-decoration: line-through;
      color: var(--theme-textMuted);
    }

    .todo-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      color: var(--theme-textMuted);

      svg {
        font-size: 0.65rem;
      }
    }

    .assign-tag {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
    }

    .completed-tag {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .todo-actions {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .assign-btn,
    .delete-btn {
      background: none;
      border: none;
      color: var(--theme-textMuted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.25rem;
      transition: var(--transition);
    }

    .assign-btn:hover {
      color: #818cf8;
    }

    .delete-btn:hover {
      color: #e74c3c;
    }

    .assign-edit {
      width: 100%;
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;

      input {
        flex: 1;
        padding: 0.35rem 0.5rem;
        border: 1px solid var(--theme-border);
        border-radius: var(--borderRadius);
        background: var(--theme-background);
        color: var(--theme-text);
        font-size: 0.85rem;

        &:focus {
          outline: none;
          border-color: var(--theme-accent);
        }
      }

      button {
        padding: 0.35rem 0.75rem;
        border: none;
        border-radius: var(--borderRadius);
        background: var(--theme-accent);
        color: var(--theme-background);
        cursor: pointer;
        font-size: 0.85rem;
        transition: var(--transition);

        &:hover {
          opacity: 0.85;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    color: var(--theme-textMuted);
    padding: 2rem;
    font-style: italic;
  }

  .notes-section {
    margin-top: 2.5rem;
    border-top: 2px solid var(--theme-border);
    padding-top: 1.5rem;

    h3 {
      color: var(--theme-text);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .note-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    align-items: flex-end;

    textarea {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--theme-border);
      border-radius: var(--borderRadius);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;

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
      font-size: 0.9rem;
      white-space: nowrap;
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

  .notes-list {
    list-style: none;
    padding: 0;
  }

  .note-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--theme-border);
    transition: var(--transition);

    &:hover {
      background: var(--theme-backgroundSecondary);
    }

    .note-content {
      flex: 1;
      min-width: 0;

      p {
        color: var(--theme-text);
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .note-meta {
        font-size: 0.75rem;
        color: var(--theme-textMuted);
        margin-top: 0.25rem;
        display: block;
      }
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--theme-textMuted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.25rem;
      transition: var(--transition);
      flex-shrink: 0;

      &:hover {
        color: #e74c3c;
      }
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;

    h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .todo-form {
      flex-direction: column;

      .form-inputs {
        flex-direction: column;
      }

      .assign-input {
        flex: 1;
      }

      input {
        padding: 0.75rem;
        font-size: 1rem;
      }

      button {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
      }
    }

    .todo-item {
      padding: 1rem 0.75rem;
      gap: 0.75rem;

      input[type='checkbox'] {
        width: 1.35rem;
        height: 1.35rem;
        flex-shrink: 0;
      }

      .todo-title {
        font-size: 1rem;
        word-break: break-word;
      }

      .todo-actions {
        gap: 0.5rem;
      }

      .assign-btn,
      .delete-btn {
        font-size: 1.1rem;
        padding: 0.5rem;
        flex-shrink: 0;
      }
    }

    .note-form {
      flex-direction: column;

      textarea {
        font-size: 1rem;
        padding: 0.75rem;
      }

      button {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
      }
    }

    .note-item {
      padding: 1rem 0.75rem;

      .delete-btn {
        font-size: 1.1rem;
        padding: 0.5rem;
      }
    }
  }
`;

export default Wrapper;
