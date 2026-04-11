// imports
import cors from "cors";
import express from "express";

// project imports
import apiRoutes from "../routes/task_routes.js";

export default class TaskApi {
    constructor(api_url, cors_origin, taskService) {
        this.api_url = api_url;
        this.cors_origin = cors_origin;
        this.taskService = taskService;
        this.app = express();
    }

    createApi() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: this.cors_origin
        }));
        this.app.use('/', apiRoutes(this.taskService));

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ message: "Route not found" });
        });

        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error(err);
            res.status(err.status || 500).json({
                message: err.message || "Internal Server Error"
            });
        });

        return this.app;
    }

    running() {
        const server = this.createApi().listen(this.api_url, () => {
            console.log(`BACKEND RUNNING ON PORT: ${this.api_url}`);
        });

        return server;
    }
}