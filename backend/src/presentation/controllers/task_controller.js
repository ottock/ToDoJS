export default class TaskController {
    constructor(taskService) {
        this.service = taskService;
    }

    async status(req, res, next) {
        try {
            return res.status(200).json({ message: "Success"});
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