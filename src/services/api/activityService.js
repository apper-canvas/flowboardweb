import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async getByProjectId(projectId) {
    await this.delay();
    return this.activities
      .filter(a => a.projectId === projectId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(activity => ({ ...activity }));
  }

  async create(activityData) {
    await this.delay();
    const maxId = Math.max(...this.activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    this.activities[index] = { ...this.activities[index], ...activityData };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    this.activities.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const activityService = new ActivityService();