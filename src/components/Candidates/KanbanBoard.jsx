import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableCandidate from "./SortableCandidate";
import { db } from "../../db/dexie"; // correct import

export default function KanbanBoard() {
  // ✅ Define stages & some sample jobs
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  const jobs = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "ML Engineer",
    "DevOps Engineer",
    "UI/UX Designer",
    "QA Tester",
    "Project Manager",
    "Support Specialist",
  ];

  // ✅ Create 1000 candidates randomly assigned to jobs & stages
  const [candidates, setCandidates] = useState(() => {
    const arr = [];
    for (let i = 1; i <= 1000; i++) {
      const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
      const randomStage = stages[Math.floor(Math.random() * stages.length)];
      arr.push({
        id: i.toString(),
        name: `Candidate ${i}`,
        email: `candidate${i}@example.com`,
        job: randomJob,
        stage: randomStage,
      });
    }
    return arr;
  });

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ Handle drag-drop stage updates
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceId = active.id;
    const destinationId = over.id;

    const activeCandidate = candidates.find((c) => c.id === sourceId);
    if (!activeCandidate) return;

    // Only update stage if dropped into a valid stage column
    if (stages.includes(destinationId)) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === sourceId ? { ...c, stage: destinationId } : c
        )
      );
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Candidates Board</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            alignItems: "flex-start",
          }}
        >
          {stages.map((stage) => (
            <div
              key={stage}
              style={{
                flex: "0 0 250px",
                padding: 10,
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: 6,
                minHeight: 500,
              }}
            >
              <h3 style={{ textTransform: "capitalize", textAlign: "center" }}>
                {stage}
              </h3>

              <SortableContext
                id={stage}
                items={candidates
                  .filter((c) => c.stage === stage)
                  .map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {candidates
                  .filter((c) => c.stage === stage)
                  .map((candidate) => (
                    <SortableCandidate key={candidate.id} candidate={candidate} />
                  ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
