import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaTrash, FaStickyNote, FaUser } from 'react-icons/fa';
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

const TodoList = () => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingAssign, setEditingAssign] = useState(null);
  const [assignInput, setAssignInput] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  // Todo mutations
  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/api/todos', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
      setAssignedTo('');
      toast.success('Todo added');
    },
    onError: () => toast.error('Failed to add todo'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }) =>
      api.patch(`/api/todos/${id}`, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    onError: () => toast.error('Failed to update todo'),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, assignedTo }) =>
      api.patch(`/api/todos/${id}`, { assignedTo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingAssign(null);
      setAssignInput('');
    },
    onError: () => toast.error('Failed to assign todo'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted');
    },
    onError: () => toast.error('Failed to delete todo'),
  });

  // Note mutations
  const createNoteMutation = useMutation({
    mutationFn: (content) => api.post('/api/notes', { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setNoteContent('');
      toast.success('Note added');
    },
    onError: () => toast.error('Failed to add note'),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({
      title: title.trim(),
      assignedTo: assignedTo.trim() || undefined,
    });
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    createNoteMutation.mutate(noteContent.trim());
  };

  const handleAssignSubmit = (todoId) => {
    assignMutation.mutate({ id: todoId, assignedTo: assignInput.trim() || null });
  };

  const formatEmail = (email) => {
    if (!email) return '';
    return email.split('@')[0];
  };

  if (isLoading) {
    return <div className="loading" />;
  }

  return (
    <Wrapper>
      <h2>Todos</h2>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-inputs">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Assign to (optional)"
            className="assign-input"
          />
        </div>
        <button type="submit" disabled={createMutation.isLoading}>
          Add
        </button>
      </form>

      {todos.length === 0 ? (
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
                  {todo.assignedTo && (
                    <span className="meta-tag assign-tag">
                      <FaUser /> {todo.assignedTo}
                    </span>
                  )}
                  {todo.completedBy && (
                    <span className="meta-tag completed-tag">
                      done by {formatEmail(todo.completedBy)}
                    </span>
                  )}
                </div>
              </div>
              <div className="todo-actions">
                <button
                  className="assign-btn"
                  title="Assign"
                  onClick={() => {
                    setEditingAssign(editingAssign === todo.id ? null : todo.id);
                    setAssignInput(todo.assignedTo || '');
                  }}
                >
                  <FaUser />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  <FaTrash />
                </button>
              </div>
              {editingAssign === todo.id && (
                <div className="assign-edit">
                  <input
                    type="text"
                    value={assignInput}
                    onChange={(e) => setAssignInput(e.target.value)}
                    placeholder="Assign to..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAssignSubmit(todo.id);
                      if (e.key === 'Escape') setEditingAssign(null);
                    }}
                    autoFocus
                  />
                  <button onClick={() => handleAssignSubmit(todo.id)}>Save</button>
                </div>
              )}
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
                    {note.createdBy ? formatEmail(note.createdBy) : 'unknown'}
                    {' — '}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  );
};

export default TodoList;
