import { createServer, Model, RestSerializer } from 'miragejs';

export function makeServer() {
  return createServer({
    serializers: {
      application: RestSerializer,
    },

    models: {
      job: Model,
      candidate: Model,
      timeline: Model,
      assessment: Model,
      submission: Model,
    },

    seeds(server) {
      // Seed jobs
      for (let i = 1; i <= 25; i++) {
        server.create('job', {
          id: i,
          title: `Job ${i}`,
          slug: `job-${i}`,
          status: Math.random() > 0.3 ? 'active' : 'archived',
          tags: ['tag1', 'tag2'],
          order: i,
        });
      }

      const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

      // Seed candidates
      for (let i = 1; i <= 100; i++) {
        server.create('candidate', {
          id: i,
          name: `Candidate ${i}`,
          email: `candidate${i}@example.com`,
          stage: stages[Math.floor(Math.random() * stages.length)],
          jobId: Math.floor(Math.random() * 25) + 1,
        });
      }

      // Seed assessments for first 3 jobs
      for (let jobId = 1; jobId <= 3; jobId++) {
        const questions = Array.from({ length: 10 }, (_, q) => ({
          id: q + 1,
          type: 'short-text',
          question: `Question ${q + 1} for Job ${jobId}`,
          required: true,
        }));
        server.create('assessment', { jobId, data: { questions } });
      }
    },

    routes() {
      this.namespace = 'api';

      // ----------------- Jobs -----------------
      this.get('/jobs', (schema, request) => {
        let { search, status, page = 1, pageSize = 50, sort = 'order' } = request.queryParams;
        page = Number(page);
        pageSize = Number(pageSize);

        let jobs = schema.jobs.all().models;

        if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
        if (status) jobs = jobs.filter(j => j.status === status);
        jobs = jobs.sort((a, b) => (a[sort] > b[sort] ? 1 : -1));

        const total = jobs.length;
        const items = jobs.slice((page - 1) * pageSize, page * pageSize);

        return { items, total, page, pageSize };
      });

      this.post('/jobs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = schema.jobs.all().length + 1;
        return schema.jobs.create({ ...attrs, id, order: attrs.order || id });
      });

      this.patch('/jobs/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.find(id);
        return job.update(attrs);
      });

      this.patch('/jobs/:id/reorder', (schema, request) => {
        if (Math.random() < 0.07) return new Response(500, {}, { message: 'Random reorder failure' });

        const id = request.params.id;
        const { fromOrder, toOrder } = JSON.parse(request.requestBody);
        const job = schema.jobs.find(id);
        return job.update({ order: toOrder });
      });

      // ----------------- Candidates -----------------
      this.get('/candidates', (schema, request) => {
        let { search, stage, page = 1, pageSize = 50 } = request.queryParams;
        page = Number(page);
        pageSize = Number(pageSize);

        let candidates = schema.candidates.all().models;

        if (search)
          candidates = candidates.filter(
            c => c.name.toLowerCase().includes(search.toLowerCase()) ||
                 c.email.toLowerCase().includes(search.toLowerCase())
          );

        if (stage) candidates = candidates.filter(c => c.stage === stage);

        const total = candidates.length;
        const items = candidates.slice((page - 1) * pageSize, page * pageSize);

        return { items, total, page, pageSize };
      });

      this.post('/candidates', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = schema.candidates.all().length + 1;
        return schema.candidates.create({ ...attrs, id });
      });

      this.patch('/candidates/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const candidate = schema.candidates.find(id);

        // Save timeline
        schema.timelines.create({ candidateId: id, stage: attrs.stage, date: Date.now() });

        return candidate.update(attrs);
      });

      this.get('/candidates/:id/timeline', (schema, request) => {
        const candidateId = request.params.id;
        return schema.timelines.where({ candidateId }).all();
      });

      // ----------------- Assessments -----------------
      this.get('/assessments/:jobId', (schema, request) => {
        const jobId = Number(request.params.jobId);
        const entry = schema.assessments.find(jobId);
        return entry ? entry.attrs.data : null;
      });

      this.put('/assessments/:jobId', (schema, request) => {
        const jobId = Number(request.params.jobId);
        const data = JSON.parse(request.requestBody);
        const existing = schema.assessments.find(jobId);
        if (existing) existing.update({ data });
        else schema.assessments.create({ jobId, data });
        return { jobId, data };
      });

      this.post('/assessments/:jobId/submit', (schema, request) => {
        const jobId = Number(request.params.jobId);
        const attrs = JSON.parse(request.requestBody);
        return schema.submissions.create({ jobId, ...attrs, submittedAt: Date.now() });
      });
    },
  });
}
