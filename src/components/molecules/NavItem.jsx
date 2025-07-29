import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, badge, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="nav-item w-full text-left"
      >
        <ApperIcon name={icon} size={18} className="mr-3 flex-shrink-0" />
        <span className="flex-1">{children}</span>
        {badge && (
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item",
          isActive && "nav-item-active"
        )
      }
    >
      <ApperIcon name={icon} size={18} className="mr-3 flex-shrink-0" />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="ml-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default NavItem;