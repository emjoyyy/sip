import mysql from "mysql2/promise";
import { dbConnection } from "./databaseConfig";

/** Ensures the MySQL database exists before TypeORM connects (TypeORM does not create the DB). */
export async function ensureDatabaseExists(): Promise<void> {
  const safeName = dbConnection.database.replace(/`/g, "``");
  const conn = await mysql.createConnection({
    host: dbConnection.host,
    port: dbConnection.port,
    user: dbConnection.username,
    password: dbConnection.password,
  });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${safeName}\``);
  } finally {
    await conn.end();
  }
}
