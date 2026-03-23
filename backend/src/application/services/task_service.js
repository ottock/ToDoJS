// project imports
import TaskData from "../../domain/models/task_data_model.js";


export default class TaskService {
    constructor(taskRepository) {
        this.repository = taskRepository;
    }

    async createTask(data) {
        const payload = data ?? {};
        const task = new TaskData(
            null,
            payload.name?.trim() ? payload.name.trim() : undefined,
            payload.created_date?.trim() ? payload.created_date.trim() : undefined,
            payload.priority?.trim() ? payload.priority.trim().toUpperCase() : undefined,
            payload.description?.trim() ? payload.description.trim() : undefined,
            typeof payload.status === "boolean" ? payload.status : undefined
        );

        return this.repository.create(task);
    }

    async readTask(id) {
        return this.repository.read(id);
    }

    async updateTask(id, data) {
        const task = new TaskData(
            id,
            data.name,
            data.created_date,
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