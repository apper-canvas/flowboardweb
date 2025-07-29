import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const { taskService } = await import("@/services/api/taskService");
        const members = await taskService.getTeamMembers();
        setTeamMembers(members);
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    };
    loadTeamMembers();
  }, []);

  const assignee = teamMembers.find(member => member.Id === task.assigneeId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = task.dueDate && !task.completed && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000); // Due within 24 hours

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
<div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.Id)}
            className="flex-shrink-0 mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    task.completed 
                      ? "text-gray-500 line-through" 
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>
                    Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                  </span>
                  
                  {task.dueDate && (
                    <div className={`flex items-center space-x-1 ${
                      isOverdue ? 'text-red-600' : isDueSoon ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      <ApperIcon name="Calendar" size={12} />
                      <span>
                        Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                        {isOverdue && " (Overdue)"}
                        {isDueSoon && " (Due Soon)"}
                      </span>
                    </div>
                  )}
                  
                  {assignee && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="User" size={12} />
                      <span>{assignee.name}</span>
                    </div>
                  )}
                </div>

                {task.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <div className="flex items-start space-x-1">
                      <ApperIcon name="FileText" size={12} className="mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2">{task.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 ml-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.Id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;