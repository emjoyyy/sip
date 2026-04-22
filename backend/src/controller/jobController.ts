import { Request, Response } from "express";
import { jobService, toJobListItem } from "../service/jobService";
import { userService } from "../service/userService";

export const postJob = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId);
    const title = String(req.body.title ?? "").trim();
    const description = String(req.body.description ?? "").trim();
    const requirements = req.body.requirements;
    const location = req.body.location;
    const salaryRange = req.body.salaryRange;
    const jobType = String(req.body.jobType ?? "").trim();

    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    if (!title || !description || !jobType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const company = await userService.findCompanyById(userId);
    if (!company) {
      return res.status(400).json({ error: "Not a company" });
    }

    const job = await jobService.create(company, {
      title,
      description,
      requirements:
        requirements === undefined || requirements === null
          ? null
          : String(requirements),
      location:
        location === undefined || location === null ? null : String(location),
      salaryRange:
        salaryRange === undefined || salaryRange === null
          ? null
          : String(salaryRange),
      jobType,
    });

    return res.status(201).json(toJobListItem(job));
  } catch (err) {
    console.error("POST JOB ERROR:", err);
    return res.status(500).json({ error: "Error creating job" });
  }
};

export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.findAllWithCompany();
    return res.json(jobs.map(toJobListItem));
  } catch (err) {
    console.error("GET ALL JOBS ERROR:", err);
    return res.status(500).json({ error: "Failed to load jobs" });
  }
};

export const getJobsByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = Number(req.params.companyId);
    if (!Number.isInteger(companyId) || companyId < 1) {
      return res.status(400).json({ error: "Invalid company id" });
    }

    const jobs = await jobService.findByCompanyId(companyId);
    return res.json(jobs.map(toJobListItem));
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    return res.status(500).json({ error: "Error fetching jobs" });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.id);
    if (!Number.isInteger(jobId) || jobId < 1) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const title = String(req.body.title ?? "").trim();
    const description = String(req.body.description ?? "").trim();
    const requirements = req.body.requirements;
    const location =
      req.body.location === undefined || req.body.location === null
        ? null
        : String(req.body.location);
    const salaryRange = req.body.salaryRange;
    const jobType = String(req.body.jobType ?? "").trim();

    if (!title || !description || !jobType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const job = await jobService.update(jobId, {
      title,
      description,
      requirements:
        requirements === undefined || requirements === null
          ? null
          : String(requirements),
      location,
      salaryRange:
        salaryRange === undefined || salaryRange === null
          ? null
          : String(salaryRange),
      jobType,
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.json(toJobListItem(job));
  } catch (err) {
    console.error("UPDATE JOB ERROR:", err);
    return res.status(500).json({ error: "Error updating job" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.id);
    if (!Number.isInteger(jobId) || jobId < 1) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const cascadeRaw = req.query.cascade;
    const cascadeStr = Array.isArray(cascadeRaw)
      ? cascadeRaw[0]
      : cascadeRaw;
    const cascadeApplications =
      cascadeStr === "1" ||
      cascadeStr === "true" ||
      cascadeStr === "yes";

    const result = await jobService.deleteJob(jobId, {
      cascadeApplications,
    });
    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({ error: "Job not found" });
      }
      return res.status(400).json({
        error:
          "You cannot delete this job because there are applicants. Retry with ?cascade=true to delete the job and all applications.",
      });
    }

    return res.json({
      message: cascadeApplications
        ? "Job and related applications deleted"
        : "Job deleted",
    });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    return res.status(500).json({ error: "Error deleting job" });
  }
};
