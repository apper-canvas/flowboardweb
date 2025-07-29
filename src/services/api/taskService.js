import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.teamMembers = this.generateTeamMembers();
  }

  generateTeamMembers() {
    return [
      { Id: 1, name: "Alex Johnson", email: "alex@company.com" },
      { Id: 2, name: "Sarah Chen", email: "sarah@company.com" },
      { Id: 3, name: "Mike Rodriguez", email: "mike@company.com" },
      { Id: 4, name: "Emily Davis", email: "emily@company.com" },
      { Id: 5, name: "David Kim", email: "david@company.com" },
      { Id: 6, name: "Lisa Thompson", email: "lisa@company.com" },
      { Id: 7, name: "James Wilson", email: "james@company.com" },
      { Id: 8, name: "Maria Garcia", email: "maria@company.com" }
    ];
  }

  async getTeamMembers() {
    await this.delay();
    return [...this.teamMembers];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByProjectId(projectId) {
    await this.delay();
    return this.tasks
      .filter(t => t.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(task => ({ ...task }));
  }

async create(taskData) {
    await this.delay();
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      listId: taskData.listId || null,
      dueDate: taskData.dueDate || null,
      assigneeId: taskData.assigneeId || null,
      notes: taskData.notes || "",
      createdAt: taskData.createdAt || new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedData = { ...taskData };
    if (updatedData.dueDate === "") updatedData.dueDate = null;
    if (updatedData.assigneeId === "") updatedData.assigneeId = null;
    if (updatedData.notes === undefined) updatedData.notes = this.tasks[index].notes || "";
    
    this.tasks[index] = { ...this.tasks[index], ...updatedData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    return true;
  }

delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const taskService = new TaskService();