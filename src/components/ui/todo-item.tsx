import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Todo } from '@/lib/storage';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('it-IT') : null;
  const isOverdue = dueDate && new Date(todo.dueDate!).getTime() < Date.now() && !todo.completed;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
        todo.completed
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
      } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-900'
          } ${isOverdue ? 'text-red-600' : ''}`}
        >
          {todo.text}
        </p>
        <div className="mt-1 flex gap-2 text-xs text-gray-500">
          {todo.category && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
              {todo.category}
            </span>
          )}
          {dueDate && (
            <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
              {isOverdue ? '⚠️ ' : '📅 '}{dueDate}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete todo"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
