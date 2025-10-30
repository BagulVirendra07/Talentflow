import { rest } from 'msw';
import { db } from '../db/dexie.js'; // ✅ path correct

// ------------------ Helpers ------------------
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const maybeFail = () => Math.random() < 0.08; // ~8% failure rate
const makeSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// =============================================================
// 🧩 JOBS HANDLERS
// =============================================================
export const handlers = [
  // ------------------ GET /jobs ------------------
  rest.get('/jobs', async (req, res, ctx) => {
    await sleep(Math.random() * 1000 + 200);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random job fetch error' }));

    const search = req.url.searchParams.get('search') || '';
    const status = req.url.searchParams.get('status') || '';
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10');

    let jobs = await db.jobs.orderBy('order').toArray();
    if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
    if (status) jobs = jobs.filter(j => j.status === status);

    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const paginated = jobs.slice(start, start + pageSize);

    return res(ctx.status(200), ctx.json({ data: paginated, total }));
  }),

  // ------------------ POST /jobs ------------------
  rest.post('/jobs', async (req, res, ctx) => {
    await sleep(400);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random create error' }));

    const payload = await req.json();
    if (!payload.title) return res(ctx.status(400), ctx.json({ message: 'Title required' }));

    const baseSlug = makeSlug(payload.title);
    let slug = baseSlug, i = 1;
    while (await db.jobs.where('slug').equals(slug).count()) slug = `${baseSlug}-${i++}`;

    const order = (await db.jobs.count()) + 1;
    const jobId = await db.jobs.add({
      ...payload,
      slug,
      status: payload.status || 'active',
      order,
    });

    const job = await db.jobs.get(jobId);
    return res(ctx.status(201), ctx.json(job));
  }),

  // ------------------ PATCH /jobs/:id ------------------
  rest.patch('/jobs/:id', async (req, res, ctx) => {
    await sleep(400);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random update error' }));

    const id = Number(req.params.id);
    const updates = await req.json();

    if (updates.title) {
      const baseSlug = makeSlug(updates.title);
      let slug = baseSlug, i = 1;
      while (true) {
        const existing = await db.jobs.where('slug').equals(slug).first();
        if (!existing || existing.id === id) break;
        slug = `${baseSlug}-${i++}`;
      }
      updates.slug = slug;
    }

    await db.jobs.update(id, updates);
    const updated = await db.jobs.get(id);
    return res(ctx.status(200), ctx.json(updated));
  }),

  // ------------------ PATCH /jobs/:id/reorder ------------------
  rest.patch('/jobs/:id/reorder', async (req, res, ctx) => {
    await sleep(400);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Reorder failed' }));

    const { id } = req.params;
    const { fromOrder, toOrder } = await req.json();

    const jobs = await db.jobs.orderBy('order').toArray();
    const jobIndex = jobs.findIndex(j => j.id === Number(id));
    if (jobIndex === -1) return res(ctx.status(404), ctx.json({ message: 'Job not found' }));

    const [moved] = jobs.splice(jobIndex, 1);
    jobs.splice(toOrder - 1, 0, moved);

    await db.transaction('rw', db.jobs, async () => {
      for (let i = 0; i < jobs.length; i++) {
        await db.jobs.update(jobs[i].id, { order: i + 1 });
      }
    });

    return res(ctx.status(200), ctx.json(await db.jobs.get(Number(id))));
  }),

  // ------------------ PATCH /jobs/:id/archive ------------------
  rest.patch('/jobs/:id/archive', async (req, res, ctx) => {
    await sleep(400);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Archive toggle failed' }));

    const id = Number(req.params.id);
    const job = await db.jobs.get(id);
    if (!job) return res(ctx.status(404), ctx.json({ message: 'Job not found' }));

    const newStatus = job.status === 'archived' ? 'active' : 'archived';
    await db.jobs.update(id, { status: newStatus });
    const updated = await db.jobs.get(id);
    return res(ctx.status(200), ctx.json(updated));
  }),

  // =============================================================
  // 👥 CANDIDATES HANDLERS
  // =============================================================
  rest.get('/candidates', async (req, res, ctx) => {
    await sleep(300);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random candidate fetch error' }));

    const search = req.url.searchParams.get('search') || '';
    const stage = req.url.searchParams.get('stage') || '';
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10');

    let candidates = await db.candidates.toArray();
    if (search)
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      );
    if (stage) candidates = candidates.filter(c => c.stage === stage);

    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const paginated = candidates.slice(start, start + pageSize);

    return res(ctx.status(200), ctx.json({ data: paginated, total }));
  }),

  rest.patch('/candidates/:id', async (req, res, ctx) => {
    await sleep(400);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random update error' }));

    const id = Number(req.params.id);
    const data = await req.json();
    const candidate = await db.candidates.get(id);
    if (!candidate) return res(ctx.status(404), ctx.json({ message: 'Candidate not found' }));

    const updated = { ...candidate, ...data };
    await db.candidates.put(updated);
    return res(ctx.status(200), ctx.json(updated));
  }),

  // =============================================================
  // 🧠 ASSESSMENTS HANDLERS
  // =============================================================

  // ✅ GET all assessments with questions
  rest.get('/assessments', async (req, res, ctx) => {
    await sleep(300);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random fetch error' }));

    const assessments = await db.assessments.toArray();
    const full = [];
    for (const a of assessments) {
      const questions = await db.questions.where('assessmentId').equals(a.id).toArray();
      full.push({ ...a, questions });
    }

    return res(ctx.status(200), ctx.json(full));
  }),

  // ✅ GET /assessments/:id single with questions
  rest.get('/assessments/:id', async (req, res, ctx) => {
    await sleep(300);
    if (maybeFail()) return res(ctx.status(500), ctx.json({ message: 'Random fetch error' }));

    const id = Number(req.params.id);
    const a = await db.assessments.get(id);
    if (!a) return res(ctx.status(404), ctx.json({ message: 'Not found' }));

    const questions = await db.questions.where('assessmentId').equals(a.id).toArray();
    return res(ctx.status(200), ctx.json({ ...a, questions }));
  }),
];
