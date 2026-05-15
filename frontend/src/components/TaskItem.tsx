import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus, UpdateTaskInput } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, input: UpdateTaskInput) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const priorityColors: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="task-item" data-testid={`task-item-${task.id}`}>
      <div className="task-item-header">
        <Link to={`/tasks/${task.id}`} className="task-title" data-testid="task-title">
          {task.title}
        </Link>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
          data-testid="task-priority"
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="task-description" data-testid="task-description">
          {task.description}
        </p>
      )}
      <div className="task-item-footer">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          data-testid="task-status-select"
          className={`status-select status-${task.status}`}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-delete"
          data-testid="task-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
