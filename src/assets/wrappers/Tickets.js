import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--theme-background);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--theme-primary) 6%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 85% 100%, color-mix(in srgb, var(--theme-accent) 4%, transparent) 0%, transparent 70%);
  color: var(--theme-text);
  font-family: var(--font-primary);

  .dashboard-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 3rem;
  }

  /* Top bar */
  .dashboard-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--theme-textMuted);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: var(--theme-accent);
    }
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .name-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: var(--transition);
    font-family: inherit;

    svg { font-size: 0.6rem; }
    &:hover { color: var(--theme-accent); }
  }

  .name-edit {
    display: flex;
    gap: 0.35rem;
    align-items: center;

    input {
      padding: 0.3rem 0.5rem;
      border: 1px solid var(--theme-border);
      border-radius: 6px;
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.8rem;
      width: 120px;
      font-family: inherit;
      &:focus { outline: none; border-color: var(--theme-accent); }
    }

    button {
      padding: 0.3rem 0.6rem;
      border: none;
      border-radius: 6px;
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.75rem;
      font-family: inherit;
    }
  }

  .sign-out-btn {
    background: none;
    border: none;
    color: var(--theme-textMuted);
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0.25rem;
    transition: var(--transition);
    &:hover { color: #e74c3c; }
  }

  /* Dashboard widgets */
  .dashboard-widgets {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  .widget-card {
    flex: 1;
    min-width: 180px;
    padding: 1.25rem;
    background: color-mix(in srgb, var(--theme-cardBackground) 80%, transparent);
    border: 1px solid var(--theme-border);
    border-radius: 14px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .widget-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--theme-textMuted);
    font-weight: 600;
    margin-bottom: 0.6rem;
  }

  /* Greeting widget */
  .greeting-text {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--theme-text);
    margin-bottom: 0.25rem;
  }

  .greeting-date {
    font-size: 0.8rem;
    color: var(--theme-textMuted);
  }

  /* Weather widget */
  .weather-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .weather-icon {
    font-size: 1.5rem;
    line-height: 1;
  }

  .weather-temp {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--theme-text);
  }

  .weather-desc {
    font-size: 0.8rem;
    color: var(--theme-textSecondary);
    margin-bottom: 0.1rem;
  }

  .weather-wind {
    font-size: 0.7rem;
    color: var(--theme-textMuted);
  }

  /* Stats widget */
  .stats-grid {
    display: flex;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .stat-number {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stat-open { color: #3b82f6; }
  .stat-progress { color: #f59e0b; }
  .stat-done { color: #22c55e; }

  .stat-label {
    font-size: 0.65rem;
    color: var(--theme-textMuted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 500;
  }

  /* Tickets section */
  .tickets-section {
    background: color-mix(in srgb, var(--theme-cardBackground) 60%, transparent);
    border: 1px solid var(--theme-border);
    border-radius: 16px;
    padding: 1.25rem;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
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
      border-radius: 8px;
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.9rem;
      font-family: inherit;
      &:focus { outline: none; border-color: var(--theme-accent); }
    }

    button {
      padding: 0.6rem 1rem;
      border: none;
      border-radius: 8px;
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.9rem;
      font-family: inherit;
      font-weight: 500;
      transition: var(--transition);
      &:hover { opacity: 0.85; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  }

  /* Filter bar */
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0.4rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 0.25rem;
    &::-webkit-scrollbar { display: none; }
  }

  .filter-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-select {
    appearance: none;
    padding: 0.3rem 1.8rem 0.3rem 0.6rem;
    border: 1px solid var(--theme-border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--theme-cardBackground) 60%, transparent);
    color: var(--theme-text);
    font-size: 0.75rem;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;

    &:hover, &:focus {
      border-color: var(--theme-primary);
      outline: none;
    }
  }

  .sort-control {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    position: relative;

    .sort-icon {
      font-size: 0.65rem;
      color: var(--theme-textMuted);
      flex-shrink: 0;
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
    font-family: inherit;

    &.active {
      background: var(--theme-primary);
      color: var(--theme-background);
      border-color: var(--theme-primary);
      font-weight: 600;
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.15);
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
    border-radius: 10px;
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

  .ticket-summary { flex: 1; min-width: 0; }

  .ticket-title {
    display: block;
    font-size: 0.95rem;
    color: var(--theme-text);
    font-weight: 500;
    line-height: 1.3;
    &.resolved { text-decoration: line-through; color: var(--theme-textMuted); }
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

    &.status-open { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    &.status-in_progress { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    &.status-done { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
    &.status-closed { background: rgba(107, 114, 128, 0.15); color: #6b7280; }
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

  .time-ago { font-size: 0.7rem; color: var(--theme-textMuted); }

  .due-date {
    font-size: 0.7rem;
    color: var(--theme-textMuted);
    &.overdue { color: #ef4444; font-weight: 600; }
  }

  .expand-icon {
    color: var(--theme-textMuted);
    font-size: 0.65rem;
    flex-shrink: 0;
    padding: 0.25rem;
  }

  /* Ticket detail */
  .ticket-detail {
    padding: 0.75rem;
    border-top: 1px solid var(--theme-border);
    background: color-mix(in srgb, var(--theme-background) 50%, transparent);
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
    border-radius: 8px;
    background: var(--theme-background);
    color: var(--theme-text);
    font-size: 0.85rem;
    font-family: inherit;
    box-sizing: border-box;
    &:focus { outline: none; border-color: var(--theme-accent); }
  }

  .detail-textarea { resize: vertical; min-height: 60px; }

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
    border-radius: 8px;
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

    &:hover { color: #e74c3c; border-color: #e74c3c; }
    &.confirm { background: #e74c3c; color: white; border-color: #e74c3c; }
  }

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
      border-radius: 8px;
      background: var(--theme-background);
      color: var(--theme-text);
      font-size: 0.85rem;
      font-family: inherit;
      resize: vertical;
      &:focus { outline: none; border-color: var(--theme-accent); }
    }

    button {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 8px;
      background: var(--theme-accent);
      color: var(--theme-background);
      cursor: pointer;
      font-size: 0.85rem;
      font-family: inherit;
      font-weight: 500;
      white-space: nowrap;
      transition: var(--transition);
      &:hover { opacity: 0.85; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  }

  .notes-list { list-style: none; padding: 0; margin: 0; }

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
      p { color: var(--theme-text); margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 0.9rem; }
      .note-meta { font-size: 0.7rem; color: var(--theme-textMuted); margin-top: 0.2rem; display: block; }
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
      &:hover { color: #e74c3c; }
      &.confirm { color: #e74c3c; font-size: 0.75rem; font-weight: 600; }
    }
  }

  /* Responsive */
  @media (max-width: 767px) {
    .dashboard-widgets {
      flex-direction: column;
    }

    .widget-card {
      min-width: unset;
    }

    .ticket-form {
      flex-direction: column;
      input { padding: 0.75rem; font-size: 1rem; }
      button { padding: 0.75rem; font-size: 1rem; }
    }

    .detail-grid { grid-template-columns: 1fr; }

    .detail-input,
    .detail-select,
    .detail-textarea { font-size: 1rem; padding: 0.6rem; }

    .note-form {
      flex-direction: column;
      textarea { font-size: 1rem; padding: 0.75rem; }
      button { padding: 0.75rem; font-size: 1rem; }
    }

    .note-item {
      flex-direction: column;
      align-items: center;
      text-align: center;
      .note-content .note-meta { text-align: center; }
    }
  }
`;

export default Wrapper;
