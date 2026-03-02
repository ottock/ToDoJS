export default class TaskData {
    constructor(
        id = null,
        name = "Default Task",
        priority = 'L',
        description = "None.",
        status = false
    ) {
        this.id = id;
        this.name = name;
        this.priority = this.validatePriority(priority);
        this.description = description;
        this.status = status;
    }

    validatePriority(priority) {
        const allowed = ['L', 'M', 'H'];
        return allowed.includes(priority) ? priority : 'L';
    }

    changeStatus() {
        this.status = !this.status;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            priority: this.priority,
            description: this.description,
            status: this.status
        };
    }

    static fromJSON(json) {
        return new TaskData(
            json.id,
            json.name,
            json.priority,
            json.description,
            json.status
        );
    }
}