// project imports
import db from "../databases/postgres.js";
import TaskData from "../../domain/models/task_data_model.js";


export default class TaskRepository {
    async create(task) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/createTask.sql",
            [task.name, task.created_date, task.priority, task.description, task.status, task.from_date, task.due_date]
        );

        if (!rows || rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new TaskData(
            row.id,
            row.name,
            row.created_date,
            row.priority,
            row.description,
            row.status,
            row.from_date,
            row.due_date
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
            row.created_date,
            row.priority,
            row.description,
            row.status,
            row.from_date,
            row.due_date
        );
    }

    async update(task) {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/crud/updateTask.sql",
            [task.id, task.name, task.priority, task.description, task.status, task.from_date, task.due_date]
        );

        if (!rows || rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new TaskData(
            row.id,
            row.name,
            row.created_date,
            row.priority,
            row.description,
            row.status,
            row.from_date,
            row.due_date
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
            row.created_date,
            row.priority,
            row.description,
            row.status,
            row.from_date,
            row.due_date
        );
    }

    async readAll() {
        const rows = await db.queryFromFile(
            "backend/src/infrastructure/databases/queries/allTasks.sql"
        );

        return rows.map(
            (row) =>
                new TaskData(
                    row.id,
                    row.name,
                    row.created_date,
                    row.priority,
                    row.description,
                    row.status,
                    row.from_date,
                    row.due_date
                )
        );
    }
}