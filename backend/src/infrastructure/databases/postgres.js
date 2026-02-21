// imports
import pkg from "pg";
import { readFile } from "fs/promises";

// project imports
import credentials from "../../utils/credentials.js";

// contants
const { Pool } = pkg;
const config = credentials();

// functions
async function queryFromFile(filePath, params = []) {
    const sql = await readFile(filePath, "utf8");
    const result = await pool.query(sql, params);
    return result.rows;
}

const pool = new Pool({
    host: config.DB_HOST,
    user: config.DB_USER,
    port: config.DB_PORT,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
});

const db = {
    queryFromFile,
};

export default db;