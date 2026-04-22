import "reflect-metadata";
import { DataSource } from "typeorm";
import { Application } from "../entities/Application";
import { Job } from "../entities/Job";
import { User } from "../entities/User";
import { dbConnection, dbSynchronize } from "./databaseConfig";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConnection.host,
  port: dbConnection.port,
  username: dbConnection.username,
  password: dbConnection.password,
  database: dbConnection.database,
  synchronize: dbSynchronize,
  entities: [User, Job, Application],
});