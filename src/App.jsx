import React from "react";
import KanbanBoard from "./components/Candidates/KanbanBoard";
import { Routes, Route, Link } from "react-router-dom";

import JobsBoard from "./components/Jobs/JobsBoard";
import JobDetail from "./components/Jobs/JobDetail";
import CandidatesList from "./components/Candidates/CandidatesList";
import CandidateProfile from "./components/Candidates/CandidateProfile";
import Builder from "./components/Assessments/Builder";
import RuntimeForm from "./components/Assessments/RuntimeForm";

export default function App() {
  return (
    
    <div className="container" style={{ padding: 20 }}>
      {/* 🌟 Header */}
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>TalentFlow</h1>
        <nav style={{ display: "flex", gap: "12px" }}>
          <Link to="/jobs">Jobs</Link>
          <Link to="/candidates">Candidates</Link>
          <Link to="/assessments">Assessments</Link>
        </nav>
      </header>

      {/* 🔗 Routes */}
      <Routes>
        {/* 🧠 Jobs Section */}
        <Route path="/" element={<JobsBoard />} />
        <Route path="/jobs" element={<JobsBoard />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />

        {/* 👥 Candidates Section */}
        <Route path="/candidates" element={<CandidatesList />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />

        {/* 🧾 Assessments Section */}
        <Route path="/assessments" element={<Builder />} />
        <Route path="/assessments/runtime/:assessmentId" element={<RuntimeForm />} />
      </Routes>
    </div>
  );
}
