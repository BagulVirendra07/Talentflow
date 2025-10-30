import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify } from "../../utils/slugify";

export default function JobForm({ existing = null, onClose }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [tags, setTags] = useState((existing?.tags || []).join(", "));
  const [error, setError] = useState("");

  const qc = useQueryClient();

  // --- Create Job Mutation ---
  const createJob = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch("/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Failed to create job");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries(["jobs"]),
  });

  // --- Update Job Mutation ---
  const updateJob = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch(`/jobs/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Failed to update job");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries(["jobs"]),
  });

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title required");
      return;
    }

    const slug = slugify(title);

    const payload = {
      title: title.trim(),
      slug,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: "active",
      order: existing?.order || Date.now(),
    };

    try {
      if (existing) {
        await updateJob.mutateAsync(payload);
      } else {
        await createJob.mutateAsync(payload);
      }
      onClose?.();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ marginTop: 12, padding: 12 }}>
      <h3>{existing ? "Edit Job" : "Create Job"}</h3>

      <form onSubmit={handleSave}>
        <div>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title"
          />
        </div>

        <div>
          <label>Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. frontend, react, ui"
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={createJob.isLoading || updateJob.isLoading}>
            {existing ? "Update" : "Save"}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        </div>
      </form>

      {error && (
        <div className="small" style={{ color: "red", marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}
