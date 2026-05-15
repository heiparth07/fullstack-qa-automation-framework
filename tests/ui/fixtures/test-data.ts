export const testTasks = {
  basic: {
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and butter',
    priority: 'medium' as const,
  },
  highPriority: {
    title: 'Deploy hotfix',
    description: 'Critical production bug needs immediate fix',
    priority: 'high' as const,
  },
  lowPriority: {
    title: 'Clean desk',
    description: 'Organize workspace',
    priority: 'low' as const,
  },
  noDescription: {
    title: 'Quick reminder',
    priority: 'medium' as const,
  },
  longTitle: {
    title: 'This is a task with a reasonably long title that should still display correctly',
    description: 'Testing long content rendering',
    priority: 'medium' as const,
  },
};

export const editData = {
  updatedTitle: 'Updated task title',
  updatedDescription: 'This description has been updated',
};
