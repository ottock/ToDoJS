// imports
import { Router } from "express";

// project imports
import TaskController from "../controllers/taskController.js";

export default function taskRoutes(taskService) {
    const router = Router();
    const controller = new TaskController(taskService);

    router.get('/', controller.status.bind(controller));
    router.get("/status", controller.status.bind(controller));
    router.get("/docs", controller.docs.bind(controller));
    router.get("/readAllTasks", controller.readAllTasks.bind(controller));

    // C.R.U.D routes
    router.post("/createTask", controller.createTask.bind(controller));
    router.get("/readTask", controller.readTask.bind(controller));
    router.put("/updateTask", controller.updateTask.bind(controller));
    router.delete("/deleteTask", controller.deleteTask.bind(controller));

    return router;
}
