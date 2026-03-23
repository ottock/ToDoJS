// imports
import dotenv from "dotenv";

// constants
dotenv.config();


// functions
export default function credentials() {
    const credentials = {
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_SSL: process.env.DATABASE_SSL,
        BACKEND_HOST: process.env.BACKEND_HOST,
        BACKEND_PORT: process.env.BACKEND_PORT,
        FRONTEND_HOST: process.env.FRONTEND_HOST,
        FRONTEND_PORT: process.env.FRONTEND_PORT,
    };

    return credentials;
}