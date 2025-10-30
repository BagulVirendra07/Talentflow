import React, { useState, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";
import CandidatesBoard from "./CandidatesBoard"; // Kanban board

// Generate 1000 random candidates
const generateCandidates = () =>
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@mail.com`,
    stage: ["Applied", "Screening", "Interview", "Offer", "Hired"][
      Math.floor(Math.random() * 5)
    ],
  }));

const allCandidates = generateCandidates();

export default function CandidatesList() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const filtered = useMemo(() => {
    return allCandidates.filter(
      (c) =>
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())) &&
        (stageFilter === "" || c.stage === stageFilter)
    );
  }, [search, stageFilter]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Candidates</h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 6 }}
        />

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="">All Stages</option>
          <option>Applied</option>
          <option>Screening</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Hired</option>
        </select>

        <button
          onClick={() =>
            setViewMode((prev) => (prev === "list" ? "board" : "list"))
          }
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {viewMode === "list" ? "Switch to Kanban Board" : "Switch to List"}
        </button>
      </div>

      {viewMode === "list" ? (
        <List height={500} itemCount={filtered.length} itemSize={50} width="100%">
          {({ index, style }) => {
            const c = filtered[index];
            return (
              <div
                style={{
                  ...style,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderBottom: "1px solid #ddd",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{c.name}</strong> — <small>{c.email}</small>
                </div>
                <div>
                  <span style={{ color: "#555" }}>{c.stage}</span> |{" "}
                  <Link to={`/candidates/${c.id}`}>View</Link>
                </div>
              </div>
            );
          }}
        </List>
      ) : (
        <CandidatesBoard candidates={allCandidates} />
      )}
    </div>
  );
}
