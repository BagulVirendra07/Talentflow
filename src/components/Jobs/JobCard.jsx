import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../../hooks/db";

export default function JobCard({ job }) {
  const qc = useQueryClient();

  const toggleStatus = useMutation(
    async (id) => {
      const current = await db.jobs.get(id);
      if (!current) throw new Error("Job not found");
      const newStatus = current.status === "active" ? "archived" : "active";
      await db.jobs.update(id, { status: newStatus });
      return { ...current, status: newStatus };
    },
    {
      onSuccess: () => qc.invalidateQueries(["jobs"]),
    }
  );

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <div>
        <h4 style={{ margin: "0 0 6px 0" }}>{job.title}</h4>
        <div style={{ fontSize: "14px", color: "#555" }}>
          #{job.id} •{" "}
          <span
            style={{
              color: job.status === "active" ? "green" : "gray",
              fontWeight: 500,
            }}
          >
            {job.status}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link
          to={`/jobs/${job.id}`}
          style={{
            textDecoration: "none",
            color: "#007bff",
            fontWeight: 500,
          }}
        >
          Open
        </Link>

        <button
          onClick={() => toggleStatus.mutate(job.id)}
          disabled={toggleStatus.isLoading}
          style={{
            padding: "6px 10px",
            backgroundColor:
              job.status === "active" ? "#ffc107" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {toggleStatus.isLoading
            ? "..."
            : job.status === "active"
            ? "Archive"
            : "Unarchive"}
        </button>
      </div>
    </div>
  );
}
