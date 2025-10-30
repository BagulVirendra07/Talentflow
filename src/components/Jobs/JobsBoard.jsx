import React, { useState, useEffect } from "react";
import { useJobs, useReorderJob } from "../../hooks/useApi";
import JobCard from "./JobCard";
import SortableJob from "./SortableJob";
import { db, seedIfNeeded } from "../../hooks/db";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function JobBoard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState([]); // 👈 all jobs here (API + local)
  const pageSize = 10;

  const { data, isLoading, error } = useJobs({
    search,
    status,
    tags,
    page,
    pageSize,
  });

  const reorder = useReorderJob();

  // ✅ Load jobs from Dexie (for seeding once)
  useEffect(() => {
    seedIfNeeded();
  }, []);

  // ✅ When API (or filtered) data changes, update list
  useEffect(() => {
    if (data?.items) setItems(data.items);
  }, [data]);

  // ✅ Drag + Drop handler (works fine now)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems); // optimistic update

    reorder.mutate(
      { id: active.id, fromOrder: oldIndex, toOrder: newIndex },
      {
        onError: () => {
          setItems(items); // rollback on failure
          alert("⚠️ Reorder failed (Simulated network error)");
        },
      }
    );
  };

  // ➕ Add new job (works with Dexie + local UI)
  const handleAddJob = async () => {
    const title = prompt("Enter new job title:");
    if (!title) return;

    const newJob = {
      id: Date.now(),
      title,
      description: "Newly added job",
      status: "active",
    };

    await db.jobs.add(newJob);
    setItems((prev) => [...prev, newJob]);
  };

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs</div>;

  const total = data?.total || 0;

  return (
    <div style={{ padding: 20 }}>
      {/* 🔍 Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 6, flex: 1 }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="">All</option>
          <option value="active">Archived</option>
          <option value="archived">Unarchived</option>
        </select>

        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: 6, flex: 1 }}
        />

        <button
          style={{
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={handleAddJob}
        >
          + New Job
        </button>
      </div>

      {/* 🧾 Job List with Drag-Drop */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            items.map((job) => (
              <SortableJob key={job.id} id={job.id} job={job} />
            ))
          )}
        </SortableContext>
      </DndContext>

      {/* ⏩ Pagination */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          style={{ padding: "6px 10px", marginRight: 10 }}
        >
          Prev
        </button>

        <span>
          Page {page} / {Math.ceil(total / pageSize) || 1}
        </span>

        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "6px 10px", marginLeft: 10 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
