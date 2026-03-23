// imports
import dotenv from "dotenv";

// constants
dotenv.config();


// functions
export default function credentials() {
    const credentials = {
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_SSL: process.env.DATABASE_SSL,
        BACKEND_URL: process.env.BACKEND_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        FRONTEND_CORS: process.env.FRONTEND_CORS
    };

    return credentials;
}