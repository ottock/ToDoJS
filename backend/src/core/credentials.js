// imports
import dotenv from "dotenv";

// constants
dotenv.config();

export default function credentials() {
    const credentials = {
        ENV: process.env.ENV,
        BACKEND_PORT: process.env.BACKEND_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PORT: process.env.DB_PORT,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        FRONTEND_CORS: process.env.FRONTEND_CORS
    };

    return credentials;
}