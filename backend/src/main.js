// project imports
import credentials from "./core/utils/credentials.js";
import TaskApi from "./presentation/api/task_api.js";
import TaskService from "./application/services/task_service.js";
import TaskRepository from "./infrastructure/repositories/task_repository.js";

// constants
const config = credentials();


// functions
function resolveBackendPort() {
    if (!config.BACKEND_PORT) {
        throw new Error("BACKEND_PORT is required");
    }

    const port = Number(config.BACKEND_PORT);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error("BACKEND_PORT must be a valid positive integer");
    }

    return port;
}

function resolveFrontendOrigin() {
    if (!config.FRONTEND_HOST) {
        throw new Error("FRONTEND_HOST is required");
    }
    if (!config.FRONTEND_PORT) {
        throw new Error("FRONTEND_PORT is required");
    }

    const port = Number(config.FRONTEND_PORT);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error("FRONTEND_PORT must be a valid positive integer");
    }

    return `http://${config.FRONTEND_HOST}:${port}`;
}

async function bootstrap() {
    const taskRepository = new TaskRepository();
    const taskService = new TaskService(taskRepository);
    const backendApi = new TaskApi(resolveBackendPort(), resolveFrontendOrigin(), taskService);
    backendApi.running();
}

bootstrap().catch(error => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
});