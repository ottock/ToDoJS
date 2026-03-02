// project imports
import credentials from "./core/utils/credentials.js";
import TaskApi from "./presentation/api/task_api.js";
import TaskService from "./application/services/task_service.js";
import TaskRepository from "./infrastructure/repositories/task_repository.js";

// constants
const config = credentials();

async function bootstrap() {

    // Infrastructure
    const taskRepository = new TaskRepository();

    // Application
    const taskService = new TaskService(taskRepository);

    // Presentation
    const backendApi = new TaskApi(
        config.BACKEND_PORT,
        config.FRONTEND_CORS,
        taskService
    );

    backendApi.running();
}

bootstrap().catch(error => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
});