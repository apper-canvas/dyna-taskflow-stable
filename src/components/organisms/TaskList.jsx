import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';
import TaskItem from '@/components/molecules/TaskItem';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  filters,
  searchQuery,
  onTaskUpdate,
  onTaskDelete,
  showBulkActions = false 
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('created'); // created, dueDate, priority, title

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        categories.find(c => c.Id.toString() === task.categoryId)?.name.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => 
        filters.status === 'completed' ? task.completed : !task.completed
      );
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.categoryId === filters.category);
    }

    if (filters.date !== 'all') {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return filters.date === 'upcoming';
        
        const dueDate = parseISO(task.dueDate);
        switch (filters.date) {
          case 'today':
            return isToday(dueDate);
          case 'overdue':
            return isPast(dueDate) && !task.completed;
          case 'upcoming':
            return isFuture(dueDate) || !task.dueDate;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [tasks, searchQuery, filters, categories]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    
    switch (sortBy) {
      case 'dueDate':
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'created':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredTasks, sortBy]);

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === sortedTasks.length 
        ? [] 
        : sortedTasks.map(task => task.Id)
    );
  };

  const sortOptions = [
    { value: 'created', label: 'Date Created', icon: 'Clock' },
    { value: 'dueDate', label: 'Due Date', icon: 'Calendar' },
    { value: 'priority', label: 'Priority', icon: 'AlertTriangle' },
    { value: 'title', label: 'Title', icon: 'Type' }
  ];

  if (sortedTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" size={48} className="text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {searchQuery || Object.values(filters).some(f => f !== 'all') 
            ? 'No tasks match your filters' 
            : 'No tasks yet'
          }
        </h3>
        <p className="text-gray-500 mb-6">
          {searchQuery || Object.values(filters).some(f => f !== 'all')
            ? 'Try adjusting your search or filters'
            : 'Create your first task to get started with your productivity journey'
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Bulk Selection */}
          {showBulkActions && (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
              >
                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center transition-all
                  ${selectedTasks.length === sortedTasks.length 
                    ? 'bg-primary border-primary' 
                    : selectedTasks.length > 0
                      ? 'bg-primary/20 border-primary'
                      : 'border-gray-300'
                  }
                `}>
                  {selectedTasks.length === sortedTasks.length && (
                    <ApperIcon name="Check" size={10} className="text-white" />
                  )}
                  {selectedTasks.length > 0 && selectedTasks.length < sortedTasks.length && (
                    <ApperIcon name="Minus" size={10} className="text-primary" />
                  )}
                </div>
                <span>
                  {selectedTasks.length > 0 
                    ? `${selectedTasks.length} selected` 
                    : 'Select All'
                  }
                </span>
              </motion.button>
            </div>
          )}

          {/* Task Count */}
          <span className="text-sm text-gray-500">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/5 border border-primary/20 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Check"
                  onClick={() => {
                    // Handle bulk complete
                    selectedTasks.forEach(taskId => {
                      const task = tasks.find(t => t.Id === taskId);
                      if (task && !task.completed) {
                        onTaskUpdate({ ...task, completed: true });
                      }
                    });
                    setSelectedTasks([]);
                  }}
                >
                  Complete
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => {
                    // Handle bulk delete
                    selectedTasks.forEach(taskId => {
                      onTaskDelete(taskId);
                    });
                    setSelectedTasks([]);
                  }}
                >
                  Delete
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedTasks([])}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Items */}
      <motion.div 
        className="space-y-3"
        layout
      >
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <TaskItem
                task={task}
                categories={categories}
                selected={selectedTasks.includes(task.Id)}
                onSelect={showBulkActions ? handleSelectTask : undefined}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TaskList;