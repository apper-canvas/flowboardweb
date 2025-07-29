import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { messageService } from "@/services/api/messageService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const MessageModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), message: message.trim() });
      setTitle("");
      setMessage("");
      onClose();
      toast.success("Message thread created successfully");
    } catch (error) {
      toast.error("Failed to create message thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 font-display">New Message Thread</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thread Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter thread title..."
              className="w-full"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting || !title.trim() || !message.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ThreadCard = ({ thread, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 p-4"
      onClick={() => onClick(thread)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate font-display">
            {thread.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Started by {thread.author}
          </p>
          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center">
              <ApperIcon name="MessageCircle" size={14} className="mr-1" />
              {thread.replyCount} replies
            </span>
            <span className="flex items-center">
              <ApperIcon name="Clock" size={14} className="mr-1" />
              {new Date(thread.lastActivity).toLocaleDateString()}
            </span>
          </div>
        </div>
        <ApperIcon name="ChevronRight" size={16} className="text-gray-400 mt-1" />
      </div>
    </Card>
  </motion.div>
);

const MessageBubble = ({ message, isOwn = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
      isOwn 
        ? 'bg-gradient-primary text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${
          isOwn ? 'text-white/80' : 'text-gray-600'
        }`}>
          {message.author}
        </span>
        <span className={`text-xs ${
          isOwn ? 'text-white/60' : 'text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{message.content}</p>
    </div>
  </motion.div>
);

const ProjectMessages = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getAllThreads();
      setThreads(data);
    } catch (err) {
      setError("Failed to load message threads");
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadThreadMessages = async (threadId) => {
    try {
      const messages = await messageService.getThreadMessages(threadId);
      setThreadMessages(messages);
    } catch (err) {
      toast.error("Failed to load thread messages");
    }
  };

  const handleCreateThread = async (threadData) => {
    const newThread = await messageService.createThread(threadData);
    setThreads(prev => [newThread, ...prev]);
  };

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
    loadThreadMessages(thread.Id);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const reply = await messageService.addReply(selectedThread.Id, {
        content: replyText.trim()
      });
      
      setThreadMessages(prev => [...prev, reply]);
      setReplyText("");
      
      // Update thread reply count
      setThreads(prev =>
        prev.map(thread =>
          thread.Id === selectedThread.Id
            ? { ...thread, replyCount: thread.replyCount + 1, lastActivity: new Date().toISOString() }
            : thread
        )
      );
      
      toast.success("Reply added successfully");
    } catch (err) {
      toast.error("Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadThreads} />;

  if (selectedThread) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedThread(null);
              setThreadMessages([]);
            }}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Messages</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 font-display mb-2">
            {selectedThread.title}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Started by {selectedThread.author} • {threadMessages.length} messages
          </p>

          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            <AnimatePresence>
              {threadMessages.map((message) => (
                <MessageBubble
                  key={message.Id}
                  message={message}
                  isOwn={message.author === "You"}
                />
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleReplySubmit} className="border-t pt-4">
            <div className="flex space-x-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!replyText.trim() || isSubmittingReply}
                className="self-end"
              >
                {isSubmittingReply ? "Sending..." : "Reply"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Messages</h1>
          <p className="text-gray-600 mt-1">Team communication and discussions</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Message</span>
        </Button>
      </div>

      {threads.length === 0 ? (
        <Empty
          icon="MessageSquare"
          title="No messages yet"
          message="Team messages and discussions will appear here. Start a conversation to collaborate with your team."
          actionLabel="Start Conversation"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {threads.map((thread) => (
              <ThreadCard
                key={thread.Id}
                thread={thread}
                onClick={handleThreadClick}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateThread}
      />
    </div>
  );
};

export default ProjectMessages;
