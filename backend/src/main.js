// project imports
import credentials from "./core/credentials.js";
import TaskApi from "./presentation/taskApi.js";

// constants
const config = credentials();

async function bootstrap() {
    const backend_api = new TaskApi(
        config.BACKEND_PORT,
        config.FRONTEND_CORS
    );

    backend_api.running();
}

bootstrap().catch(error => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
});