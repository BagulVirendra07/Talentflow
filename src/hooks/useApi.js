import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../db/dexie.js"; // ✅ ensure correct path

// 🌐 Simulate latency + 5–10% random error on writes
async function simulateNetwork(isWrite = false) {
  const delay = 200 + Math.random() * 1000;
  await new Promise((r) => setTimeout(r, delay));
  //if (isWrite && Math.random() < 0.1) throw new Error("Simulated network error");
}

// ------------------ 🧾 JOBS ------------------
export function useJobs(opts) {
  return useQuery({
    queryKey: ["jobs", opts],
    queryFn: async () => {
      await simulateNetwork();
      const { search = "", status = "", page = 1, pageSize = 10 } = opts;

      let jobs = await db.jobs.toArray();

      // 🔍 Filter logic
      if (search)
        jobs = jobs.filter((j) =>
          j.title.toLowerCase().includes(search.toLowerCase())
        );
      if (status) jobs = jobs.filter((j) => j.status === status);

      // 🔢 Pagination
      const start = (page - 1) * pageSize;
      const items = jobs.slice(start, start + pageSize);
      return { items, total: jobs.length };
    },
  });
}

// ------------------ 🔄 REORDER JOBS ------------------
export function useReorderJob() {
  const qc = useQueryClient();

  return useMutation({
    // 🧠 Optimistic update before server (Dexie) call
    onMutate: async ({ id, fromOrder, toOrder }) => {
      await qc.cancelQueries(["jobs"]);
      const previousJobs = qc.getQueryData(["jobs"]);

      // Optimistically reorder jobs in cache
      qc.setQueryData(["jobs"], (old) => {
        if (!old?.items) return old;
        const updated = [...old.items];
        const [moved] = updated.splice(fromOrder - 1, 1);
        updated.splice(toOrder - 1, 0, moved);
        return { ...old, items: updated };
      });

      return { previousJobs };
    },

    // 🧾 Real DB update
    mutationFn: async ({ id, fromOrder, toOrder }) => {
      await simulateNetwork(true);
      const job = await db.jobs.get(id);
      if (!job) throw new Error("Job not found");
      await db.jobs.update(id, { order: toOrder });
      return job;
    },

    // ✅ Refetch to sync Dexie data
    onSuccess: () => qc.invalidateQueries(["jobs"]),

    // ❌ Rollback if error occurs
    onError: (err, _, context) => {
      if (context?.previousJobs) {
        qc.setQueryData(["jobs"], context.previousJobs);
      }
    },
  });
}

// ------------------ 👥 CANDIDATES ------------------
export function useCandidates(opts) {
  return useQuery({
    queryKey: ["candidates", opts],
    queryFn: async () => {
      await simulateNetwork();
      const { search = "", stage = "", page = 1, pageSize = 12 } = opts;

      let candidates = await db.candidates.toArray();

      // 🔍 Filter logic
      if (search)
        candidates = candidates.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        );
      if (stage) candidates = candidates.filter((c) => c.stage === stage);

      // 🔢 Pagination
      const start = (page - 1) * pageSize;
      const items = candidates.slice(start, start + pageSize);
      return { items, total: candidates.length };
    },
  });
}

// ------------------ ✏️ UPDATE CANDIDATE ------------------
export function useUpdateCandidate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      await simulateNetwork(true);
      const candidate = await db.candidates.get(id);
      if (!candidate) throw new Error("Candidate not found");
      await db.candidates.update(id, data);
      return { ...candidate, ...data };
    },
    onSuccess: () => qc.invalidateQueries(["candidates"]),
  });
}
