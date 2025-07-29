import React, { useState } from "react";
import { motion } from "framer-motion";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ projects, activeProject, onProjectSelect }) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Layers" size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 font-display">FlowBoard</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-2">
          {/* Projects Section */}
          <div className="mb-6">
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center w-full px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
            >
              <ApperIcon 
                name={isProjectsExpanded ? "ChevronDown" : "ChevronRight"} 
                size={14} 
                className="mr-2" 
              />
              Projects
            </button>
            
            {isProjectsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="mt-2 space-y-1 ml-4"
              >
                {projects.map((project) => (
                  <button
                    key={project.Id}
                    onClick={() => onProjectSelect(project)}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      activeProject?.Id === project.Id
                        ? "bg-primary-50 text-primary-700 border-l-2 border-primary-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <ApperIcon name="Folder" size={16} className="mr-3 flex-shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Project Navigation - Only show if project is selected */}
          {activeProject && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {activeProject.name}
              </div>
              
              <NavItem to={`/projects/${activeProject.Id}/overview`} icon="BarChart3">
                Overview
              </NavItem>
              
              <NavItem to={`/projects/${activeProject.Id}/todos`} icon="CheckSquare">
                To-Dos
              </NavItem>
              
              <NavItem to={`/projects/${activeProject.Id}/messages`} icon="MessageSquare">
                Messages
              </NavItem>
              
              <NavItem to={`/projects/${activeProject.Id}/files`} icon="FileText">
                Files
              </NavItem>
              
              <NavItem to={`/projects/${activeProject.Id}/calendar`} icon="Calendar">
                Calendar
              </NavItem>
              
              <NavItem to={`/projects/${activeProject.Id}/people`} icon="Users" badge={activeProject.memberCount}>
                People
              </NavItem>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;