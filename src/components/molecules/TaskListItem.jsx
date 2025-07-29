import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TaskItem from "@/components/molecules/TaskItem";
import AddTaskForm from "@/components/molecules/AddTaskForm";

const TaskListItem = ({ 
  taskList, 
  tasks, 
  onToggleCollapse, 
  onDeleteList, 
  onEditList,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAddTask = async (title) => {
    try {
      await onAddTask(title, taskList.Id);
      setShowAddForm(false);
      toast.success("Task added to list!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const handleDeleteList = () => {
    if (tasks.length > 0) {
      toast.error("Cannot delete list with tasks. Move or delete tasks first.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${taskList.name}"?`)) {
      onDeleteList(taskList.Id);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <motion.div
      layout
      className="bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => onToggleCollapse(taskList.Id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <ApperIcon 
              name={taskList.isCollapsed ? "ChevronRight" : "ChevronDown"} 
              size={16}
              className="text-gray-500"
            />
          </button>
          
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: taskList.color }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 font-display truncate">
              {taskList.name}
            </h3>
            {taskList.description && (
              <p className="text-sm text-gray-600 truncate">
                {taskList.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {tasks.length > 0 && (
              <span>
                {completedTasks.length}/{tasks.length} completed
              </span>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <ApperIcon name="MoreVertical" size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" size={14} />
                    <span>Add Task</span>
                  </button>
                  <button
                    onClick={() => {
                      onEditList(taskList);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit2" size={14} />
                    <span>Edit List</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      handleDeleteList();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" size={14} />
                    <span>Delete List</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!taskList.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Add Task Form */}
              {showAddForm && (
                <AddTaskForm 
                  onSubmit={handleAddTask} 
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              {/* Quick Add Button */}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center space-x-2 p-3 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-700"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="text-sm">Add task to {taskList.name}</span>
                </button>
              )}

              {/* Tasks */}
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {/* Pending Tasks */}
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.Id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                  
                  {/* Completed Tasks */}
                  {completedTasks.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-500 font-medium">
                          COMPLETED ({completedTasks.length})
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      
                      <div className="space-y-2 opacity-75">
                        {completedTasks.map((task) => (
                          <TaskItem
                            key={task.Id}
                            task={task}
                            onToggle={onToggleTask}
                            onDelete={onDeleteTask}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <ApperIcon name="CheckSquare" size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks in this list yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default TaskListItem;