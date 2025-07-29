import React from "react";
import ProjectSwitcher from "@/components/molecules/ProjectSwitcher";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ 
  projects, 
  activeProject, 
  onProjectChange, 
  onMobileMenuToggle,
  showMobileMenu = true 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
          )}
          
          <div className="flex-1">
            <ProjectSwitcher
              projects={projects}
              activeProject={activeProject}
              onProjectChange={onProjectChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Search" size={18} />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Bell" size={18} />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;