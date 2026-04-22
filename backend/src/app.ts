import "dotenv/config";
import express from "express";
import cors from "cors";
import "reflect-metadata";

import { AppDataSource } from "./config/data-source";
import { ensureDatabaseExists } from "./config/ensureDatabase";

// 🔥 CONTROLLERS
import { 
  postJob, 
  getJobsByCompany, 
  getAllJobs,
  updateJob,
  deleteJob
} from "./controller/jobController";

import { deleteUser, registerUser } from "./controller/userController";
import { loginUser } from "./controller/authController";

import {
  createApplication,
  deleteApplication,
  getApplicationsByJob,
} from "./controller/applicationController";

const app = express();

app.use(cors());
app.use(express.json());


// 🔐 AUTH
app.post("/register", registerUser);
app.post("/login", loginUser);
app.delete("/users/:id", deleteUser);


// 💼 JOBS
app.post("/jobs", postJob);
app.get("/jobs/company/:companyId", getJobsByCompany);
app.get("/jobs", getAllJobs);

// 👉 НОВИ (edit + delete)
app.put("/jobs/:id", updateJob);
app.delete("/jobs/:id", deleteJob);


// 📄 APPLICATIONS
app.get("/applications/job/:jobId", getApplicationsByJob);
app.post("/applications", createApplication);
app.delete("/applications/:id", deleteApplication);


// 🚀 START SERVER
void (async () => {
  try {
    await ensureDatabaseExists();
    await AppDataSource.initialize();
    console.log("DB connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    process.exit(1);
  }
})();