// project imports
import TaskData from "../models/taskdataModel.js";

export default class TaskService {
    constructor(taskRepository) {
        this.repository = taskRepository;
    }

    async createTask(data) {
        if (!data.name) {
            throw new Error("Task must have a name");
        }

        const task = new TaskData(
            null,
            data.name,
            data.priority,
            data.description,
            data.status
        );

        return this.repository.create(task);
    }

    async readTask(id) {
        return this.repository.read(id);
    }

    async updateTask(id, data) {
        if (!data.name) {
            throw new Error("Task must have a name");
        }

        const task = new TaskData(
            id,
            data.name,
            data.priority,
            data.description,
            data.status
        );

        return this.repository.update(task);
    }

    async deleteTask(id) {
        return this.repository.delete(id);
    }

    async readAllTasks() {
        return this.repository.readAll();
    }
}