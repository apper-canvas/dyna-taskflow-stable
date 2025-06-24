import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { taskService } from '@/services/api/taskService';

const TaskItem = ({ 
  task, 
  categories = [], 
  selected = false, 
  onSelect, 
  onUpdate,
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const category = categories.find(c => c.Id.toString() === task.categoryId);
  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !task.completed;
  const isDueToday = dueDate && isToday(dueDate);

  const handleToggleComplete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      
      if (!task.completed) {
        // Show confetti animation for completion
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 500);
        toast.success('Task completed! 🎉');
      }
      
      onUpdate(updatedTask);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }

    setLoading(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        title: editTitle.trim()
      });
      onUpdate(updatedTask);
      setIsEditing(false);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      setEditTitle(task.title);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await taskService.delete(task.Id);
      onDelete(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.01 }}
      className={`
        relative bg-white rounded-lg p-4 shadow-sm border transition-all duration-150
        ${selected ? 'ring-2 ring-primary border-primary' : 'border-gray-200 hover:shadow-md'}
        ${task.completed ? 'opacity-75' : ''}
      `}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -right-2 z-10"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-confetti" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          disabled={loading}
          className="mt-0.5 flex-shrink-0"
        >
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
            ${task.completed 
              ? 'bg-primary border-primary' 
              : 'border-gray-300 hover:border-primary'
            }
          `}>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white"
              >
                <ApperIcon name="Check" size={12} />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Selection Checkbox */}
        {onSelect && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(task.Id);
            }}
            className="mt-0.5 flex-shrink-0"
          >
            <div className={`
              w-4 h-4 rounded border flex items-center justify-center transition-all duration-200
              ${selected 
                ? 'bg-primary border-primary' 
                : 'border-gray-300 hover:border-primary'
              }
            `}>
              {selected && (
                <ApperIcon name="Check" size={10} className="text-white" />
              )}
            </div>
          </motion.button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="flex-1 text-gray-900 font-medium bg-transparent border-b border-primary focus:outline-none"
                autoFocus
              />
            ) : (
              <h3 
                className={`
                  flex-1 text-gray-900 font-medium cursor-pointer break-words
                  ${task.completed ? 'line-through text-gray-500' : ''}
                `}
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </h3>
            )}
            
            {/* Priority Badge */}
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {/* Category */}
            {category && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            )}

            {/* Due Date */}
            {dueDate && (
              <div className={`
                flex items-center gap-1
                ${isOverdue ? 'text-error font-medium' : isDueToday ? 'text-warning font-medium' : ''}
              `}>
                <ApperIcon name="Calendar" size={12} />
                <span>
                  {isToday(dueDate) ? 'Today' : format(dueDate, 'MMM d')}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={12} />
              <span>{format(parseISO(task.createdAt), 'MMM d')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-primary rounded"
            title="Edit task"
          >
            <ApperIcon name="Edit2" size={14} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-error rounded"
            title="Delete task"
            disabled={loading}
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;