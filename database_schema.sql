-- Database schema for student internship platform

-- Users table (updated with roles)
ALTER TABLE users ADD COLUMN role ENUM('student', 'company', 'admin') DEFAULT 'student';
ALTER TABLE users ADD COLUMN company_name VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
ALTER TABLE users ADD COLUMN bio TEXT NULL;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Jobs table
CREATE TABLE jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'internship',
  status ENUM('active', 'inactive', 'filled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
  cover_letter TEXT,
  resume_url VARCHAR(500),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (student_id, job_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);