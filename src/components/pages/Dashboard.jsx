import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import AddTaskForm from "@/components/molecules/AddTaskForm";
import FilterToolbar from "@/components/molecules/FilterToolbar";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/atoms/ApperIcon";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
  // Data state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    date: 'all'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [tasksData, categoriesData, statsData] = await Promise.all([
          taskService.getAll(),
          taskService.getCategories(),
          taskService.getStats()
        ]);
        
        setTasks(tasksData);
        setCategories(categoriesData);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh stats when tasks change
  useEffect(() => {
    const refreshStats = async () => {
      try {
        const statsData = await taskService.getStats();
        setStats(statsData);
      } catch (err) {
        console.error('Failed to refresh stats:', err);
      }
    };

    if (tasks.length > 0) {
      refreshStats();
    }
  }, [tasks]);

  // Event handlers
  const handleTaskAdded = useCallback((newTask) => {
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const handleTaskUpdate = useCallback((updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  }, []);

  const handleTaskDelete = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      date: 'all'
    });
    setSelectedCategory('all');
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setFilters(prev => ({ ...prev, category: categoryId }));
  }, []);

  // Apply category filter from sidebar
  const effectiveFilters = {
    ...filters,
    category: selectedCategory
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="space-y-1">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-48 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex gap-4">
                <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 p-6 bg-gray-50">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
              <div className="h-16 bg-gray-200 rounded-lg"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md"
        >
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-error" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200"
        >
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            tasks={tasks}
          />
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Add Task Form */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AddTaskForm
                  categories={categories}
                  onTaskAdded={handleTaskAdded}
                  quickMode={true}
                />
              </motion.div>

              {/* Filter Toolbar */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FilterToolbar
                      filters={effectiveFilters}
                      onFilterChange={handleFilterChange}
                      onClearFilters={handleClearFilters}
                      categories={categories}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TaskList
                  tasks={tasks}
                  categories={categories}
                  filters={effectiveFilters}
                  searchQuery={searchQuery}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  showBulkActions={true}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;