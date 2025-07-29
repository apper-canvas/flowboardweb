import taskListsData from '@/services/mockData/taskLists.json';

class TaskListService {
  constructor() {
    this.taskLists = [...taskListsData];
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.taskLists];
  }

  async getById(id) {
    await this.delay();
    const taskList = this.taskLists.find(list => list.Id === parseInt(id));
    if (!taskList) {
      throw new Error('Task list not found');
    }
    return { ...taskList };
  }

  async getByProjectId(projectId) {
    await this.delay();
    return this.taskLists
      .filter(list => list.projectId === parseInt(projectId))
      .map(list => ({ ...list }));
  }

  async create(taskListData) {
    await this.delay();
    const maxId = Math.max(...this.taskLists.map(list => list.Id), 0);
    const newTaskList = {
      Id: maxId + 1,
      ...taskListData,
      createdAt: taskListData.createdAt || new Date().toISOString()
    };
    this.taskLists.push(newTaskList);
    return { ...newTaskList };
  }

  async update(id, taskListData) {
    await this.delay();
    const index = this.taskLists.findIndex(list => list.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task list not found');
    }
    
    this.taskLists[index] = {
      ...this.taskLists[index],
      ...taskListData,
      Id: parseInt(id)
    };
    
    return { ...this.taskLists[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.taskLists.findIndex(list => list.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task list not found');
    }
    
    this.taskLists.splice(index, 1);
    return true;
  }
}

export const taskListService = new TaskListService();