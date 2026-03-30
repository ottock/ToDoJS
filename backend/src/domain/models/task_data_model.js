// project imports
import { today_date, format_date } from "../../core/utils/timestamp.js";


export default class TaskData {
    constructor(
        id = null,
        name = "Default Task",
        created_date = today_date(),
        priority = 'L',
        description = "None.",
        status = false,
        from_date = null,
        due_date = null
    ) {
        this.id = id;
        this.name = name;
        this.created_date = created_date ?? today_date();
        this.priority = this.validatePriority(priority);
        this.description = description;
        this.status = Boolean(status);
        this.from_date = from_date;
        this.due_date = due_date;
    }

    validatePriority(priority) {
        const allowed = ['L', 'M', 'H'];
        return allowed.includes(priority) ? priority : "L";
    }

    changeStatus() {
        this.status = !this.status;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created_date: format_date(this.created_date),
            priority: this.priority,
            description: this.description,
            status: this.status,
            from_date: format_date(this.from_date),
            due_date: format_date(this.due_date)
        };
    }

    static fromJSON(json) {
        return new TaskData(
            json.id,
            json.name,
            json.created_date,
            json.priority,
            json.description,
            json.status,
            json.from_date,
            json.due_date
        );
    }
}