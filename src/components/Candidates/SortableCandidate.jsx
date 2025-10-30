import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableCandidate({ candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "8px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <strong>{candidate.name}</strong>
      <br />
      <small>{candidate.email}</small>
      <br />
      <small>Job: {candidate.job}</small>
      <br />
      <small>Stage: {candidate.stage}</small>
    </div>
  );
}
