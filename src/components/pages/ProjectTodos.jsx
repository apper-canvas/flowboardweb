import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TaskItem from "@/components/molecules/TaskItem";
import AddTaskForm from "@/components/molecules/AddTaskForm";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";

const ProjectTodos = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getByProjectId(parseInt(projectId));
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const handleAddTask = async (title) => {
    try {
      const newTask = await taskService.create({
        projectId: parseInt(projectId),
        title,
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      // Create activity
      await activityService.create({
        projectId: parseInt(projectId),
        action: "task_created",
        details: `Task "${title}" was created`,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed
      });
      
      setTasks(prevTasks =>
        prevTasks.map(t => t.Id === taskId ? updatedTask : t)
      );
      
      // Create activity
      await activityService.create({
        projectId: parseInt(projectId),
        action: updatedTask.completed ? "task_completed" : "task_reopened",
        details: `Task "${task.title}" was ${updatedTask.completed ? "completed" : "reopened"}`,
        timestamp: new Date().toISOString()
      });
      
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      await taskService.delete(taskId);
      
      setTasks(prevTasks => prevTasks.filter(t => t.Id !== taskId));
      
      // Create activity
      await activityService.create({
        projectId: parseInt(projectId),
        action: "task_deleted",
        details: `Task "${task.title}" was deleted`,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">To-Dos</h1>
          <p className="text-gray-600 mt-1">
            {tasks.length === 0 
              ? "No tasks yet" 
              : `${completedTasks.length} of ${tasks.length} tasks completed`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
        </div>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round((completedTasks.length / tasks.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </Card>
      )}

      {/* Add Task Form */}
      <AddTaskForm onSubmit={handleAddTask} />

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks yet"
          message="Create your first task to get started with this project."
          actionLabel="Add Task"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
                Pending ({pendingTasks.length})
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.Id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">
                Completed ({completedTasks.length})
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.Id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectTodos;