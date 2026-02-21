// imports
import cors from "cors";
import express from "express";

// project imports
import apiRoutes from "../../presentation/routes/taskRoutes.js";

export default class TaskApi {
    constructor(api_port, cors_origin) {
        this.api_port = api_port;
        this.cors_origin = cors_origin;
        this.app = express();
    }

    createApi() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: this.cors_origin
        }));
        this.app.use('/tasks', apiRoutes());

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
        const server = this.createApi().listen(this.api_port, () => {
            console.log(`BACKEND RUNNING AT: http://localhost:${this.api_port}`);
        });

        return server;
    }
}