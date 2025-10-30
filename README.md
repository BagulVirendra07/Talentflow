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


React + Vite 

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
