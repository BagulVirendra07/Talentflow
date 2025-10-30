// src/db/dexie.js
import Dexie from 'dexie';

// Create DB
export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  jobs: '++id, title, slug, status, tags, order',
  candidates: '++id, name, email, stage, jobId',
  timelines: '++id, candidateId, stage, date',
  assessments: '++id, jobId, title',
  questions: '++id, assessmentId, text, type, required, options, range',
  submissions: '++id, jobId, name, answers, submittedAt'
});

// latency helper (200–1200ms)
export const latency = (min = 200, max = 1200) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

// maybeFail (7-10% write error probability)
export const maybeFail = (rate = 0.08) => Math.random() < rate;

// Seed function — idempotent (runs only when empty)
export async function seedData() {
  const jobsCount = await db.jobs.count();
  const candidatesCount = await db.candidates.count();
  const assessmentsCount = await db.assessments.count();
  const questionsCount = await db.questions.count();

  // Seed jobs if empty
  if (jobsCount === 0) {
    const statuses = ['active', 'archived'];
    const jobs = Array.from({ length: 25 }, (_, i) => ({
      title: `Job ${i + 1}`,
      slug: `job-${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      tags: ['frontend', 'backend'],
      order: i + 1
    }));
    await db.jobs.bulkAdd(jobs);
    console.log('Seeded 25 jobs');
  }

  // Seed candidates if empty
  if (candidatesCount === 0) {
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
    const candidates = Array.from({ length: 1000 }, (_, i) => ({
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@example.com`,
      stage: stages[Math.floor(Math.random() * stages.length)],
      jobId: Math.floor(Math.random() * 25) + 1
    }));
    // bulkAdd in chunks to avoid large single transaction
    for (let i = 0; i < candidates.length; i += 200) {
      await db.candidates.bulkAdd(candidates.slice(i, i + 200));
    }
    console.log('Seeded 1000 candidates');
  }

  // Seed assessments + questions if empty
  if (assessmentsCount === 0 || questionsCount === 0) {
    // create 3 assessments (for jobId 1..3) each with 12 questions
    const types = ['short', 'long', 'single', 'multi', 'numeric', 'file'];
    for (let jobId = 1; jobId <= 3; jobId++) {
      const assessmentId = await db.assessments.add({
        jobId,
        title: `Assessment ${jobId}`
      });

      const qList = Array.from({ length: 12 }, (_, qIdx) => {
        const t = types[qIdx % types.length];
        const base = {
          assessmentId,
          text: `Question ${qIdx + 1} for Assessment ${jobId}`,
          type: t,
          required: Math.random() > 0.3,
          options: null,
          range: null
        };

        if (t === 'single' || t === 'multi') {
          base.options = [`Option A`, `Option B`, `Option C`];
        }
        if (t === 'numeric') {
          base.range = { min: 0, max: 100 };
        }
        return base;
      });

      // bulk add questions for this assessment
      await db.questions.bulkAdd(qList);
      console.log(`Seeded assessment ${assessmentId} with ${qList.length} questions`);
    }
  }

  console.log('✅ Dexie seed completed');
}
