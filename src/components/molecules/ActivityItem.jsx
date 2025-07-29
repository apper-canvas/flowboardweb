import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (action) => {
    switch (action) {
      case "task_created":
        return "Plus";
      case "task_completed":
        return "CheckCircle";
      case "task_deleted":
        return "Trash2";
      case "project_created":
        return "FolderPlus";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "task_created":
        return "text-blue-500 bg-blue-50";
      case "task_completed":
        return "text-green-500 bg-green-50";
      case "task_deleted":
        return "text-red-500 bg-red-50";
      case "project_created":
        return "text-purple-500 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className={`p-1.5 rounded-full ${getActivityColor(activity.action)}`}>
        <ApperIcon name={getActivityIcon(activity.action)} size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {activity.details}
        </p>
        <p className="text-xs text-gray-500">
          {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;