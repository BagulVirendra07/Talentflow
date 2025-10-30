import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import SortableCandidate from "./SortableCandidate";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

// ✅ Static example candidate data (in real backend — fetched)
const candidateData = {
  id: 1,
  name: "Candidate 1",
  email: "candidate1@mail.com",
  phone: "9876543210",
  currentStage: "Interview",
  timeline: [
    { stage: "Applied", date: "2025-10-01" },
    { stage: "Screening", date: "2025-10-05" },
    { stage: "Interview", date: "2025-10-10" },
  ],
};

// Static stages for Kanban
const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];

// Static mention list
const mentionUsers = ["Viren", "Riya", "Arjun", "Sana", "Rohit"];

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(candidateData);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [filteredMentions, setFilteredMentions] = useState([]);

  // Handle notes typing with @mention detection
  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteInput(val);

    if (val.includes("@")) {
      const search = val.split("@").pop().toLowerCase();
      setFilteredMentions(
        mentionUsers.filter((u) => u.toLowerCase().startsWith(search))
      );
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (user) => {
    setNoteInput((prev) => prev.replace(/@\w*$/, `@${user} `));
    setShowMentions(false);
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes((n) => [...n, noteInput.trim()]);
      setNoteInput("");
    }
  };

  // Drag-drop Kanban handling
  const [board, setBoard] = useState({
    Applied: [],
    Screening: [],
    Interview: [{ ...candidate }],
    Offer: [],
    Hired: [],
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const fromStage = Object.keys(board).find((stage) =>
      board[stage].find((c) => c.id === active.id)
    );
    const toStage = over.id;

    if (fromStage !== toStage) {
      const movedCandidate = board[fromStage].find((c) => c.id === active.id);
      setBoard((prev) => ({
        ...prev,
        [fromStage]: prev[fromStage].filter((c) => c.id !== active.id),
        [toStage]: [...prev[toStage], movedCandidate],
      }));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Link to="/candidates">← Back to Candidates</Link>

      <h2>{candidate.name}</h2>
      <p>Email: {candidate.email}</p>
      <p>Phone: {candidate.phone}</p>

      {/* Timeline */}
      <h3>Timeline</h3>
      <ul>
        {candidate.timeline.map((t, i) => (
          <li key={i}>
            <strong>{t.stage}</strong> — <em>{t.date}</em>
          </li>
        ))}
      </ul>

      {/* Kanban board */}
      <h3>Move Between Stages</h3>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
          {stages.map((stage) => (
            <div
              key={stage}
              id={stage}
              style={{
                background: "#f8f9fa",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 10,
                minWidth: 180,
              }}
            >
              <h4>{stage}</h4>
              <SortableContext
                items={board[stage].map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {board[stage].map((c) => (
                  <div
                    key={c.id}
                    id={c.id}
                    style={{
                      background: "white",
                      padding: 10,
                      marginBottom: 8,
                      borderRadius: 4,
                      boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>

      {/* Notes Section */}
      <h3 style={{ marginTop: 30 }}>Notes</h3>
      <div>
        <textarea
          placeholder="Write a note... Use @ to mention"
          value={noteInput}
          onChange={handleNoteChange}
          rows={3}
          style={{ width: "100%", padding: 8 }}
        />
        {showMentions && (
          <div
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              position: "absolute",
              zIndex: 10,
              padding: 6,
              borderRadius: 4,
              width: 200,
            }}
          >
            {filteredMentions.map((u) => (
              <div
                key={u}
                onClick={() => handleMentionClick(u)}
                style={{ padding: "4px 6px", cursor: "pointer" }}
              >
                @{u}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleAddNote}
          style={{
            marginTop: 8,
            background: "#007bff",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Add Note
        </button>
      </div>

      <ul style={{ marginTop: 10 }}>
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
