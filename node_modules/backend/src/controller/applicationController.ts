import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Application } from "../entities/Application";
import { User } from "../entities/User";
import { Job } from "../entities/Job";


export const createApplication = async (req: Request, res: Response) => {
  try {
    const { student_id, job_id, cover_letter } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const jobRepo = AppDataSource.getRepository(Job);
    const appRepo = AppDataSource.getRepository(Application);

    const student = await userRepo.findOneBy({ id: student_id });
    const job = await jobRepo.findOneBy({ id: job_id });

    if (!student || !job) {
      return res.status(400).json({ error: "Invalid student or job" });
    }

    const application = appRepo.create({
      student,
      job,
      coverLetter: cover_letter,
      status: "pending"
    });

    await appRepo.save(application);

    res.json(application);

  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    res.status(500).send("Error applying");
  }
};


export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.jobId);

    const repo = AppDataSource.getRepository(Application);

    const applications = await repo.find({
      where: {
        job: { id: jobId },
      },
      relations: ["student"], 
    });

    const formatted = applications.map((app) => ({
      id: app.id,
      first_name: app.student.firstName,
      last_name: app.student.lastName,
      email: app.student.email,
      cover_letter: app.coverLetter,
      status: app.status,
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load applications");
  }
};