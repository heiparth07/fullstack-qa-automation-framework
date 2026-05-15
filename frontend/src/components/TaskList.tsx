import { Task, UpdateTaskInput } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: number, input: UpdateTaskInput) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

export function TaskList({ tasks, loading, error, onUpdate, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="task-list-loading" data-testid="loading-indicator">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-error" data-testid="error-message">
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty" data-testid="empty-state">
        No tasks found. Create one above!
      </div>
    );
  }

  return (
    <div className="task-list" data-testid="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
