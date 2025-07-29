import React from "react";
import Empty from "@/components/ui/Empty";

const ProjectMessages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Messages</h1>
          <p className="text-gray-600 mt-1">Team communication and discussions</p>
        </div>
      </div>

      <Empty
        icon="MessageSquare"
        title="No messages yet"
        message="Team messages and discussions will appear here. Start a conversation to collaborate with your team."
        actionLabel="Start Conversation"
        onAction={() => {}}
      />
    </div>
  );
};

export default ProjectMessages;