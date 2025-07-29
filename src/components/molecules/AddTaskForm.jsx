import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const AddTaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 group"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <ApperIcon name="Plus" size={14} className="text-white" />
        </div>
        <span className="text-gray-600 group-hover:text-primary-600 font-medium">
          Add a new task...
        </span>
      </button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
    >
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="w-full"
        />
        <div className="flex items-center space-x-2">
          <Button type="submit" size="sm" disabled={!title.trim()}>
            <ApperIcon name="Plus" size={14} className="mr-2" />
            Add Task
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setIsExpanded(false);
              setTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default AddTaskForm;