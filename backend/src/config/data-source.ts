import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Job } from "../entities/Job";
import { Application } from "../entities/Application";

export const AppDataSource = new DataSource({
 type: "mysql",
 host: "localhost",
 port: 3306,
 username: "root",
 password: "Root12345!",
 database: "internship_db",
 synchronize: true,
 entities: [User, Job, Application] 
});