import { AppDataSource } from "../config/data-source";
import { Application } from "../entities/Application";

export const ApplicationRepository = AppDataSource.getRepository(Application); 