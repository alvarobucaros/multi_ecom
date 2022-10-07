import { createPool } from "mysql2/promise";

const pool = createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // port: process.env.PORT,
    // database: process.env.DB, 

    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "acomerce"
});

export { pool };