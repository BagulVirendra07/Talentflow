import React, { useEffect, useState } from "react";
import { useAssessmentStore } from "./useAssessmentStore";
import RuntimeForm from "./RuntimeForm";

export default function Builder() {
  const { assessments, fetchAssessments, addAssessment, addQuestion } =
    useAssessmentStore();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState({
    text: "",
    type: "short",
    options: "",
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleAddAssessment = () => {
    if (!newTitle.trim()) return;
    addAssessment(newTitle);
    setNewTitle("");
  };

  const handleAddQuestion = () => {
    if (!selectedAssessment) return alert("Select an assessment first!");
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = () => {
    const q = {
      text: questionData.text,
      type: questionData.type,
      options:
        questionData.type === "multi" || questionData.type === "single"
          ? questionData.options.split(",").map((o) => o.trim())
          : [],
    };

    addQuestion(selectedAssessment.id, "Section 1", q);
    setShowQuestionForm(false);
    setQuestionData({ text: "", type: "short", options: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-700 text-center">
          🧠 Assessment Builder
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* 🧱 Left Panel */}
          <div className="flex-1 bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-md border border-gray-100">
            {/* ➕ Add Assessment */}
            <div className="flex mb-6 gap-3">
              <input
                className="border border-gray-300 rounded-xl px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new assessment title..."
              />
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition-all"
                onClick={handleAddAssessment}
              >
                ➕ Add
              </button>
            </div>

            {/* 📜 Assessment List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {assessments.map((a) => (
                <button
                  key={a.id}
                  className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                    selectedAssessment?.id === a.id
                      ? "bg-blue-100 border border-blue-400 shadow-inner"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedAssessment(a)}
                >
                  {a.title}
                </button>
              ))}
            </div>

            {/* Add Question Button */}
            {selectedAssessment && (
              <button
                onClick={handleAddQuestion}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold shadow-md transition"
              >
                ➕ Add Question
              </button>
            )}

            {/* Question Form */}
            {showQuestionForm && (
              <div className="mt-6 p-5 border border-blue-100 rounded-2xl bg-gray-50/90 shadow-inner space-y-4">
                <h4 className="font-semibold text-gray-700 text-lg text-center">
                  ✍️ Add New Question
                </h4>

                <input
                  className="border w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Enter question text"
                  value={questionData.text}
                  onChange={(e) =>
                    setQuestionData({ ...questionData, text: e.target.value })
                  }
                />

                <select
                  className="border w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                  value={questionData.type}
                  onChange={(e) =>
                    setQuestionData({ ...questionData, type: e.target.value })
                  }
                >
                  <option value="single">Single Choice</option>
                  <option value="multi">Multi Choice</option>
                  <option value="short">Short Text</option>
                  <option value="long">Long Text</option>
                  <option value="numeric">Numeric (Range)</option>
                  <option value="file">File Upload</option>
                </select>

                {(questionData.type === "multi" ||
                  questionData.type === "single") && (
                  <input
                    className="border w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Enter options separated by commas"
                    value={questionData.options}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        options: e.target.value,
                      })
                    }
                  />
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                    onClick={handleSaveQuestion}
                  >
                    💾 Save
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl font-semibold hover:bg-gray-400 transition"
                    onClick={() => setShowQuestionForm(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👁️ Live Preview */}
          <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">
              👁️ Live Preview
            </h3>
            {selectedAssessment ? (
              <RuntimeForm assessment={selectedAssessment} />
            ) : (
              <p className="text-gray-500 text-center text-lg">
                Select an assessment to preview its questions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
