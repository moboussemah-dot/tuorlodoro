// Local Storage utility for todo management
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  category?: string;
}

const STORAGE_KEY = 'bio-egg-farm-todos';

export function getTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading todos from localStorage:', error);
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
}

export function addTodo(text: string, category?: string, dueDate?: number): Todo {
  const todos = getTodos();
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
    ...(dueDate === undefined ? {} : { dueDate }),
    ...(category === undefined ? {} : { category }),
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

export function updateTodo(id: string, updates: Partial<Todo>): Todo | null {
  const todos = getTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  
  const updated = { ...todo, ...updates };
  const index = todos.findIndex((t) => t.id === id);
  todos[index] = updated;
  saveTodos(todos);
  return updated;
}

export function deleteTodo(id: string): void {
  const todos = getTodos();
  const filtered = todos.filter((t) => t.id !== id);
  saveTodos(filtered);
}

export function toggleTodo(id: string): Todo | null {
  const todos = getTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  
  todo.completed = !todo.completed;
  saveTodos(todos);
  return todo;
}

export function clearCompleted(): void {
  const todos = getTodos();
  const filtered = todos.filter((t) => !t.completed);
  saveTodos(filtered);
}

export function getTodosByCategory(category: string): Todo[] {
  return getTodos().filter((t) => t.category === category);
}
