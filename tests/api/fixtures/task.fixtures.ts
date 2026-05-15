export function validTask(overrides: Record<string, unknown> = {}) {
  return {
    title: `Test Task ${Date.now()}`,
    description: 'A test task description',
    status: 'pending' as const,
    priority: 'medium' as const,
    ...overrides,
  };
}

export function invalidTask() {
  return {
    title: '',
    description: 'Missing title should fail',
  };
}

export function bulkTasks(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    title: `Bulk Task ${i + 1}`,
    description: `Bulk task description ${i + 1}`,
    status: (['pending', 'in_progress', 'completed'] as const)[i % 3],
    priority: (['low', 'medium', 'high'] as const)[i % 3],
  }));
}

export function xssPayloadTask() {
  return {
    title: '<script>alert("xss")</script>',
    description: '<img src=x onerror=alert("xss")>',
  };
}
