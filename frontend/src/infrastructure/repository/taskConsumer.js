// imports
import axios from "axios";

// project imports

export default class TaskConsumer {
    constructor(api_url) {
        this.api = axios.create({
            baseURL: api_url,
            timeout: 8000
        })
    }

    async readAllTasks() {
        const response = await this.api.get("/tasks/readAllTasks");
        return response.data;
    }

}