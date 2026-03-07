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

  /* Quick-add form */
  .ticket-form {
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

  /* Filter tabs */
  .filter-tabs {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 0.25rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .filter-tab {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--theme-border);
    border-radius: 999px;
    background: transparent;
    color: var(--theme-textMuted);
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;

    &.active {
      background: var(--theme-accent);
      color: #fff;
      border-color: var(--theme-accent);
      font-weight: 600;
    }

    &:not(.active):hover {
      border-color: var(--theme-textMuted);
    }

    .filter-count {
      font-size: 0.65rem;
      opacity: 0.7;
    }
  }

  /* Ticket cards */
  .ticket-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ticket-card {
    border: 1px solid var(--theme-border);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: box-shadow 0.2s;

    &.expanded {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
    }
  }

  .ticket-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.15s;
    min-height: 48px;

    &:active {
      background: rgba(0, 0, 0, 0.03);
    }
  }

  .priority-bar {
    width: 4px;
    align-self: stretch;
    border-radius: 2px;
    flex-shrink: 0;
    min-height: 32px;
  }

  .ticket-summary {
    flex: 1;
    min-width: 0;
  }

  .ticket-title {
    display: block;
    font-size: 0.95rem;
    color: var(--theme-text);
    font-weight: 500;
    line-height: 1.3;

    &.resolved {
      text-decoration: line-through;
      color: var(--theme-textMuted);
    }
  }

  .ticket-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.3rem;
    align-items: center;
  }

  .status-badge {
    font-size: 0.6rem;
    padding: 0.12rem 0.4rem;
    border-radius: 999px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;

    &.status-open {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }
    &.status-in_progress {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
    &.status-done {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }
    &.status-closed {
      background: rgba(107, 114, 128, 0.15);
      color: #6b7280;
    }
  }

  .assignee-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    color: var(--theme-textMuted);

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--theme-accent);
      color: var(--theme-background);
      font-size: 0.55rem;
      font-weight: 700;
    }
  }

  .time-ago {
    font-size: 0.7rem;
    color: var(--theme-textMuted);
  }

  .due-date {
    font-size: 0.7rem;
    color: var(--theme-textMuted);

    &.overdue {
      color: #ef4444;
      font-weight: 600;
    }
  }

  .expand-icon {
    color: var(--theme-textMuted);
    font-size: 0.65rem;
    flex-shrink: 0;
    padding: 0.25rem;
  }

  /* Ticket detail (expanded view) */
  .ticket-detail {
    padding: 0.75rem;
    border-top: 1px solid var(--theme-border);
    background: rgba(0, 0, 0, 0.02);
  }

  .detail-field {
    margin-bottom: 0.65rem;

    label {
      display: block;
      font-size: 0.65rem;
      color: var(--theme-textMuted);
      margin-bottom: 0.2rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
  }

  .detail-input,
  .detail-select,
  .detail-textarea {
    width: 100%;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--theme-border);
    border-radius: 0.375rem;
    background: var(--theme-background);
    color: var(--theme-text);
    font-size: 0.85rem;
    font-family: inherit;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--theme-accent);
    }
  }

  .detail-textarea {
    resize: vertical;
    min-height: 60px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .detail-info {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
    font-size: 0.7rem;
    color: var(--theme-textMuted);
    line-height: 1.5;
  }

  .delete-ticket-btn {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--theme-border);
    border-radius: 0.375rem;
    background: transparent;
    color: var(--theme-textMuted);
    cursor: pointer;
    font-size: 0.8rem;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    transition: all 0.2s;
    min-height: 48px;

    &:hover {
      color: #e74c3c;
      border-color: #e74c3c;
    }

    &.confirm {
      background: #e74c3c;
      color: white;
      border-color: #e74c3c;
    }
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    color: var(--theme-textMuted);
    padding: 1.5rem;
    font-style: italic;
    font-size: 0.9rem;
  }

  /* Notes section */
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
      min-height: 48px;
      min-width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;

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

  /* Responsive */
  @media (min-width: 768px) {
    align-items: center;

    .modal-panel {
      border-radius: 1rem;
      max-height: 80vh;
    }
  }

  @media (max-width: 767px) {
    .ticket-form {
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

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .detail-input,
    .detail-select,
    .detail-textarea {
      font-size: 1rem;
      padding: 0.6rem;
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
    }
  }
`;

export default Wrapper;
