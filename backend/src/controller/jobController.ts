import { Request, Response } from "express";
import { createJob } from "../service/jobService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Job } from "../entities/Job";


// 🔥 CREATE JOB
export const postJob = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      description,
      requirements,
      location,
      salaryRange,
      jobType,
    } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user || user.role !== "company") {
      return res.status(400).json({ error: "Not a company" });
    }

    const job = await createJob(user, {
      title,
      description,
      requirements,
      location,
      salaryRange,
      jobType,
    });

    res.json(job);

  } catch (err) {
    console.log("POST JOB ERROR:", err);
    res.status(500).send("Error creating job");
  }
};


// 🔥 GET ALL JOBS
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);

    const jobs = await jobRepo.find({
      relations: ["company"],
    });

    const formatted = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary_range: job.salaryRange,
      job_type: job.jobType,

      first_name: job.company?.firstName,
      last_name: job.company?.lastName,
    }));

    res.json(formatted);

  } catch (err) {
    console.log("GET ALL JOBS ERROR:", err);
    res.status(500).send("Failed to load jobs");
  }
};


// 🔥 GET JOBS BY COMPANY
export const getJobsByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = Number(req.params.companyId);

    if (!companyId) {
      return res.status(400).json({ error: "Invalid company id" });
    }

    const jobRepo = AppDataSource.getRepository(Job);

    const jobs = await jobRepo.find({
      where: {
        company: { id: companyId },
      },
      relations: ["company"],
    });

    res.json(jobs);

  } catch (err) {
    console.log("GET JOBS ERROR:", err);
    res.status(500).send("Error fetching jobs");
  }
};


// 🔥 UPDATE JOB (EDIT)
export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.id);

    const { title, description, location, jobType } = req.body;

    const jobRepo = AppDataSource.getRepository(Job);

    const job = await jobRepo.findOneBy({ id: jobId });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    job.title = title;
    job.description = description;
    job.location = location;
    job.jobType = jobType;

    await jobRepo.save(job);

    res.json(job);

  } catch (err) {
    console.log("UPDATE JOB ERROR:", err);
    res.status(500).send("Error updating job");
  }
};

import { Application } from "../entities/Application";

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.id);

    const jobRepo = AppDataSource.getRepository(Job);
    const appRepo = AppDataSource.getRepository(Application);

    const job = await jobRepo.findOneBy({ id: jobId });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applications = await appRepo.find({
      where: { job: { id: jobId } },
    });

    if (applications.length > 0) {
      return res.status(400).json({
        error: "You cannot delete this job because there are applicants.",
      });
    }

    await jobRepo.remove(job);

    res.json({ message: "Job deleted" });

  } catch (err) {
    console.log("DELETE JOB ERROR:", err);
    res.status(500).send("Error deleting job");
  }
};