import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message, onRetry }) => {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;