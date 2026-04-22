import { useState, useEffect } from "react";
import "./CompanyDashboard.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  company_name?: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
  job_type?: string;
}

interface Application {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cover_letter: string;
  status: string;
}

interface Props {
  user: User;
}

export default function CompanyDashboard({ user }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [editingId, setEditingId] = useState<number | null>(null);
  

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "internship",
  });

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const fetchCompanyJobs = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/jobs/company/${user.id}`
      );
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async () => {
    if (!jobForm.title || !jobForm.description) {
      alert("Fill title and description");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
  editingId
    ? `http://localhost:3000/jobs/${editingId}`
    : "http://localhost:3000/jobs",
  {
    method: editingId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      ...jobForm,
    }),
  }
);

      if (res.ok) {
        setShowJobForm(false);
        setEditingId(null);
        setJobForm({
          title: "",
          description: "",
          location: "",
          jobType: "internship",
        });
        fetchCompanyJobs();
      }
    } catch {
      alert("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE JOB
  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const appsRes = await fetch(
        `http://localhost:3000/applications/job/${jobId}`
      );
      let hasApplications = false;
      if (appsRes.ok) {
        const apps = await appsRes.json();
        hasApplications = Array.isArray(apps) && apps.length > 0;
      }

      const deleteUrl = hasApplications
        ? `http://localhost:3000/jobs/${jobId}?cascade=true`
        : `http://localhost:3000/jobs/${jobId}`;

      const res = await fetch(deleteUrl, { method: "DELETE" });

      if (res.ok) {
        fetchCompanyJobs();
      } else {
        alert("Failed to delete job");
      }
    } catch {
      alert("Error deleting job");
    }
  };

  // ✏️ EDIT (за сега само пример – може после да направим modal)
  const handleEditJob = (job: Job) => {
    setEditingId(job.id)
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location || "",
      jobType: job.jobType || job.job_type || "internship",
    });

    setShowJobForm(true);
  };

  const handleViewApplications = async (job: Job) => {
    setSelectedJob(job);
    setActiveTab("applications");

    try {
      const res = await fetch(
        `http://localhost:3000/applications/job/${job.id}`
      );
      const data = await res.json();
      setApplications(data);
    } catch {
      alert("Failed to load applications");
    }
  };

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.company_name || user.firstName}</h1>
      </div>

      {/* TABS */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          Jobs
        </button>

        <button
          className={`tab-btn ${
            activeTab === "applications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
      </div>

      {/* JOBS */}
      {activeTab === "jobs" && (
        <div className="jobs-section">
          <button
            className="btn btn-primary"
            onClick={() => setShowJobForm(true)}
          >
            + Post Job
          </button>

          <div className="jobs-list">
            {jobs.length === 0 && (
              <p style={{ marginTop: 20 }}>
                No jobs yet. Create your first one 🚀
              </p>
            )}

            {jobs.map((job) => (
              <div key={job.id} className="job-item">
                <div>
                  <h3>{job.title}</h3>
                  <p>
                    {job.jobType || job.job_type} •{" "}
                    {job.location || "Remote"}
                  </p>
                </div>

                {/* ✅ ACTION BUTTONS */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditJob(job)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="applications-section">

          {jobs.length === 0 && (
            <p>No jobs yet. Create one first 👈</p>
          )}

          {jobs.length > 0 && !selectedJob && (
            <div>
              <p style={{ marginBottom: 15 }}>
                Select a job to view applications:
              </p>

              {jobs.map((job) => (
                <button
                  key={job.id}
                  className="btn btn-secondary"
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={() => handleViewApplications(job)}
                >
                  {job.title}
                </button>
              ))}
            </div>
          )}

          {selectedJob && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Applications for: {selectedJob.title}</h2>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedJob(null);
                    setApplications([]);
                  }}
                >
                  ← Back
                </button>
              </div>

              {applications.length === 0 && (
                <p>No applications yet.</p>
              )}

              {applications.map((app) => (
                <div key={app.id} className="application-item">
                  <p>
                    <strong>
                      {app.first_name} {app.last_name}
                    </strong>
                  </p>
                  <p>{app.email}</p>
                  <p>{app.cover_letter}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* MODAL */}
      {showJobForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowJobForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Post Job</h2>

            <div className="modal-body">

              <div className="form-group">
                <label>Title</label>
                <input
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  value={jobForm.location}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Job Type</label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      jobType: e.target.value,
                    })
                  }
                >
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                </select>
              </div>

            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowJobForm(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleCreateJob}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}