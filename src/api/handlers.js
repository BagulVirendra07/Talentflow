// src/api/handlers.js
import { rest } from 'msw';
import { db, latency, maybeFail } from '../db/dexie.js';

export const handlers = [
  // --- Jobs ---
  rest.get('/jobs', async (req, res, ctx) => {
    await latency();
    let all = await db.jobs.toArray();
    const search = req.url.searchParams.get('search') || '';
    const status = req.url.searchParams.get('status');
    const page = Number(req.url.searchParams.get('page') || '1');
    const pageSize = Number(req.url.searchParams.get('pageSize') || '50');

    if (search) all = all.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
    if (status) all = all.filter(j => j.status === status);

    const total = all.length;
    const items = all.slice((page - 1) * pageSize, page * pageSize);
    return res(ctx.json({ items, total, page, pageSize }));
  }),

  rest.post('/jobs', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const body = await req.json();
    const id = await db.jobs.add(body);
    return res(ctx.status(201), ctx.json({ ...body, id }));
  }),

  rest.patch('/jobs/:id', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const id = Number(req.params.id);
    const body = await req.json();
    await db.jobs.update(id, body);
    return res(ctx.json(await db.jobs.get(id)));
  }),

  rest.patch('/jobs/:id/reorder', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const id = Number(req.params.id);
    const { fromOrder, toOrder } = await req.json();
    const job = await db.jobs.get(id);
    if (job) {
      job.order = toOrder;
      await db.jobs.put(job);
    }
    return res(ctx.json({ fromOrder, toOrder }));
  }),

  // --- Candidates ---
  rest.get('/candidates', async (req, res, ctx) => {
    await latency();
    let all = await db.candidates.toArray();
    const search = req.url.searchParams.get('search') || '';
    const stage = req.url.searchParams.get('stage');
    const page = Number(req.url.searchParams.get('page') || '1');
    const pageSize = Number(req.url.searchParams.get('pageSize') || '50');

    if (search)
      all = all.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
    if (stage) all = all.filter(c => c.stage === stage);

    const total = all.length;
    const items = all.slice((page - 1) * pageSize, page * pageSize);
    return res(ctx.json({ items, total, page, pageSize }));
  }),

  rest.post('/candidates', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const body = await req.json();
    const id = await db.candidates.add(body);
    return res(ctx.status(201), ctx.json({ ...body, id }));
  }),

  rest.patch('/candidates/:id', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const id = Number(req.params.id);
    const body = await req.json();
    await db.candidates.update(id, body);
    return res(ctx.json(await db.candidates.get(id)));
  }),

  rest.get('/candidates/:id/timeline', async (req, res, ctx) => {
    await latency();
    const candidateId = Number(req.params.id);
    const events = await db.timelines.where('candidateId').equals(candidateId).toArray();
    return res(ctx.json(events || []));
  }),

  // --- Assessments ---
  rest.get('/assessments/:jobId', async (req, res, ctx) => {
    await latency();
    const jobId = Number(req.params.jobId);
    const entry = await db.assessments.get(jobId);
    return res(ctx.json(entry?.data || null));
  }),

  rest.put('/assessments/:jobId', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const jobId = Number(req.params.jobId);
    const data = await req.json();
    await db.assessments.put({ jobId, data });
    return res(ctx.json({ jobId, data }));
  }),

  rest.post('/assessments/:jobId/submit', async (req, res, ctx) => {
    await latency();
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'random write failure' }));
    const jobId = Number(req.params.jobId);
    const body = await req.json();
    await db.submissions.add({ jobId, ...body, submittedAt: Date.now() });
    return res(ctx.status(201), ctx.json({ ok: true }));
  }),
];
