import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import api from '../lib/api';
import Wrapper from '../assets/wrappers/TodoList';

const fetchTodos = async () => {
  const { data } = await api.get('/api/todos');
  return data;
};

const TodoList = () => {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const createMutation = useMutation({
    mutationFn: (newTitle) => api.post('/api/todos', { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
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

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted');
    },
    onError: () => toast.error('Failed to delete todo'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate(title.trim());
  };

  if (isLoading) {
    return <div className="loading" />;
  }

  return (
    <Wrapper>
      <h2>Todos</h2>
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
              <span
                className={`todo-title ${todo.completed ? 'completed' : ''}`}
              >
                {todo.title}
              </span>
              <button
                className="delete-btn"
                onClick={() => deleteMutation.mutate(todo.id)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};

export default TodoList;
