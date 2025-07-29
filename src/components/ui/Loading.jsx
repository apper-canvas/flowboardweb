import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "tasks") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "overview") {
    return (
      <div className="space-y-6">
        {/* Project Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  );
};

export default Loading;