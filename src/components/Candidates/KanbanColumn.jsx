import React from "react";
import { useDroppable } from "@dnd-kit/core";
import SortableCandidate from "./SortableCandidate";

export default function KanbanColumn({ id, title, candidates }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: "0 0 260px",
        background: isOver ? "#e8f5e9" : "#f8f9fa",
        border: "2px dashed #ccc",
        borderRadius: 10,
        padding: 12,
        minHeight: 400,
        transition: "background 0.2s ease",
      }}
    >
      <h3
        style={{
          textTransform: "capitalize",
          marginBottom: 10,
          fontSize: 16,
          fontWeight: 700,
          color: "#333",
        }}
      >
        {title}
      </h3>

      {candidates.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>No candidates</p>
      ) : (
        candidates.map((c) => (
          <SortableCandidate key={c.id} candidate={c} />
        ))
      )}
    </div>
  );
}
