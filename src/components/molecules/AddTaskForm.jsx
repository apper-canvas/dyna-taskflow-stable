import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService } from '@/services/api/taskService';

const AddTaskForm = ({ categories = [], onTaskAdded, quickMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(!quickMode);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.Id.toString(),
    label: cat.name
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setLoading(true);
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        priority,
        categoryId: categoryId || null,
        dueDate: dueDate || null
      });
      
      onTaskAdded(newTask);
      
      // Reset form
      setTitle('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
      
      if (quickMode) {
        setIsExpanded(false);
      }
      
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      {quickMode && !isExpanded ? (
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add a new task...</span>
        </motion.button>
      ) : (
        <motion.form
          initial={quickMode ? { opacity: 0, height: 0 } : { opacity: 1 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="p-4 space-y-4"
        >
          {/* Title Input */}
          <Input
            label={!quickMode ? "Task Title" : ""}
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={quickMode ? handleQuickAdd : undefined}
            autoFocus
          />

          {/* Expanded Options */}
          <AnimatePresence>
            {(isExpanded || !quickMode) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority */}
                  <Select
                    label="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    options={priorityOptions}
                  />

                  {/* Category */}
                  <Select
                    label="Category"
                    placeholder="Select category..."
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    options={categoryOptions}
                  />
                </div>

                {/* Due Date */}
                <Input
                  label="Due Date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {quickMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Less' : 'More'} options
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {quickMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsExpanded(false);
                    setTitle('');
                    setPriority('medium');
                    setCategoryId('');
                    setDueDate('');
                  }}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon="Plus"
                disabled={loading || !title.trim()}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </Button>
            </div>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default AddTaskForm;