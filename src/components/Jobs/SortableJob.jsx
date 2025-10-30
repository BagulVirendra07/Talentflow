import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import JobCard from "./JobCard";

export default function SortableJob({ job }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id }); // ✅ use job.id directly

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    marginBottom: "10px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard job={job} />
    </div>
  );
}
