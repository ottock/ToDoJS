// imports
import path from "node:path";

// project imports
import TaskService from "../../domain/services/taskService.js";

export default class TaskController {
    constructor() {
        this.service = new TaskService();
    }

    async status(req, res, next) {
        try {
            const filePath = path.resolve(
                "backend/src/presentation/assets/status/status.html"
            );
            return res.sendFile(filePath);
        } catch (error) {
            next(error);
        }
    }

    async docs(req, res, next) {
        try {
            const filePath = path.resolve(
                "backend/src/presentation/assets/docs/docs.html"
            );
            return res.sendFile(filePath);
        } catch (error) {
            next(error);
        }
    }

    async readAllTasks(req, res, next) {
        try {
            const tasks = await this.service.readAllTasks();
            return res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async createTask(req, res, next) {
        try {
            const task = await this.service.createTask(req.body);
            return res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async readTask(req, res, next) {
        try {
            const task = await this.service.readTask(req.query.id);
            return res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const task = await this.service.updateTask(
                req.query.id,
                req.body
            );
            return res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await this.service.deleteTask(req.query.id);
            return res.status(200).json({ message: `Deleted task ${req.query.id} successfully` });
        } catch (error) {
            next(error);
        }
    }
}