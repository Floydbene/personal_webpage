import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaStickyNote, FaUser, FaSignOutAlt, FaPen } from 'react-icons/fa';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Wrapper from '../assets/wrappers/TodoList';

const fetchTodos = async () => {
  const { data } = await api.get('/api/todos');
  return data;
};

const fetchNotes = async () => {
  const { data } = await api.get('/api/notes');
  return data;
};

const fetchUsers = async () => {
  const { data } = await api.get('/api/users');
  return data;
};

const fetchProfile = async () => {
  const { data } = await api.get('/api/users/me');
  return data;
};

const TodoList = () => {
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingAssign, setEditingAssign] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const close = () => navigate(-1);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  // Build email → displayName lookup
  const nameMap = {};
  users.forEach((u) => {
    if (u.displayName) nameMap[u.email] = u.displayName;
  });

  const displayName = (email) => {
    if (!email) return '';
    return nameMap[email] || email.split('@')[0];
  };

  const nameMutation = useMutation({
    mutationFn: (displayName) => api.put('/api/users/me', { displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingName(false);
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/api/todos', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }) =>
      api.patch(`/api/todos/${id}`, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, assignedTo }) =>
      api.patch(`/api/todos/${id}`, { assignedTo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingAssign(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setConfirmDelete(null);
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
      setConfirmDelete(null);
    },
  });

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

  const handleDelete = (type, id) => {
    if (confirmDelete?.id === id) {
      if (type === 'todo') deleteMutation.mutate(id);
      else deleteNoteMutation.mutate(id);
    } else {
      setConfirmDelete({ type, id });
    }
  };

  return (
    <Wrapper>
      <div className="modal-backdrop" onClick={close} />
      <div className="modal-panel">
        <div className="modal-header">
          <div className="header-left">
            <h2>Todos</h2>
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
            <button className="close-btn" onClick={close}>&times;</button>
          </div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="todo-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
            <button type="submit" disabled={createMutation.isLoading}>
              Add
            </button>
          </form>

          {isLoading ? (
            <div className="loading" />
          ) : todos.length === 0 ? (
            <p className="empty-state">No todos yet. Add one above!</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      toggleMutation.mutate({
                        id: todo.id,
                        completed: !todo.completed,
                      })
                    }
                  />
                  <div className="todo-content">
                    <span
                      className={`todo-title ${todo.completed ? 'completed' : ''}`}
                    >
                      {todo.title}
                    </span>
                    <div className="todo-meta">
                      {todo.createdBy && (
                        <span className="meta-tag creator-tag">
                          by {displayName(todo.createdBy)}
                        </span>
                      )}
                      {todo.assignedTo && (
                        <span
                          className="meta-tag assign-tag clickable"
                          onClick={() =>
                            setEditingAssign(editingAssign === todo.id ? null : todo.id)
                          }
                        >
                          <FaUser /> {displayName(todo.assignedTo)}
                        </span>
                      )}
                      {!todo.assignedTo && (
                        <span
                          className="meta-tag assign-tag clickable"
                          onClick={() => setEditingAssign(todo.id)}
                        >
                          <FaUser /> assign
                        </span>
                      )}
                      {todo.completedBy && (
                        <span className="meta-tag completed-tag">
                          done by {displayName(todo.completedBy)}
                        </span>
                      )}
                    </div>
                    {editingAssign === todo.id && (
                      <select
                        className="assign-select"
                        value={todo.assignedTo || ''}
                        onChange={(e) => {
                          assignMutation.mutate({
                            id: todo.id,
                            assignedTo: e.target.value || null,
                          });
                        }}
                        autoFocus
                        onBlur={() => setEditingAssign(null)}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.email} value={u.email}>
                            {u.displayName || u.email.split('@')[0]}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button
                    className={`delete-btn ${confirmDelete?.id === todo.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete('todo', todo.id)}
                    onBlur={() => setConfirmDelete(null)}
                  >
                    {confirmDelete?.id === todo.id ? 'Sure?' : <FaTrash />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="notes-section">
            <h3><FaStickyNote /> Notes</h3>
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
                      className={`delete-btn ${confirmDelete?.id === note.id ? 'confirm' : ''}`}
                      onClick={() => handleDelete('note', note.id)}
                      onBlur={() => setConfirmDelete(null)}
                    >
                      {confirmDelete?.id === note.id ? 'Sure?' : <FaTrash />}
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

export default TodoList;
