import { Request, Response } from "express";
import { applicationService } from "../service/applicationService";

export const createApplication = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.body.student_id);
    const jobId = Number(req.body.job_id);
    const coverLetter = req.body.cover_letter;

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(400).json({ error: "Invalid student_id" });
    }
    if (!Number.isInteger(jobId) || jobId < 1) {
      return res.status(400).json({ error: "Invalid job_id" });
    }

    const application = await applicationService.create({
      studentId,
      jobId,
      coverLetter:
        coverLetter === undefined || coverLetter === null
          ? null
          : String(coverLetter),
    });

    if (!application) {
      return res.status(400).json({ error: "Invalid student or job" });
    }

    return res.status(201).json({
      id: application.id,
      status: application.status,
      job_id: jobId,
      student_id: studentId,
    });
  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    return res.status(500).json({ error: "Error applying" });
  }
};

export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.jobId);
    if (!Number.isInteger(jobId) || jobId < 1) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const rows = await applicationService.findByJobForCompany(jobId);
    return res.json(rows);
  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err);
    return res.status(500).json({ error: "Failed to load applications" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const applicationId = Number(req.params.id);
    if (!Number.isInteger(applicationId) || applicationId < 1) {
      return res.status(400).json({ error: "Invalid application id" });
    }

    const result = await applicationService.deleteById(applicationId);
    if (!result.ok) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("DELETE APPLICATION ERROR:", err);
    return res.status(500).json({ error: "Error deleting application" });
  }
};
