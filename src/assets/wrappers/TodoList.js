import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .modal-panel {
    position: relative;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    background: var(--theme-background);
    border-radius: 1rem 1rem 0 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--theme-border);
    flex-shrink: 0;
    gap: 0.75rem;

    h2 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--theme-text);
    }
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .name-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: var(--transition);

    svg {
      font-size: 0.6rem;
    }

    &:hover {
      color: var(--theme-accent);
    }
  }

  .name-edit {
    display: flex;
    gap: 0.35rem;
    align-items: center;

    input {
      padding: 0.2rem 0.4rem;
      border: 1px solid var(--theme-border);
      border-radius: var(--borderRadius);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.8rem;
      width: 120px;

      &:focus {
        outline: none;
        border-color: var(--theme-accent);
      }
    }

    button {
      padding: 0.2rem 0.5rem;
      border: none;
      border-radius: var(--borderRadius);
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.75rem;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .sign-out-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0.25rem;
    transition: var(--transition);

    &:hover {
      color: #e74c3c;
    }
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 1.75rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;

    &:hover {
      color: var(--theme-text);
    }
  }

  .modal-body {
    overflow-y: auto;
    padding: 1rem 1.25rem 2rem;
    -webkit-overflow-scrolling: touch;
  }

  .todo-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    input {
      flex: 1;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--theme-border);
      border-radius: var(--borderRadius);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.9rem;

      &:focus {
        outline: none;
        border-color: var(--theme-accent);
      }
    }

    button {
      padding: 0.6rem 1rem;
      border: none;
      border-radius: var(--borderRadius);
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.9rem;
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
    margin: 0;
  }

  .todo-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--theme-border);

    input[type='checkbox'] {
      accent-color: var(--theme-accent);
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;
      margin-top: 0.1rem;
      flex-shrink: 0;
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-title {
      color: var(--theme-text);
      display: block;
      font-size: 0.95rem;
    }

    .todo-title.completed {
      text-decoration: line-through;
      color: var(--theme-textMuted);
    }

    .todo-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.2rem;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.7rem;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      color: var(--theme-textMuted);

      svg {
        font-size: 0.6rem;
      }
    }

    .clickable {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .creator-tag {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .assign-tag {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
    }

    .completed-tag {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .assign-select {
      display: block;
      width: 100%;
      margin-top: 0.4rem;
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

    .delete-btn {
      background: none;
      border: none;
      color: var(--theme-textMuted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.35rem;
      transition: var(--transition);
      flex-shrink: 0;

      &:hover {
        color: #e74c3c;
      }

      &.confirm {
        color: #e74c3c;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }

  .empty-state {
    text-align: center;
    color: var(--theme-textMuted);
    padding: 1.5rem;
    font-style: italic;
    font-size: 0.9rem;
  }

  .notes-section {
    margin-top: 1.5rem;
    border-top: 2px solid var(--theme-border);
    padding-top: 1rem;

    h3 {
      color: var(--theme-text);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
    }
  }

  .note-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    align-items: flex-end;

    textarea {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--theme-border);
      border-radius: var(--borderRadius);
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.85rem;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: var(--theme-accent);
      }
    }

    button {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: var(--borderRadius);
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.85rem;
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
    margin: 0;
  }

  .note-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--theme-border);

    .note-content {
      width: 100%;

      p {
        color: var(--theme-text);
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 0.9rem;
      }

      .note-meta {
        font-size: 0.7rem;
        color: var(--theme-textMuted);
        margin-top: 0.2rem;
        display: block;
      }
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--theme-textMuted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.35rem;
      transition: var(--transition);
      flex-shrink: 0;

      &:hover {
        color: #e74c3c;
      }
    }
  }

  @media (min-width: 768px) {
    align-items: center;

    .modal-panel {
      border-radius: 1rem;
      max-height: 80vh;
    }
  }

  @media (max-width: 767px) {
    .todo-form {
      flex-direction: column;

      input {
        padding: 0.75rem;
        font-size: 1rem;
      }

      button {
        padding: 0.75rem;
        font-size: 1rem;
      }
    }

    .todo-item {
      input[type='checkbox'] {
        width: 1.35rem;
        height: 1.35rem;
      }

      .delete-btn {
        font-size: 1.1rem;
        padding: 0.5rem;
      }

      .assign-select {
        font-size: 1rem;
        padding: 0.5rem;
      }
    }

    .note-form {
      flex-direction: column;

      textarea {
        font-size: 1rem;
        padding: 0.75rem;
      }

      button {
        padding: 0.75rem;
        font-size: 1rem;
      }
    }

    .note-item {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .note-content {
        width: 100%;

        .note-meta {
          text-align: center;
        }
      }

      .delete-btn {
        font-size: 1.1rem;
        padding: 0.5rem;
      }
    }
  }
`;

export default Wrapper;
