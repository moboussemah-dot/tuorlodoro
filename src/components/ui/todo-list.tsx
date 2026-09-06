import React, { useState, useEffect } from 'react';
import { Todo, getTodos, toggleTodo as toggleStorageTodo, deleteTodo as deleteStorageTodo } from '@/lib/storage';
import { TodoItem } from './todo-item';
import { TodoStats } from './todo-stats';

interface TodoListProps {
  todos: Todo[];
  onTodosChange: (todos: Todo[]) => void;
  filter?: 'all' | 'active' | 'completed';
}

export function TodoList({ todos, onTodosChange, filter = 'all' }: TodoListProps) {
  const handleToggle = (id: string) => {
    toggleStorageTodo(id);
    const updated = getTodos();
    onTodosChange(updated);
  };

  const handleDelete = (id: string) => {
    deleteStorageTodo(id);
    const updated = getTodos();
    onTodosChange(updated);
  };

  let filteredTodos = todos;
  if (filter === 'active') {
    filteredTodos = todos.filter((t) => !t.completed);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter((t) => t.completed);
  }

  // Sort by due date, then by creation date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed === b.completed) {
      const aDate = a.dueDate || a.createdAt;
      const bDate = b.dueDate || b.createdAt;
      return aDate - bDate;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      <TodoStats todos={todos} />

      {sortedTodos.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">
            {filter === 'completed'
              ? 'Nessuna attività completata ancora'
              : filter === 'active'
              ? 'Nessuna attività in corso!'
              : 'Nessuna attività. Aggiungi la tua prima attività!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
