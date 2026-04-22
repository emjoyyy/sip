import { Repository } from "typeorm";
import { Application } from "../entities/Application";
import { Job } from "../entities/Job";
import { User } from "../entities/User";
import { ApplicationRepository } from "../repository/applicationRepository";
import { JobRepository } from "../repository/jobRepository";
import { UserRepository } from "../repository/userRepository";

export type CreateApplicationInput = {
  studentId: number;
  jobId: number;
  coverLetter?: string | null;
};

export type ApplicationForJobView = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cover_letter: string | null;
  status: string;
};

export class ApplicationService {
  constructor(
    private readonly applications: Repository<Application> = ApplicationRepository,
    private readonly users: Repository<User> = UserRepository,
    private readonly jobs: Repository<Job> = JobRepository
  ) {}

  async create(
    input: CreateApplicationInput
  ): Promise<Application | null> {
    const student = await this.users.findOneBy({ id: input.studentId });
    const job = await this.jobs.findOneBy({ id: input.jobId });
    if (!student || !job) return null;

    const application = new Application();
    application.student = student;
    application.job = job;
    application.status = "pending";
    application.coverLetter =
      input.coverLetter === undefined || input.coverLetter === null
        ? null
        : input.coverLetter;

    return this.applications.save(application);
  }

  async findByJobForCompany(jobId: number): Promise<ApplicationForJobView[]> {
    const list = await this.applications.find({
      where: { job: { id: jobId } },
      relations: ["student"],
    });

    return list.map((app) => ({
      id: app.id,
      first_name: app.student.firstName,
      last_name: app.student.lastName,
      email: app.student.email,
      cover_letter: app.coverLetter ?? null,
      status: app.status,
    }));
  }

  async deleteById(
    applicationId: number
  ): Promise<{ ok: true } | { ok: false; reason: "not_found" }> {
    const row = await this.applications.findOneBy({ id: applicationId });
    if (!row) return { ok: false, reason: "not_found" };
    await this.applications.remove(row);
    return { ok: true };
  }

  async countByJobId(jobId: number): Promise<number> {
    return this.applications.count({ where: { job: { id: jobId } } });
  }

  /** Removes every application for a job (used before deleting the job, or from cascade). */
  async deleteAllForJob(jobId: number): Promise<void> {
    await this.applications.delete({ job: { id: jobId } });
  }

  /** Removes every application submitted by this user as student. */
  async deleteAllForStudent(studentId: number): Promise<void> {
    await this.applications.delete({ student: { id: studentId } });
  }
}

export const applicationService = new ApplicationService();
