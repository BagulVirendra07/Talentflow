🧠 TalentFlow – Mini Hiring Platform (Frontend Only)

Live Demo: https://talentflow.vercel.app

GitHub Repo: https://github.com/your-username/talentflow


📋 Project Overview

TalentFlow is a React-based mini hiring platform that allows HR teams to manage jobs, candidates, and assessments efficiently — all without a backend.


🚀 Features

Create, edit, and archive jobs

Candidate application flow with progress tracking

Assessment management per job

Drag-and-drop Kanban-style workflow

Pagination and filtering for job lists


🏗️ Architecture

src/

 ├── components/

 │   ├── Assessments/  
 
 │   ├── Candidates/
 
 │   ├── Jobs/
 
 │   └── common/
 
 ├── hooks/
 
 ├── utils/
 
 ├── App.jsx
 
 ├── index.jsx



✨React + Vite 

React Query for state management

React Hook Form + Zod for validation

DND Kit for Kanban functionality



⚙️ Setup Instructions

Clone the repo

git clone https://github.com/your-username/talentflow.git

cd talentflow

Install dependencies

npm install

Run locally

npm run dev

Open http://localhost:5173/ in your browser.


🧩 Technical Decisions

React Query used instead of Redux for simpler caching.

DND Kit for smooth drag-and-drop.

React Hook Form + Zod ensures type-safe and flexible form validation.


🧱 Known Issues

No backend API (mock data used).

Refresh resets candidate data.

Kanban reorder not persisted.


📸Screenshot

Jobs Page
<img width="1876" height="839" alt="image" src="https://github.com/user-attachments/assets/36ac0220-c715-4a05-835b-d8d5a5a0718e" />

Candidate page
<img width="1877" height="795" alt="image" src="https://github.com/user-attachments/assets/5239d0b5-2aaf-41c4-a571-f80d85e95104" />

kanban board
<img width="1874" height="871" alt="image" src="https://github.com/user-attachments/assets/5c0bb808-5698-43ea-9dcb-7b21b1fb0700" />

Assessments Page
<img width="1893" height="794" alt="image" src="https://github.com/user-attachments/assets/9593b2cc-d671-4ae2-a95b-f0e4601077ac" />



