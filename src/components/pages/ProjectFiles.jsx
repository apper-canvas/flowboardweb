import React from "react";
import Empty from "@/components/ui/Empty";

const ProjectFiles = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Files</h1>
          <p className="text-gray-600 mt-1">Project documents and attachments</p>
        </div>
      </div>

      <Empty
        icon="FileText"
        title="No files uploaded"
        message="Upload documents, images, and other files to share with your team and keep everything organized."
        actionLabel="Upload File"
        onAction={() => {}}
      />
    </div>
  );
};

export default ProjectFiles;