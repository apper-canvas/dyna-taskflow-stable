import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import ProgressRing from '@/components/molecules/ProgressRing';

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  stats = {}, 
  onToggleFilters,
  showFilters = false 
}) => {
  const { totalTasks = 0, completedToday = 0, streak = 0, completionRate = 0 } = stats;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-gray-900">
              TaskFlow
            </h1>
            <p className="text-xs text-gray-500">Smart Task Management</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar 
            onSearch={onSearchChange}
            placeholder="Search tasks, categories..."
          />
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <ProgressRing 
              progress={completionRate} 
              size={50} 
              strokeWidth={3}
              color="#5B4AF7"
            />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {completionRate}% Complete
              </div>
              <div className="text-xs text-gray-500">
                {totalTasks} total tasks
              </div>
            </div>
          </motion.div>

          {/* Today's Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Calendar" size={14} className="text-success" />
              <span className="text-xs font-medium text-gray-600">Today</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {completedToday}
            </div>
            <div className="text-xs text-gray-500">completed</div>
          </motion.div>

          {/* Streak Counter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-warning/10 to-accent/10 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="Flame" size={14} className="text-accent" />
              <span className="text-xs font-medium text-gray-600">Streak</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {streak}
            </div>
            <div className="text-xs text-gray-500">
              day{streak !== 1 ? 's' : ''}
            </div>
          </motion.div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFilters}
            className={`
              p-2 rounded-lg transition-all duration-150
              ${showFilters 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            title="Toggle Filters"
          >
            <ApperIcon name="Filter" size={16} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;