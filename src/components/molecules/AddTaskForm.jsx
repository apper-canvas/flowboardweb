import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { taskService } from "@/services/api/taskService";
const AddTaskForm = ({ onSubmit, onCancel, taskLists = [], selectedListId }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedList, setSelectedList] = useState(selectedListId || "");
  const [teamMembers, setTeamMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await taskService.getTeamMembers();
        setTeamMembers(members);
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    };
    loadTeamMembers();
  }, []);
  const handleSubmit = (e) => {
e.preventDefault();
    if (title.trim()) {
      setLoading(true);
      try {
        const taskData = {
          title: title.trim(),
          listId: selectedList || selectedListId || null,
          dueDate: dueDate || null,
          assigneeId: assigneeId ? parseInt(assigneeId) : null,
          notes: notes.trim()
        };
        
        onSubmit(taskData);
        
        // Reset form
        setTitle("");
        setDueDate("");
        setAssigneeId("");
        setNotes("");
        setSelectedList(selectedListId || "");
        setIsExpanded(false);
      } finally {
        setLoading(false);
      }
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
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="w-full"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (optional)
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To (optional)
            </label>
            <select 
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.Id} value={member.Id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {taskLists.length > 0 && !selectedListId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add to list (optional)
            </label>
            <select 
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="">No specific list</option>
              {taskLists.map((list) => (
                <option key={list.Id} value={list.Id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details or context..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
          />
        </div>
        
<div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!title.trim() || loading}
            >
              <ApperIcon name="Plus" size={14} className="mr-2" />
              {loading ? "Adding..." : "Add Task"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={onCancel || (() => {
                setIsExpanded(false);
                setTitle("");
                setDueDate("");
                setAssigneeId("");
                setNotes("");
                setSelectedList(selectedListId || "");
              })}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
          
          {(dueDate || assigneeId || notes.trim()) && (
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Info" size={12} className="mr-1" />
              Additional details added
            </div>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default AddTaskForm;