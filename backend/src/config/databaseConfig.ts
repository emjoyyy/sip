import "dotenv/config";

/** Shared connection settings (used by TypeORM and the bootstrap that creates the DB). */
export const dbConnection = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "Root12345!",
  database: process.env.DB_DATABASE ?? "internship_db",
};

/**
 * When true, TypeORM aligns tables/columns with your entities on each startup.
 * Use only in development — it can drop columns or data on complex changes.
 * In production, set DB_SYNCHRONIZE=false and use migrations instead.
 */
export const dbSynchronize =
  (process.env.DB_SYNCHRONIZE ?? "true").toLowerCase() === "true";
