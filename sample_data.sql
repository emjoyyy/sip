-- Sample data for student internship platform

-- Insert sample users (students, companies, admin)
INSERT INTO users (username, email, password, first_name, last_name, role, company_name, phone, bio, created_at) VALUES
-- Students
('john_doe', 'john.doe@email.com', '$2b$10$hashedpassword1', 'John', 'Doe', 'student', NULL, '+1-555-0101', 'Computer Science student passionate about web development and AI.', '2024-01-15 10:00:00'),
('sarah_smith', 'sarah.smith@email.com', '$2b$10$hashedpassword2', 'Sarah', 'Smith', 'student', NULL, '+1-555-0102', 'Business Administration major with experience in marketing and project management.', '2024-01-20 14:30:00'),
('mike_johnson', 'mike.johnson@email.com', '$2b$10$hashedpassword3', 'Mike', 'Johnson', 'student', NULL, '+1-555-0103', 'Engineering student specializing in software development and data structures.', '2024-02-01 09:15:00'),
('emma_wilson', 'emma.wilson@email.com', '$2b$10$hashedpassword4', 'Emma', 'Wilson', 'student', NULL, '+1-555-0104', 'Design student with skills in UI/UX design and graphic design tools.', '2024-02-10 16:45:00'),

-- Companies
('tech_corp', 'hr@techcorp.com', '$2b$10$hashedpassword5', 'Jane', 'Anderson', 'company', 'TechCorp Solutions', '+1-555-0201', 'Leading technology company specializing in software development and digital solutions.', '2024-01-10 08:00:00'),
('innovate_labs', 'careers@innovatelabs.com', '$2b$10$hashedpassword6', 'David', 'Brown', 'company', 'Innovate Labs', '+1-555-0202', 'Research and development company focused on AI and machine learning innovations.', '2024-01-12 11:20:00'),
('startup_xyz', 'jobs@startupxyz.com', '$2b$10$hashedpassword7', 'Lisa', 'Garcia', 'company', 'StartupXYZ', '+1-555-0203', 'Fast-growing startup building the next generation of mobile applications.', '2024-01-25 13:10:00'),

-- Admin
('admin_user', 'admin@platform.com', '$2b$10$hashedpassword8', 'Admin', 'User', 'admin', NULL, '+1-555-0000', 'Platform administrator responsible for user management and system oversight.', '2024-01-01 00:00:00');

-- Insert sample jobs
INSERT INTO jobs (company_id, title, description, requirements, location, salary_range, job_type, status, created_at) VALUES
-- TechCorp jobs
(5, 'Frontend Developer Intern', 'Join our dynamic team to work on cutting-edge web applications using React and TypeScript. You will collaborate with senior developers and contribute to real projects that impact millions of users.', '• Strong knowledge of HTML, CSS, and JavaScript\n• Experience with React or similar frameworks\n• Understanding of responsive design principles\n• Basic knowledge of version control (Git)', 'San Francisco, CA (Remote options available)', '$25-35/hour', 'internship', 'active', '2024-02-01 09:00:00'),
(5, 'Backend Developer Intern', 'Work on scalable backend systems using Node.js and cloud technologies. You will learn about microservices architecture and database design while contributing to our core platform.', '• Knowledge of JavaScript/Node.js\n• Understanding of REST APIs\n• Basic database concepts (SQL/NoSQL)\n• Familiarity with cloud platforms (AWS/Azure)', 'San Francisco, CA', '$28-38/hour', 'internship', 'active', '2024-02-05 10:30:00'),
(5, 'Data Analyst Intern', 'Analyze user data and create insights to drive product decisions. You will work with large datasets and learn data visualization techniques.', '• Basic knowledge of SQL\n• Experience with Excel or Google Sheets\n• Understanding of basic statistics\n• Interest in data visualization', 'San Francisco, CA (Hybrid)', '$24-32/hour', 'internship', 'active', '2024-02-10 14:00:00'),

-- Innovate Labs jobs
(6, 'AI Research Intern', 'Contribute to cutting-edge AI research projects. Work with machine learning models and help develop the next generation of intelligent systems.', '• Strong mathematical background\n• Programming experience (Python preferred)\n• Knowledge of machine learning concepts\n• Research experience (academic projects count)', 'Boston, MA', '$30-45/hour', 'internship', 'active', '2024-02-03 11:00:00'),
(6, 'Machine Learning Engineer Intern', 'Build and deploy machine learning models in production environments. Learn about MLOps and model optimization techniques.', '• Python programming experience\n• Knowledge of ML frameworks (TensorFlow, PyTorch)\n• Understanding of data science concepts\n• Experience with cloud platforms', 'Boston, MA (Remote)', '$32-48/hour', 'internship', 'active', '2024-02-08 15:45:00'),

