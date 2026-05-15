import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority } from '../types';
import { taskApi } from '../api/taskApi';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskApi.getById(Number(id));
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
        setPriority(data.priority);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!task) return;
    const updated = await taskApi.update(task.id, { title, description, status, priority });
    setTask(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!task || !window.confirm('Delete this task?')) return;
    await taskApi.delete(task.id);
    navigate('/');
  };

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (!task) return <div data-testid="not-found">Task not found</div>;

  return (
    <div className="task-detail" data-testid="task-detail">
      <button onClick={() => navigate('/')} className="btn-back" data-testid="back-btn">
        Back to List
      </button>

      {editing ? (
        <div className="task-edit-form" data-testid="edit-form">
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="edit-title-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="edit-description-input"
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-status">Status</label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              data-testid="edit-status-select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="edit-priority">Priority</label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              data-testid="edit-priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="btn-group">
            <button onClick={handleSave} data-testid="save-btn">
              Save
            </button>
            <button onClick={() => setEditing(false)} data-testid="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-view">
          <h1 data-testid="detail-title">{task.title}</h1>
          <p data-testid="detail-description">{task.description || 'No description'}</p>
          <div className="task-meta">
            <span data-testid="detail-status">Status: {task.status}</span>
            <span data-testid="detail-priority">Priority: {task.priority}</span>
            <span data-testid="detail-created">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="btn-group">
            <button onClick={() => setEditing(true)} data-testid="edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} className="btn-delete" data-testid="delete-btn">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
