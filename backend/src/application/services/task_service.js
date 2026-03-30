// project imports
import TaskData from "../../domain/models/task_data_model.js";


export default class TaskService {
    constructor(taskRepository) {
        this.repository = taskRepository;
    }

    validateDateRules(fromDateRaw, dueDateRaw) {
        const normalizeDateInput = (value) => {
            if (value === null || value === undefined) return "";
            if (typeof value === "string") return value.trim();
            return String(value).trim();
        };

        const fromDateText = normalizeDateInput(fromDateRaw);
        const dueDateText = normalizeDateInput(dueDateRaw);

        const fromDate = fromDateText ? new Date(fromDateText) : null;
        const dueDate = dueDateText ? new Date(dueDateText) : null;

        if (fromDate && Number.isNaN(fromDate.getTime())) {
            const error = new Error("Invalid from_date");
            error.status = 400;
            throw error;
        }

        if (dueDate && Number.isNaN(dueDate.getTime())) {
            const error = new Error("Invalid due_date");
            error.status = 400;
            throw error;
        }

        if (fromDate && !dueDate) {
            const error = new Error("from_date cannot be set without due_date");
            error.status = 400;
            throw error;
        }

        if (fromDate && dueDate && fromDate.getTime() > dueDate.getTime()) {
            const error = new Error("from_date cannot be after due_date");
            error.status = 400;
            throw error;
        }
    }

    async createTask(data) {
        const payload = data ?? {};
        this.validateDateRules(payload.from_date, payload.due_date);

        const task = new TaskData(
            null,
            payload.name?.trim() ? payload.name.trim() : undefined,
            payload.created_date?.trim() ? payload.created_date.trim() : undefined,
            payload.priority?.trim() ? payload.priority.trim().toUpperCase() : undefined,
            payload.description?.trim() ? payload.description.trim() : undefined,
            typeof payload.status === "boolean" ? payload.status : undefined,
            payload.from_date?.trim() ? payload.from_date.trim() : null,
            payload.due_date?.trim() ? payload.due_date.trim() : null
        );

        return this.repository.create(task);
    }

    async readTask(id) {
        return this.repository.read(id);
    }

    async updateTask(id, data) {
        this.validateDateRules(data.from_date, data.due_date);

        const task = new TaskData(
            id,
            data.name,
            data.created_date,
            data.priority,
            data.description,
            data.status,
            data.from_date,
            data.due_date
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