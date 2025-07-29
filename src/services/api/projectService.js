import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
    const maxId = Math.max(...this.projects.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      memberCount: projectData.memberCount || 1
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects[index] = { ...this.projects[index], ...projectData };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const projectService = new ProjectService();