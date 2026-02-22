// project imports
import credentials from "./utils/credentials.js";
import TaskApi from "./presentation/api/taskApi.js";
import TaskService from "./domain/services/taskService.js";
import TaskRepository from "./infrastructure/repositories/taskRepository.js";

// constants
const config = credentials();

async function bootstrap() {

    // Infrastructure
    const taskRepository = new TaskRepository();

    // Domain
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