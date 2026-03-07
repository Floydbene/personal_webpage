import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FaTrash,
  FaStickyNote,
  FaSignOutAlt,
  FaPen,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Wrapper from '../assets/wrappers/Tickets';

const FILTERS = [
  { key: 'active', label: 'Active' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
  { key: 'all', label: 'All' },
];

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#3b82f6',
  high: '#f97316',
  urgent: '#ef4444',
};

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
  closed: 'Closed',
};

const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done' || status === 'closed') return false;
  return new Date(dueDate) < new Date();
};

const formatDateValue = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// --- TicketCard sub-component ---
const TicketCard = ({
  ticket,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
  users,
  displayName,
}) => {
  const [localTitle, setLocalTitle] = useState(ticket.title);
  const [localDesc, setLocalDesc] = useState(ticket.description || '');
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    setLocalTitle(ticket.title);
    setLocalDesc(ticket.description || '');
  }, [ticket.title, ticket.description]);

  useEffect(() => {
    if (!expanded) setConfirmDel(false);
  }, [expanded]);

  const handleTitleBlur = () => {
    const trimmed = localTitle.trim();
    if (trimmed && trimmed !== ticket.title) {
      onUpdate({ title: trimmed });
    } else {
      setLocalTitle(ticket.title);
    }
  };

  const handleDescBlur = () => {
    const trimmed = localDesc.trim();
    if (trimmed !== (ticket.description || '')) {
      onUpdate({ description: trimmed || null });
    }
  };

  return (
    <div className={`ticket-card ${expanded ? 'expanded' : ''}`}>
      <div className="ticket-card-header" onClick={onToggle}>
        <div
          className="priority-bar"
          style={{ backgroundColor: PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.medium }}
        />
        <div className="ticket-summary">
          <span
            className={`ticket-title ${
              ['done', 'closed'].includes(ticket.status) ? 'resolved' : ''
            }`}
          >
            {ticket.title}
          </span>
          <div className="ticket-meta">
            <span className={`status-badge status-${ticket.status}`}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </span>
            {ticket.assignedTo && (
              <span className="assignee-badge">
                <span className="avatar">
                  {displayName(ticket.assignedTo).charAt(0).toUpperCase()}
                </span>
                {displayName(ticket.assignedTo)}
              </span>
            )}
            <span className="time-ago">{timeAgo(ticket.createdAt)}</span>
            {ticket.dueDate && (
              <span
                className={`due-date ${
                  isOverdue(ticket.dueDate, ticket.status) ? 'overdue' : ''
                }`}
              >
                {new Date(ticket.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
        <span className="expand-icon">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>

      {expanded && (
        <div className="ticket-detail">
          <div className="detail-field">
            <label>Title</label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="detail-input"
            />
          </div>

          <div className="detail-field">
            <label>Description</label>
            <textarea
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={handleDescBlur}
              placeholder="Add a description..."
              className="detail-textarea"
              rows={3}
            />
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <label>Status</label>
              <select
                value={ticket.status}
                onChange={(e) => onUpdate({ status: e.target.value })}
                className="detail-select"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="detail-field">
              <label>Priority</label>
              <select
                value={ticket.priority}
                onChange={(e) => onUpdate({ priority: e.target.value })}
                className="detail-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="detail-field">
              <label>Assignee</label>
              <select
                value={ticket.assignedTo || ''}
                onChange={(e) => onUpdate({ assignedTo: e.target.value || null })}
                className="detail-select"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.displayName || u.email.split('@')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="detail-field">
              <label>Due Date</label>
              <input
                type="date"
                value={formatDateValue(ticket.dueDate)}
                onChange={(e) => onUpdate({ dueDate: e.target.value || null })}
                className="detail-input"
              />
            </div>
          </div>

          <div className="detail-info">
            <span>Created {timeAgo(ticket.createdAt)}</span>
            {ticket.createdBy && <span> by {displayName(ticket.createdBy)}</span>}
            {ticket.closedAt && (
              <>
                <span> · Closed {timeAgo(ticket.closedAt)}</span>
                {ticket.completedBy && (
                  <span> by {displayName(ticket.completedBy)}</span>
                )}
              </>
            )}
          </div>

          <button
            className={`delete-ticket-btn ${confirmDel ? 'confirm' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (confirmDel) {
                onDelete(ticket.id);
              } else {
                setConfirmDel(true);
              }
            }}
            onBlur={() => setConfirmDel(false)}
          >
            {confirmDel ? 'Tap again to delete' : <><FaTrash /> Delete</>}
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Tickets component ---
const Tickets = () => {
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [activeFilter, setActiveFilter] = useState('active');
  const [expandedId, setExpandedId] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmDeleteNote, setConfirmDeleteNote] = useState(null);
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const close = () => navigate(-1);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // --- Queries ---
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await api.get('/api/tickets');
      return data;
    },
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data } = await api.get('/api/notes');
      return data;
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/api/users');
      return data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/me');
      return data;
    },
  });

  // --- Name map ---
  const nameMap = {};
  users.forEach((u) => {
    if (u.displayName) nameMap[u.email] = u.displayName;
  });

  const displayName = (email) => {
    if (!email) return '';
    return nameMap[email] || email.split('@')[0];
  };

  // --- Filtering ---
  const filterTickets = (filterKey) => {
    return tickets.filter((t) => {
      switch (filterKey) {
        case 'active':
          return ['open', 'in_progress'].includes(t.status);
        case 'open':
          return t.status === 'open';
        case 'in_progress':
          return t.status === 'in_progress';
        case 'done':
          return ['done', 'closed'].includes(t.status);
        case 'all':
          return true;
        default:
          return true;
      }
    });
  };

  const filteredTickets = filterTickets(activeFilter);

  // --- Mutations ---
  const nameMutation = useMutation({
    mutationFn: (displayName) => api.put('/api/users/me', { displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingName(false);
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/api/tickets', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setTitle('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...fields }) => api.patch(`/api/tickets/${id}`, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/tickets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setExpandedId(null);
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: (content) => api.post('/api/notes', { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setNoteContent('');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setConfirmDeleteNote(null);
    },
  });

  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title: title.trim() });
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    createNoteMutation.mutate(noteContent.trim());
  };

  const handleNameSubmit = () => {
    if (!nameInput.trim()) return;
    nameMutation.mutate(nameInput.trim());
  };

  const handleDeleteNote = (id) => {
    if (confirmDeleteNote === id) {
      deleteNoteMutation.mutate(id);
    } else {
      setConfirmDeleteNote(id);
    }
  };

  return (
    <Wrapper>
      <div className="modal-backdrop" onClick={close} />
      <div className="modal-panel">
        <div className="modal-header">
          <div className="header-left">
            <h2>Tickets</h2>
            {!editingName ? (
              <button
                className="name-btn"
                onClick={() => {
                  setNameInput(profile?.displayName || '');
                  setEditingName(true);
                }}
                title="Set display name"
              >
                {profile?.displayName || user?.email?.split('@')[0]} <FaPen />
              </button>
            ) : (
              <div className="name-edit">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') setEditingName(false);
                  }}
                  autoFocus
                />
                <button onClick={handleNameSubmit}>Save</button>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="sign-out-btn" onClick={handleSignOut} title="Sign out">
              <FaSignOutAlt />
            </button>
            <button className="close-btn" onClick={close}>
              &times;
            </button>
          </div>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="ticket-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a ticket..."
            />
            <button type="submit" disabled={createMutation.isLoading}>
              Add
            </button>
          </form>

          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                <span className="filter-count">{filterTickets(f.key).length}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="loading" />
          ) : filteredTickets.length === 0 ? (
            <p className="empty-state">
              {activeFilter === 'all'
                ? 'No tickets yet. Add one above!'
                : `No ${
                    activeFilter === 'active'
                      ? 'active'
                      : activeFilter.replace('_', ' ')
                  } tickets.`}
            </p>
          ) : (
            <div className="ticket-list">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  expanded={expandedId === ticket.id}
                  onToggle={() =>
                    setExpandedId(expandedId === ticket.id ? null : ticket.id)
                  }
                  onUpdate={(fields) =>
                    updateMutation.mutate({ id: ticket.id, ...fields })
                  }
                  onDelete={(id) => deleteMutation.mutate(id)}
                  users={users}
                  displayName={displayName}
                />
              ))}
            </div>
          )}

          <div className="notes-section">
            <h3>
              <FaStickyNote /> Notes
            </h3>
            <form onSubmit={handleNoteSubmit} className="note-form">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note..."
                rows={2}
              />
              <button type="submit" disabled={createNoteMutation.isLoading}>
                Add Note
              </button>
            </form>
            {notesLoading ? (
              <div className="loading" />
            ) : notes.length === 0 ? (
              <p className="empty-state">No notes yet.</p>
            ) : (
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <div className="note-content">
                      <p>{note.content}</p>
                      <span className="note-meta">
                        {note.createdBy ? displayName(note.createdBy) : 'unknown'}
                        {' — '}
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      className={`delete-btn ${
                        confirmDeleteNote === note.id ? 'confirm' : ''
                      }`}
                      onClick={() => handleDeleteNote(note.id)}
                      onBlur={() => setConfirmDeleteNote(null)}
                    >
                      {confirmDeleteNote === note.id ? 'Sure?' : <FaTrash />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Tickets;
