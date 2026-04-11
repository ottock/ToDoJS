// imports
import axios from "axios";

export default class TaskConsumer {
    constructor(api_url) {
        this.api = axios.create({
            baseURL: api_url,
            timeout: 8000
        })
    }

    async createTask(data) {
        const response = await this.api.post("/createTask", data);
        return response.data;
    }

    async readAllTasks() {
        const response = await this.api.get("/readAllTasks");
        return response.data;
    }

    async updateTask(id, data) {
        const response = await this.api.put("/updateTask", data, {
            params: { id }
        });
        return response.data;
    }

    async deleteTask(id) {
        const response = await this.api.delete(`/deleteTask`, {
            params: { id }
        });
        return response.data;
    }

}