import React from 'react';
import { Todo } from '@/lib/storage';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const completed = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const overdue = todos.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < Date.now();
  }).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{total}</div>
        <div className="text-xs text-gray-600 mt-1">Totale</div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{completed}</div>
        <div className="text-xs text-gray-600 mt-1">Completate</div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">{total - completed}</div>
        <div className="text-xs text-gray-600 mt-1">Da fare</div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <div className={`text-2xl font-bold ${
          overdue > 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {overdue}
        </div>
        <div className="text-xs text-gray-600 mt-1">In ritardo</div>
      </div>
    </div>
  );
}
