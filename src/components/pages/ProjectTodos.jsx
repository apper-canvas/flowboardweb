import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { taskListService } from "@/services/api/taskListService";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import AddTaskForm from "@/components/molecules/AddTaskForm";
import TaskItem from "@/components/molecules/TaskItem";
import TaskListForm from "@/components/molecules/TaskListForm";
import TaskListItem from "@/components/molecules/TaskListItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ProjectTodos = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showListForm, setShowListForm] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, listsData] = await Promise.all([
        taskService.getByProjectId(parseInt(projectId)),
        taskListService.getByProjectId(parseInt(projectId))
      ]);
      
      setTasks(tasksData);
      setTaskLists(listsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleCreateList = async (listData) => {
    try {
      const newList = await taskListService.create({
        projectId: parseInt(projectId),
        ...listData,
        isCollapsed: false
      });
      
      setTaskLists(prevLists => [...prevLists, newList]);
      setShowListForm(false);
      
      await activityService.create({
        projectId: parseInt(projectId),
        action: "list_created",
        details: `Task list "${listData.name}" was created`,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Task list created successfully!");
    } catch (err) {
      toast.error("Failed to create task list");
    }
  };

  const handleEditList = async (listData) => {
    try {
      const updatedList = await taskListService.update(editingList.Id, listData);
      
      setTaskLists(prevLists => 
        prevLists.map(list => list.Id === editingList.Id ? updatedList : list)
      );
      setEditingList(null);
      
      await activityService.create({
        projectId: parseInt(projectId),
        action: "list_updated",
        details: `Task list "${listData.name}" was updated`,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Task list updated successfully!");
    } catch (err) {
      toast.error("Failed to update task list");
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const list = taskLists.find(l => l.Id === listId);
      await taskListService.delete(listId);
      
      setTaskLists(prevLists => prevLists.filter(l => l.Id !== listId));
      
      await activityService.create({
        projectId: parseInt(projectId),
        action: "list_deleted",
        details: `Task list "${list.name}" was deleted`,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Task list deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task list");
    }
  };

  const handleToggleListCollapse = async (listId) => {
    try {
      const list = taskLists.find(l => l.Id === listId);
      const updatedList = await taskListService.update(listId, {
        ...list,
        isCollapsed: !list.isCollapsed
      });
      
      setTaskLists(prevLists =>
        prevLists.map(l => l.Id === listId ? updatedList : l)
      );
    } catch (err) {
      toast.error("Failed to update list");
    }
  };

  const handleAddTask = async (title, listId = null) => {
    try {
      const newTask = await taskService.create({
        projectId: parseInt(projectId),
        listId: listId,
        title,
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      const listName = listId ? taskLists.find(l => l.Id === listId)?.name : null;
      await activityService.create({
        projectId: parseInt(projectId),
        action: "task_created",
        details: `Task "${title}" was created${listName ? ` in ${listName}` : ''}`,
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
  if (error) return <Error message={error} onRetry={loadData} />;

  const completedTasks = tasks.filter(task => task.completed);
  const unlistedTasks = tasks.filter(task => !task.listId);

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
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowListForm(true)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>New List</span>
          </Button>
          <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
        </div>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Overall Progress</span>
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

      {/* New List Form */}
      {showListForm && (
        <TaskListForm
          onSubmit={handleCreateList}
          onCancel={() => setShowListForm(false)}
        />
      )}

      {/* Edit List Form */}
      {editingList && (
        <TaskListForm
          initialData={editingList}
          onSubmit={handleEditList}
          onCancel={() => setEditingList(null)}
        />
      )}

      {/* Task Lists */}
      {taskLists.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {taskLists.map((taskList) => {
              const listTasks = tasks.filter(task => task.listId === taskList.Id);
              return (
                <TaskListItem
                  key={taskList.Id}
                  taskList={taskList}
                  tasks={listTasks}
                  onToggleCollapse={handleToggleListCollapse}
                  onDeleteList={handleDeleteList}
                  onEditList={setEditingList}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Unlisted Tasks */}
      {unlistedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Other Tasks ({unlistedTasks.length})
            </h2>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <AnimatePresence>
              {unlistedTasks.map((task) => (
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

      {/* General Add Task Form */}
      {!showListForm && !editingList && (
        <AddTaskForm 
          onSubmit={handleAddTask} 
          taskLists={taskLists}
        />
      )}

      {/* Empty State */}
      {tasks.length === 0 && taskLists.length === 0 && (
        <Empty
          icon="CheckSquare"
          title="No tasks or lists yet"
          message="Create your first task list to organize your project tasks."
          actionLabel="Create List"
          onAction={() => setShowListForm(true)}
        />
      )}
    </div>
  );
};
export default ProjectTodos;