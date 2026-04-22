import { JobRepository } from "../repository/jobRepository";
import { User } from "../entities/User";
import { Job } from "../entities/Job";

export const createJob = async (
  user: User,
  data: any
) => {

  const job = new Job();

  job.title = data.title;
  job.description = data.description;
  job.requirements = data.requirements;
  job.location = data.location;
  job.salaryRange = data.salaryRange;
  job.jobType = data.jobType;

  job.company = user;

  return await JobRepository.save(job);
};