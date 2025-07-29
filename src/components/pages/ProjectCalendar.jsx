import React from "react";
import Empty from "@/components/ui/Empty";

const ProjectCalendar = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Calendar</h1>
          <p className="text-gray-600 mt-1">Project events and milestones</p>
        </div>
      </div>

      <Empty
        icon="Calendar"
        title="No events scheduled"
        message="Schedule meetings, deadlines, and milestones to keep your project on track and your team informed."
        actionLabel="Add Event"
        onAction={() => {}}
      />
    </div>
  );
};

export default ProjectCalendar;