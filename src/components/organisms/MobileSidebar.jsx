import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const MobileSidebar = ({ isOpen, onClose, projects, activeProject, onProjectSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Layers" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 font-display">FlowBoard</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <div className="py-6">
              <nav className="px-4 space-y-2">
                {/* Projects */}
                <div className="mb-6">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Projects
                  </div>
                  <div className="mt-2 space-y-1">
                    {projects.map((project) => (
                      <button
                        key={project.Id}
                        onClick={() => {
                          onProjectSelect(project);
                          onClose();
                        }}
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
                  </div>
                </div>

                {/* Project Navigation */}
                {activeProject && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {activeProject.name}
                    </div>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/overview`} 
                      icon="BarChart3"
                      onClick={onClose}
                    >
                      Overview
                    </NavItem>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/todos`} 
                      icon="CheckSquare"
                      onClick={onClose}
                    >
                      To-Dos
                    </NavItem>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/messages`} 
                      icon="MessageSquare"
                      onClick={onClose}
                    >
                      Messages
                    </NavItem>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/files`} 
                      icon="FileText"
                      onClick={onClose}
                    >
                      Files
                    </NavItem>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/calendar`} 
                      icon="Calendar"
                      onClick={onClose}
                    >
                      Calendar
                    </NavItem>
                    
                    <NavItem 
                      to={`/projects/${activeProject.Id}/people`} 
                      icon="Users" 
                      badge={activeProject.memberCount}
                      onClick={onClose}
                    >
                      People
                    </NavItem>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;