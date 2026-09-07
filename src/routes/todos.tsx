import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { TodoForm } from '@/components/ui/todo-form';
import { TodoList } from '@/components/ui/todo-list';
import { getTodos, addTodo } from '@/lib/storage';
import type { Todo } from '@/lib/storage';
import { Settings, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/todos')({
  head: () => ({
    meta: [
      { title: "Attività — Tuorlo d'Oro" },
      { name: 'description', content: 'Gestione delle attività di Tuorlo d’Oro.' },
      { property: 'og:title', content: "Attività — Tuorlo d'Oro" },
      { property: 'og:description', content: 'Gestione delle attività di Tuorlo d’Oro.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: TodosPage,
});

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTodos(getTodos());
  }, []);

  const handleAddTodo = (text: string, category?: string, dueDate?: number) => {
    addTodo(text, category, dueDate);
    setTodos(getTodos());
  };

  const handleClearCompleted = () => {
    if (confirm('Sei sicuro di voler eliminare tutte le attività completate?')) {
      const completedCount = todos.filter((t) => t.completed).length;
      if (completedCount > 0) {
        const updatedTodos = todos.filter((t) => !t.completed);
        setTodos(updatedTodos);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Le Mie Attività</h1>
          <p className="text-gray-600">Organizza il tuo lavoro e i tuoi compiti con stile</p>
        </div>

        {/* Add Todo Form */}
        <TodoForm onSubmit={handleAddTodo} />

        {/* Filter Buttons */}
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tutte ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Da fare ({todos.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completate ({completedCount})
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="ml-auto px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Elimina completate
            </button>
          )}
        </div>

        {/* Todo List */}
        <TodoList
          todos={todos}
          onTodosChange={setTodos}
          filter={filter}
        />
      </div>
    </div>
  );
}

