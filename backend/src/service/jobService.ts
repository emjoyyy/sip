import { Repository } from "typeorm";
import { Job } from "../entities/Job";
import { User } from "../entities/User";
import { JobRepository } from "../repository/jobRepository";
import { applicationService } from "./applicationService";

export type CreateJobInput = {
  title: string;
  description: string;
  requirements?: string | null;
  location?: string | null;
  salaryRange?: string | null;
  jobType: string;
};

export type UpdateJobInput = {
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  salaryRange: string | null;
  jobType: string;
};

/** List shape aligned with previous API (no nested user / no password leak). */
export type JobListItem = {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  salary_range: string | null;
  job_type: string;
  first_name: string | undefined;
  last_name: string | undefined;
};

export function toJobListItem(job: Job): JobListItem {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    requirements: job.requirements ?? null,
    location: job.location ?? null,
    salary_range: job.salaryRange ?? null,
    job_type: job.jobType,
    first_name: job.company?.firstName,
    last_name: job.company?.lastName,
  };
}

export class JobService {
  constructor(private readonly jobs: Repository<Job> = JobRepository) {}

  async create(company: User, input: CreateJobInput): Promise<Job> {
    const job = new Job();
    job.title = input.title;
    job.description = input.description;
    job.jobType = input.jobType;
    job.company = company;
    job.requirements =
      input.requirements === undefined || input.requirements === null
        ? null
        : input.requirements;
    job.location =
      input.location === undefined || input.location === null
        ? null
        : input.location;
    job.salaryRange =
      input.salaryRange === undefined || input.salaryRange === null
        ? null
        : input.salaryRange;

    const saved: Job = await this.jobs.save(job);
    const withCompany = await this.jobs.findOne({
      where: { id: saved.id },
      relations: ["company"],
    });
    return withCompany ?? saved;
  }

  async findAllWithCompany(): Promise<Job[]> {
    return this.jobs.find({ relations: ["company"] });
  }

  async findByCompanyId(companyId: number): Promise<Job[]> {
    return this.jobs.find({
      where: { company: { id: companyId } },
      relations: ["company"],
    });
  }

  async update(
    jobId: number,
    input: UpdateJobInput
  ): Promise<Job | null> {
    const job = await this.jobs.findOneBy({ id: jobId });
    if (!job) return null;
    job.title = input.title;
    job.description = input.description;
    job.requirements = input.requirements;
    job.location = input.location;
    job.salaryRange = input.salaryRange;
    job.jobType = input.jobType;
    const saved: Job = await this.jobs.save(job);
    const withCompany = await this.jobs.findOne({
      where: { id: saved.id },
      relations: ["company"],
    });
    return withCompany ?? saved;
  }

  /**
   * Deletes a job. By default refuses when applications exist.
   * Pass `{ cascadeApplications: true }` to remove those applications first, then the job.
   */
  async deleteJob(
    jobId: number,
    options?: { cascadeApplications?: boolean }
  ): Promise<
    { ok: true } | { ok: false; reason: "not_found" | "has_applications" }
  > {
    const cascade = options?.cascadeApplications === true;
    const job = await this.jobs.findOneBy({ id: jobId });
    if (!job) return { ok: false, reason: "not_found" };

    const count = await applicationService.countByJobId(jobId);

    if (count > 0 && !cascade) {
      return { ok: false, reason: "has_applications" };
    }

    if (count > 0) {
      await applicationService.deleteAllForJob(jobId);
    }

    await this.jobs.remove(job);
    return { ok: true };
  }

  /** Deletes all jobs owned by a company user (applications removed per job). */
  async deleteAllJobsForCompany(companyId: number): Promise<void> {
    const jobs = await this.jobs.find({
      where: { company: { id: companyId } },
    });
    for (const j of jobs) {
      await this.deleteJob(j.id, { cascadeApplications: true });
    }
  }
}

export const jobService = new JobService();
