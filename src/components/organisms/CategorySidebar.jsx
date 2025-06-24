import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategorySidebar = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect,
  tasks = [] 
}) => {
  // Calculate task counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    taskCount: tasks.filter(task => task.categoryId === category.Id.toString()).length,
    completedCount: tasks.filter(task => 
      task.categoryId === category.Id.toString() && task.completed
    ).length
  }));

  // Add "All Tasks" option
  const allTasksOption = {
    Id: 'all',
    name: 'All Tasks',
    color: '#6b7280',
    taskCount: tasks.length,
    completedCount: tasks.filter(task => task.completed).length
  };

  const menuItems = [allTasksOption, ...categoriesWithCounts];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit"
    >
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="Folder" size={16} className="text-gray-500" />
        <h2 className="font-medium text-gray-700">Categories</h2>
      </div>

      <div className="space-y-2">
        {menuItems.map((category, index) => {
          const isSelected = selectedCategory === category.Id.toString();
          const completionRate = category.taskCount > 0 
            ? Math.round((category.completedCount / category.taskCount) * 100) 
            : 0;

          return (
            <motion.button
              key={category.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategorySelect(category.Id.toString())}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-150
                ${isSelected 
                  ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                  : 'hover:bg-gray-50 border border-transparent'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`
                    font-medium text-sm
                    ${isSelected ? 'text-primary' : 'text-gray-700'}
                  `}>
                    {category.name}
                  </span>
                </div>
                
                {category.taskCount > 0 && (
                  <Badge variant={isSelected ? 'primary' : 'default'} size="sm">
                    {category.taskCount}
                  </Badge>
                )}
              </div>

              {/* Progress bar */}
              {category.taskCount > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{category.completedCount} completed</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-1 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-4 border-t border-gray-200"
      >
        <h3 className="text-xs font-medium text-gray-500 mb-2">Quick Stats</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Total Tasks</span>
            <span className="font-medium">{tasks.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-medium text-success">
              {tasks.filter(t => t.completed).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="font-medium text-warning">
              {tasks.filter(t => !t.completed).length}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategorySidebar;