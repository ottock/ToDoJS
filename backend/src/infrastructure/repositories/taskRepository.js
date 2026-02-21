// project imports
import db from "../databases/postgres.js";
import TaskData from "../../buisness/models/taskdataModel.js";

export default class TaskRepository {

    async create({ name, priority, description, status }) {
        const task = new TaskData(null, name, priority, description, status);
        return db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/createTask.sql",
            [task.name, task.priority, task.description, task.status]
        );
    }

    async read(id) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/readTask.sql",
            [id]
        );

        if (!rows || rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new TaskData(
            row.id,
            row.name,
            row.priority,
            row.description,
            row.status
        );
    }

    async update(id, { name, priority, description, status }) {
        const task = new TaskData(id, name, priority, description, status);
        return db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/updateTask.sql",
            [task.id, task.name, task.priority, task.description, task.status]
        );
    }

    async delete(id) {
        return db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/deleteTask.sql",
            [id]
        );
    }

    readAll() {
        return db.queryFromFile(
            "backend/src/infrastructure/databases/queries/allTasks.sql"
        );
    }
}