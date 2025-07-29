import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const colorOptions = [
  { value: "#EC4899", label: "Pink", class: "bg-pink-500" },
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#F59E0B", label: "Yellow", class: "bg-yellow-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#6B7280", label: "Gray", class: "bg-gray-500" },
];

const TaskListForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState(initialData?.color || colorOptions[0].value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        color
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            List Name
          </label>
          <Input
            type="text"
            placeholder="e.g. Marketing Tasks, Development, Research"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <Input
            type="text"
            placeholder="Brief description of this task list"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex items-center space-x-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`w-8 h-8 rounded-full ${option.class} ${
                  color === option.value 
                    ? 'ring-2 ring-offset-2 ring-gray-400' 
                    : 'hover:scale-110'
                } transition-all duration-200`}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button type="submit" size="sm" disabled={!name.trim()}>
            <ApperIcon name={initialData ? "Save" : "Plus"} size={14} className="mr-2" />
            {initialData ? "Save Changes" : "Create List"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default TaskListForm;