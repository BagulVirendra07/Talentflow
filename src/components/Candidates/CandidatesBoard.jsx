import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];

export default function CandidatesBoard({ candidates }) {
  // Group candidates by stage
  const initial = stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {});

  const [columns, setColumns] = useState(initial);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [moved] = sourceCol.splice(source.index, 1);

    moved.stage = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>Candidates Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            padding: 20,
          }}
        >
          {stages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: "#f9f9f9",
                    borderRadius: 8,
                    padding: 10,
                    width: 250,
                    minHeight: 500,
                    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ textAlign: "center" }}>{stage}</h3>
                  {columns[stage].map((c, index) => (
                    <Draggable key={c.id} draggableId={String(c.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "white",
                            marginBottom: 8,
                            padding: 10,
                            borderRadius: 6,
                            boxShadow: "0 0 2px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            {c.email}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
