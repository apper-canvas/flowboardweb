import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  message = "Get started by creating something new.", 
  actionLabel,
  onAction 
}) => {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} size={24} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;