-- StartupXYZ jobs
(7, 'Mobile App Developer Intern', 'Develop mobile applications for iOS and Android platforms. Work on user-facing features and learn about mobile development best practices.', '• Experience with React Native or Flutter\n• Knowledge of mobile UI/UX principles\n• Understanding of app store deployment\n• Git version control experience', 'Austin, TX', '$26-36/hour', 'internship', 'active', '2024-02-12 10:15:00'),
(7, 'Product Design Intern', 'Design user interfaces and experiences for our mobile applications. Work closely with developers and product managers to create intuitive designs.', '• Proficiency in Figma or Sketch\n• Understanding of design systems\n• Basic knowledge of user research\n• Portfolio of design work', 'Austin, TX (Hybrid)', '$24-34/hour', 'internship', 'active', '2024-02-15 13:20:00'),
(7, 'Full Stack Developer', 'Work on both frontend and backend development for our web platform. This is a full-time position with opportunities for growth.', '• Experience with React and Node.js\n• Database design experience\n• Understanding of web security\n• Agile development experience', 'Austin, TX', '$70,000-90,000/year', 'full-time', 'active', '2024-02-18 09:30:00');

-- Insert sample applications
INSERT INTO applications (student_id, job_id, status, cover_letter, resume_url, applied_at, reviewed_at) VALUES
-- John Doe's applications
(1, 1, 'pending', 'I am excited to apply for the Frontend Developer Intern position at TechCorp Solutions. As a Computer Science student with strong web development skills, I am eager to contribute to your team and learn from experienced developers.', 'https://example.com/resumes/john_doe_resume.pdf', '2024-02-20 10:00:00', NULL),
(1, 4, 'reviewed', 'I would love to join Innovate Labs as an AI Research Intern. My academic projects in machine learning have prepared me well for this opportunity, and I am particularly interested in your work on intelligent systems.', 'https://example.com/resumes/john_doe_resume.pdf', '2024-02-22 14:30:00', '2024-02-25 09:15:00'),

-- Sarah Smith's applications
(2, 3, 'accepted', 'With my background in Business Administration and marketing experience, I am well-suited for the Data Analyst Intern role. I am excited about the opportunity to work with user data and contribute to product decisions.', 'https://example.com/resumes/sarah_smith_resume.pdf', '2024-02-21 11:45:00', '2024-02-24 16:20:00'),
(2, 8, 'pending', 'I am interested in the Product Design Intern position at StartupXYZ. My design portfolio demonstrates my skills in UI/UX design, and I am eager to work on mobile application interfaces.', 'https://example.com/resumes/sarah_smith_resume.pdf', '2024-02-25 13:15:00', NULL),

-- Mike Johnson's applications
(3, 2, 'rejected', 'As an Engineering student specializing in software development, I am very interested in the Backend Developer Intern position. I have experience with Node.js and database design from my coursework.', 'https://example.com/resumes/mike_johnson_resume.pdf', '2024-02-19 15:20:00', '2024-02-23 10:45:00'),
(3, 5, 'accepted', 'I am excited to apply for the Machine Learning Engineer Intern position at Innovate Labs. My experience with Python and ML frameworks makes me a strong candidate for this role.', 'https://example.com/resumes/mike_johnson_resume.pdf', '2024-02-24 09:30:00', '2024-02-26 14:10:00'),

-- Emma Wilson's applications
(4, 7, 'pending', 'My design background and experience with mobile UI/UX make me a great fit for the Mobile App Developer Intern position. I am passionate about creating intuitive user experiences.', 'https://example.com/resumes/emma_wilson_resume.pdf', '2024-02-23 12:00:00', NULL),
(4, 8, 'reviewed', 'I am enthusiastic about the Product Design Intern role at StartupXYZ. My portfolio showcases my design skills, and I am excited to contribute to your mobile application designs.', 'https://example.com/resumes/emma_wilson_resume.pdf', '2024-02-26 10:45:00', '2024-02-28 11:30:00');

-- Update some jobs to show different statuses
UPDATE jobs SET status = 'filled' WHERE id = 3;
UPDATE jobs SET status = 'inactive' WHERE id = 6;