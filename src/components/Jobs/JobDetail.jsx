// src/components/Jobs/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../db/dexie"; // make sure path matches your dexie file

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      const jobData = await db.jobs.get(Number(jobId));
      setJob(jobData);
    }
    fetchJob();
  }, [jobId]);

  if (!job) return <div>Loading job details...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{job.title}</h2>
      <div>
        <strong>Slug:</strong> {job.slug}
      </div>
      <div>
        <strong>Status:</strong> {job.status}
      </div>
      <div>
        <strong>Tags:</strong> {(job.tags || []).join(", ")}
      </div>
      <div>
        <strong>Order:</strong> {job.order}
      </div>
    </div>
  );
}
