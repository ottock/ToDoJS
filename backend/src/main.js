// project imports
import credentials from "./core/utils/credentials.js";
import TaskApi from "./presentation/api/task_api.js";
import TaskService from "./application/services/task_service.js";
import TaskRepository from "./infrastructure/repositories/task_repository.js";

// constants
const config = credentials();

function resolveBackendPort() {
    if (!config.BACKEND_URL) {
        throw new Error("BACKEND_URL is required");
    }

    const url = new URL(config.BACKEND_URL);
    return Number(url.port);
}

async function bootstrap() {
    const taskRepository = new TaskRepository();
    const taskService = new TaskService(taskRepository);
    const backendApi = new TaskApi(resolveBackendPort(), config.FRONTEND_URL, taskService);
    backendApi.running();
}

bootstrap().catch(error => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
});