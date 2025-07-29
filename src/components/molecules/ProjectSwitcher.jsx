import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";

const ProjectSwitcher = ({ projects, activeProject, onProjectChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectSelect = (project) => {
    onProjectChange(project);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-left w-full hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate font-display">
            {activeProject?.name || "Select Project"}
          </h1>
          <p className="text-sm text-gray-500 truncate">
            {activeProject?.description || "No project selected"}
          </p>
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-400 flex-shrink-0" 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto"
            >
              {projects.map((project) => (
                <button
                  key={project.Id}
                  onClick={() => handleProjectSelect(project)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    activeProject?.Id === project.Id ? "bg-primary-50 border-l-4 border-primary-500" : ""
                  }`}
                >
                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500 truncate">{project.description}</div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSwitcher;