import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

export function HomePage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { tasks, pagination, loading, error, createTask, updateTask, deleteTask } = useTasks({
    page,
    limit: 10,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  return (
    <div className="home-page">
      <TaskForm
        onSubmit={async (input) => {
          await createTask(input);
          setPage(1);
        }}
      />

      <section className="task-section">
        <div className="filters" data-testid="filters">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            data-testid="filter-status"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            data-testid="filter-priority"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination" data-testid="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              data-testid="prev-page"
            >
              Previous
            </button>
            <span data-testid="page-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              data-testid="next-page"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
