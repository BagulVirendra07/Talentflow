// src/hooks/db.js
import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  assessments: "++id, title, sections",
  jobs: "++id, title, slug, status", // ✅ jobs table added
});

// Seed sample data
export async function seedIfNeeded() {
  const jobCount = await db.jobs.count();
  if (jobCount === 0) {
    const demoJobs = Array.from({ length: 25 }, (_, i) => ({
      title: `Job ${i + 1}`,
      slug: `job-${i + 1}`,
      status: i % 2 === 0 ? "active" : "archived",
    }));
    await db.jobs.bulkAdd(demoJobs);
    console.log("✅ Seeded 25 demo jobs (mixed active/archived)");
  }

  const count = await db.assessments.count();
  if (count > 0) return;

  // ✅ keep your existing assessment seeding logic
  const frontend = {
    title: "Assessment 1 — Frontend",
    sections: [
      {
        id: 1,
        name: "Section 1 - Frontend",
        questions: Array.from({ length: 12 }, (_, q) => {
          const i = q + 1;
          return {
            id: `f-${i}`,
            label: `Question ${i} (frontend)`,
            type: i % 5 === 1 ? "short" :
                  i % 5 === 2 ? "long" :
                  i % 5 === 3 ? "numeric" :
                  i % 5 === 4 ? "single-choice" :
                                "multi-choice",
            required: i % 3 === 0,
            maxLength: i % 5 === 2 ? 250 : undefined,
            range: i % 5 === 3 ? { min: 0, max: 10 } : undefined,
            options: (i % 5 === 4 || i % 5 === 0) ? ["A","B","C"] : undefined,
            condition: { dependsOn: "", value: "" }
          };
        })
      }
    ]
  };

  const backend = {
    title: "Assessment 2 — Backend",
    sections: [
      {
        id: 1,
        name: "Section 1 - Backend",
        questions: Array.from({ length: 12 }, (_, q) => {
          const i = q + 1;
          return {
            id: `b-${i}`,
            label: `Question ${i} (backend)`,
            type: i % 5 === 1 ? "short" :
                  i % 5 === 2 ? "long" :
                  i % 5 === 3 ? "numeric" :
                  i % 5 === 4 ? "single-choice" :
                                "multi-choice",
            required: i % 2 === 0,
            maxLength: i % 5 === 2 ? 300 : undefined,
            range: i % 5 === 3 ? { min: 1, max: 5 } : undefined,
            options: (i % 5 === 4 || i % 5 === 0) ? ["Yes","No","Maybe"] : undefined,
            condition: { dependsOn: "", value: "" }
          };
        })
      }
    ]
  };

  const dbs = {
    title: "Assessment 3 — Databases",
    sections: [
      {
        id: 1,
        name: "Section 1 - Databases",
        questions: Array.from({ length: 12 }, (_, q) => {
          const i = q + 1;
          return {
            id: `d-${i}`,
            label: `Question ${i} (db)`,
            type: i % 5 === 1 ? "short" :
                  i % 5 === 2 ? "long" :
                  i % 5 === 3 ? "numeric" :
                  i % 5 === 4 ? "single-choice" :
                                "multi-choice",
            required: false,
            maxLength: i % 5 === 2 ? 200 : undefined,
            range: i % 5 === 3 ? { min: 0, max: 20 } : undefined,
            options: (i % 5 === 4 || i % 5 === 0) ? ["Opt1","Opt2","Opt3"] : undefined,
            condition: { dependsOn: "", value: "" }
          };
        })
      }
    ]
  };

  await db.assessments.bulkAdd([frontend, backend, dbs]);
  console.log("✅ Seeded 3 assessments (12 questions each)");
}
