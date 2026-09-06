import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (text: string, category?: string, dueDate?: number) => void;
  isLoading?: boolean;
}

const CATEGORIES = ['Lavoro', 'Personale', 'Shopping', 'Fattoria', 'Salute'];

export function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const dueDateMs = dueDate ? new Date(dueDate).getTime() : undefined;
      onSubmit(text.trim(), category || undefined, dueDateMs);
      setText('');
      setCategory('');
      setDueDate('');
      setShowAdvanced(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aggiungi una nuova attività..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Aggiungi</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        {showAdvanced ? '▼' : '▶'} Opzioni avanzate
      </button>

      {showAdvanced && (
        <div className="space-y-3 border-t border-gray-200 pt-3">
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Nessuna categoria</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-xs font-medium text-gray-700 mb-1">
              Data di scadenza
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </form>
  );
}
