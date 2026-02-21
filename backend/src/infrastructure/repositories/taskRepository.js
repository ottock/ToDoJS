// project imports
import db from "../databases/postgres.js";
import TaskData from "../../domain/models/taskdataModel.js";

export default class TaskRepository {

    async create(task) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/createTask.sql",
            [task.name, task.priority, task.description, task.status]
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

    async update(task) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/updateTask.sql",
            [task.id, task.name, task.priority, task.description, task.status]
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

    async delete(id) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/deleteTask.sql",
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

    async readAll() {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/allTasks.sql"
        );

        return rows.map(row =>
            new TaskData(
                row.id,
                row.name,
                row.priority,
                row.description,
                row.status
            )
        );
    }
}