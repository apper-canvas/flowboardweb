import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task.Id)}
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <p 
            className={`text-sm font-medium transition-colors duration-200 ${
              task.completed 
                ? "text-gray-500 line-through" 
                : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Created {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
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
    </motion.div>
  );
};

export default TaskItem;