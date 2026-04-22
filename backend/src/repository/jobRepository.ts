import { AppDataSource } from "../config/data-source";
import { Job } from "../entities/Job";

export const JobRepository = AppDataSource.getRepository(Job); 