// 📂 src/store/useAssessmentStore.js
import { create } from "zustand";

export const useAssessmentStore = create((set) => ({
  assessments: [],

  // ✅ Load default 3 assessments
  fetchAssessments: () => {
    const defaultAssessments = [
      {
        id: 1,
        title: "Frontend Assessment",
        sections: [
          {
            name: "Section 1",
            questions: [
              { text: "What is React?", type: "short" },
              { text: "Explain virtual DOM.", type: "long" },
              { text: "What is JSX?", type: "short" },
              { text: "What is useState used for?", type: "short" },
              { text: "Define component lifecycle.", type: "long" },
              { text: "Select frontend frameworks you know:", type: "multi", options: ["React", "Vue", "Angular"] },
              { text: "Rate your HTML knowledge (1–10):", type: "numeric" },
              { text: "Upload sample UI design (optional):", type: "file" },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Backend Assessment",
        sections: [
          {
            name: "Section 1",
            questions: [
              { text: "What is REST API?", type: "short" },
              { text: "Explain middleware in Express.js", type: "long" },
              { text: "What is the purpose of JWT?", type: "short" },
              { text: "Select backend languages you use:", type: "multi", options: ["Node.js", "Python", "Java"] },
              { text: "What is status code 500?", type: "short" },
              { text: "Define microservices.", type: "long" },
              { text: "How many APIs have you built?", type: "numeric" },
            ],
          },
        ],
      },
      {
        id: 3,
        title: "Database Assessment",
        sections: [
          {
            name: "Section 1",
            questions: [
              { text: "What is a primary key?", type: "short" },
              { text: "Explain normalization.", type: "long" },
              { text: "Write SQL to fetch top 10 records.", type: "short" },
              { text: "Select databases you worked with:", type: "multi", options: ["MySQL", "MongoDB", "PostgreSQL"] },
              { text: "What is an index?", type: "short" },
              { text: "What is ACID property?", type: "long" },
              { text: "Estimate your DB query speed (1–10):", type: "numeric" },
            ],
          },
        ],
      },
    ];

    set({ assessments: defaultAssessments });
  },

  // ✅ Add a new assessment
  addAssessment: (title) =>
    set((state) => ({
      assessments: [
        ...state.assessments,
        {
          id: state.assessments.length + 1,
          title,
          sections: [{ name: "Section 1", questions: [] }],
        },
      ],
    })),

  // ✅ Add question to selected assessment
  addQuestion: (assessmentId, sectionName, question) =>
    set((state) => ({
      assessments: state.assessments.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              sections: a.sections.map((s) =>
                s.name === sectionName
                  ? { ...s, questions: [...s.questions, question] }
                  : s
              ),
            }
          : a
      ),
    })),
}));
