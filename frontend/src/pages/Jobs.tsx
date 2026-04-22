import { useState, useEffect } from "react";
import "./Jobs.css";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "company" | "admin";
}

interface Job {
  id: number;
  title: string;
  description: string;
  location?: string;
  job_type?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
}

interface JobsProps {
  user: User;
}

export default function Jobs({ user }: JobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setJobs(data);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob || !coverLetter.trim()) {
      alert("Write something 😄");
      return;
    }

    setApplying(true);

    try {
      const res = await fetch("http://localhost:3000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: user.id,
          job_id: selectedJob.id,
          cover_letter: coverLetter
        })
      });

      if (!res.ok) throw new Error();

      alert("Applied successfully 🚀");
      setSelectedJob(null);
      setCoverLetter("");
    } catch {
      alert("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="jobs-container">Loading...</div>;
  if (error) return <div className="jobs-container">{error}</div>;

  return (
    <div className="jobs-container">
      <h1>Available Jobs</h1>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>

            <p className="job-company">
              {job.company_name ||
                `${job.first_name || ""} ${job.last_name || ""}`}
            </p>

            <p className="job-desc">
              {job.description.substring(0, 120)}...
            </p>

            <button
              className="btn btn-primary"
              onClick={() => setSelectedJob(job)}
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">{selectedJob.title}</h2>

            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                className="textarea"
                placeholder="Tell the company why you are a good fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}