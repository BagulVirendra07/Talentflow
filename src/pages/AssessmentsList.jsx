import React, { useEffect, useState } from "react";

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetch("/assessments")
      .then((res) => res.json())
      .then((data) => setAssessments(data))
      .catch((err) => console.error("Error fetching assessments", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assessments</h1>
      {assessments.length === 0 ? (
        <p>Loading assessments...</p>
      ) : (
        <ul>
          {assessments.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> — {a.questions.length} Questions
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
