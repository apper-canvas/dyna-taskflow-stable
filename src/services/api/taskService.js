import mockTasks from '../mockData/tasks.json';
import mockCategories from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...mockTasks];
let categories = [...mockCategories];

export const taskService = {
  async getAll() {
    await delay(200);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      Id: tasks[taskIndex].Id, // Preserve original ID
      completedAt: updates.completed && !tasks[taskIndex].completed 
        ? new Date().toISOString() 
        : updates.completed === false 
          ? null 
          : tasks[taskIndex].completedAt
    };
    
    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    return { ...deletedTask };
  },

  async bulkUpdate(taskIds, updates) {
    await delay(400);
    const updatedTasks = [];
    
    for (const id of taskIds) {
      const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          ...updates,
          Id: tasks[taskIndex].Id,
          completedAt: updates.completed && !tasks[taskIndex].completed 
            ? new Date().toISOString() 
            : updates.completed === false 
              ? null 
              : tasks[taskIndex].completedAt
        };
        tasks[taskIndex] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  },

  async bulkDelete(taskIds) {
    await delay(400);
    const deletedTasks = [];
    
    // Sort IDs in descending order to avoid index issues when removing
    const sortedIds = taskIds.map(id => parseInt(id, 10)).sort((a, b) => b - a);
    
    for (const id of sortedIds) {
      const taskIndex = tasks.findIndex(t => t.Id === id);
      if (taskIndex !== -1) {
        const deletedTask = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        deletedTasks.push({ ...deletedTask });
      }
    }
    
    return deletedTasks;
  },

  async getStats() {
    await delay(200);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    const completedToday = tasks.filter(t => 
      t.completedAt && t.completedAt.split('T')[0] === todayStr
    );
    
    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    const date = new Date(today);
    
    while (streak < 365) { // Max 365 days lookback
      const dateStr = date.toISOString().split('T')[0];
      const hasCompletedTasks = tasks.some(t => 
        t.completedAt && t.completedAt.split('T')[0] === dateStr
      );
      
      if (hasCompletedTasks) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    
    return {
      totalTasks,
      completedToday: completedToday.length,
      streak,
      completionRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0
    };
  },

  async getCategories() {
    await delay(200);
    // Calculate task counts for each category
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(t => t.categoryId === category.Id.toString()).length
    }));
    return [...categoriesWithCounts];
  }
};