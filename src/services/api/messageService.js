import mockThreads from '@/services/mockData/messageThreads.json';

let threads = [...mockThreads];
let messages = [];
let nextThreadId = Math.max(...threads.map(t => t.Id), 0) + 1;
let nextMessageId = 1;

// Initialize messages from threads
threads.forEach(thread => {
  messages.push({
    Id: nextMessageId++,
    threadId: thread.Id,
    author: thread.author,
    content: thread.initialMessage,
    timestamp: thread.createdAt,
    isInitial: true
  });
});

export const messageService = {
  // Get all message threads
  getAllThreads: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...threads].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)));
      }, 300);
    });
  },

  // Get messages for a specific thread
  getThreadMessages: (threadId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!Number.isInteger(threadId) || threadId <= 0) {
          reject(new Error('Invalid thread ID'));
          return;
        }
        
        const threadMessages = messages
          .filter(msg => msg.threadId === threadId)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        resolve([...threadMessages]);
      }, 200);
    });
  },

  // Create a new message thread
  createThread: (threadData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!threadData.title?.trim() || !threadData.message?.trim()) {
          reject(new Error('Title and message are required'));
          return;
        }

        const now = new Date().toISOString();
        const newThread = {
          Id: nextThreadId++,
          title: threadData.title.trim(),
          author: "You",
          createdAt: now,
          lastActivity: now,
          replyCount: 0,
          initialMessage: threadData.message.trim()
        };

        threads.unshift(newThread);

        // Add initial message
        const initialMessage = {
          Id: nextMessageId++,
          threadId: newThread.Id,
          author: "You",
          content: threadData.message.trim(),
          timestamp: now,
          isInitial: true
        };

        messages.push(initialMessage);
        resolve({ ...newThread });
      }, 400);
    });
  },

  // Add a reply to a thread
  addReply: (threadId, replyData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!Number.isInteger(threadId) || threadId <= 0) {
          reject(new Error('Invalid thread ID'));
          return;
        }

        if (!replyData.content?.trim()) {
          reject(new Error('Reply content is required'));
          return;
        }

        const thread = threads.find(t => t.Id === threadId);
        if (!thread) {
          reject(new Error('Thread not found'));
          return;
        }

        const now = new Date().toISOString();
        const newReply = {
          Id: nextMessageId++,
          threadId: threadId,
          author: "You",
          content: replyData.content.trim(),
          timestamp: now,
          isInitial: false
        };

        messages.push(newReply);

        // Update thread activity and reply count
        thread.lastActivity = now;
        thread.replyCount += 1;

        resolve({ ...newReply });
      }, 300);
    });
  }
};