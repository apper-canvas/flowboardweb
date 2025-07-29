import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const ProjectPeople = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getById(parseInt(projectId));
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProject} />;
  if (!project) return <Error message="Project not found" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">People</h1>
          <p className="text-gray-600 mt-1">Team members and collaborators</p>
        </div>
      </div>

      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Users" size={24} className="text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
          Team Members
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This project has <strong>{project.memberCount} team members</strong> collaborating together.
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="UserPlus" size={16} />
            <span>Invite members</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Settings" size={16} />
            <span>Manage permissions</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectPeople;