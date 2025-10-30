import React, { useState, useEffect } from 'react';
import Todo from './components/Todo';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем задачи при монтировании компонента
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setNewTodoText('');
      } else {
        console.error('Ошибка при создании задачи');
      }
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
      }
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  const toggleSubTask = async (todoId, subTaskId) => {
    try {
      const response = await fetch(
        `${API_BASE}/todos/${todoId}/subtasks/${subTaskId}/toggle`,
        { method: 'PATCH' }
      );

      if (response.ok) {
        const updatedSubTask = await response.json();
        setTodos(todos.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              subTasks: todo.subTasks.map(st =>
                st.id === subTaskId ? updatedSubTask : st
              )
            };
          }
          return todo;
        }));
      }
    } catch (error) {
      console.error('Ошибка при обновлении подзадачи:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ Умный Список Задач
          </h1>
          <p className="text-gray-600">
            Добавьте сложную задачу, и AI разобьёт её на простые шаги!
          </p>
        </header>

        {/* Форма добавления */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Например: 'Подготовить презентацию для совещания в понедельник'"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newTodoText.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? 'Добавляем...' : 'Добавить'}
            </button>
          </div>
        </form>

        {/* Список задач */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">🎯 Начните добавлять свои задачи!</p>
              <p className="text-sm mt-2">
                Попробуйте добавить сложную задачу, и AI поможет разбить её на подзадачи.
              </p>
            </div>
          ) : (
            todos.map(todo => (
              <Todo
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onSubTaskToggle={(subTaskId) => toggleSubTask(todo.id, subTaskId)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;