// imports
import pkg from "pg";
import { readFile } from "fs/promises";

// project imports
import credentials from "../../core/utils/credentials.js";

// contants
const { Pool } = pkg;
const config = credentials();
const connectionString = config.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to Postgres");
}

const poolConfig = { connectionString };

if (config.DB_SSL === "true") {
    poolConfig.ssl = { rejectUnauthorized: false };
}

// functions
async function queryFromFile(filePath, params = []) {
    const sql = await readFile(filePath, "utf8");
    const result = await pool.query(sql, params);
    return result.rows;
}

const pool = new Pool(poolConfig);

const db = {
    queryFromFile,
};

export default db;