// project imports
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";

export default class TaskService {
    constructor() {
        this.repository = new TaskRepository();
    }

    async createTask(data) {
        return this.repository.create(data);
    }

    async readTask(id) {
        return this.repository.read(id);
    }

    async updateTask(id, data) {
        return this.repository.update(id, data);
    }

    async deleteTask(id) {
        return this.repository.delete(id);
    }

    async readAllTasks() {
        return this.repository.readAll();
    }
}