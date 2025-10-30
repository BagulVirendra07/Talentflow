import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function CandidateCard({ candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: candidate.id,
    data: { stage: candidate.stage },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded-xl shadow p-2 cursor-grab hover:bg-gray-50"
    >
      <p className="font-medium text-gray-800">{candidate.name}</p>
      <p className="text-sm text-gray-500">{candidate.email}</p>
    </div>
  );
}
