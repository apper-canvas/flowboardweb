import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ActivityItem from "@/components/molecules/ActivityItem";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";

const ProjectOverview = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectData, tasksData, activitiesData] = await Promise.all([
        projectService.getById(parseInt(projectId)),
        taskService.getByProjectId(parseInt(projectId)),
        activityService.getByProjectId(parseInt(projectId))
      ]);
      
      setProject(projectData);
      setTasks(tasksData);
      setActivities(activitiesData);
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

  if (loading) return <Loading type="overview" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return <Error message="Project not found" />;

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 font-display">{project.name}</h1>
          <p className="text-purple-100 text-lg">{project.description}</p>
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} />
              <span>Created {format(new Date(project.createdAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={16} />
              <span>{project.memberCount} members</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="CheckSquare" size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completionRate}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 font-display">Recent Activity</h2>
            <ApperIcon name="Activity" size={20} className="text-gray-400" />
          </div>
          
          {activities.length === 0 ? (
            <Empty
              icon="Activity"
              title="No activity yet"
              message="Project activity will appear here as your team starts working."
            />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activities.slice(0, 10).map((activity) => (
                <ActivityItem key={activity.Id} activity={activity} />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectOverview;