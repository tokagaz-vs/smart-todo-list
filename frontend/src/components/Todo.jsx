import React from 'react';

const Todo = ({ todo, onToggle, onDelete, onSubTaskToggle }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border-l-4 ${
      todo.completed ? 'border-l-green-500' : 'border-l-blue-500'
    } p-6 transition-all duration-200 hover:shadow-lg`}>
      
      {/* Основная задача */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={onToggle}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {todo.completed && (
              <svg className="w-4 h-4 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <p className={`text-lg ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}>
              {todo.text}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(todo.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
        
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Удалить задачу"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Подзадачи, сгенерированные AI */}
      {todo.subTasks && todo.subTasks.length > 0 && (
        <div className="ml-9 border-t pt-4">
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI рекомендует эти шаги:
          </p>
          <div className="space-y-2">
            {todo.subTasks.map((subTask) => (
              <div key={subTask.id} className="flex items-center space-x-2">
                <button
                  onClick={() => onSubTaskToggle(subTask.id)}
                  className={`w-4 h-4 rounded border flex-shrink-0 transition-colors ${
                    subTask.completed
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {subTask.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`text-sm ${
                  subTask.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                }`}>
                  {subTask.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;