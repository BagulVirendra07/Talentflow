import React from "react";

export default function RuntimeForm({ assessment }) {
  return (
    <form className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {assessment.title}
      </h3>

      {assessment.sections.map((section, sIdx) => (
        <div key={sIdx}>
          <h4 className="font-semibold text-gray-700 mb-2">
            {section.name}
          </h4>

          {section.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <label className="block font-medium text-gray-800 mb-1">
                {q.text}
              </label>

              {q.type === "short" && (
                <input
                  type="text"
                  className="border rounded w-full px-2 py-1"
                  placeholder="Type your answer"
                />
              )}

              {q.type === "long" && (
                <textarea
                  className="border rounded w-full px-2 py-1"
                  rows="3"
                  placeholder="Write your answer here..."
                ></textarea>
              )}

              {q.type === "numeric" && (
                <input
                  type="number"
                  className="border rounded w-full px-2 py-1"
                  placeholder="Enter a number"
                />
              )}

              {q.type === "file" && (
                <input type="file" className="border rounded w-full px-2 py-1" />
              )}

              {(q.type === "multi" || q.type === "single") &&
                q.options?.map((opt, i) => (
                  <label key={i} className="block mt-1">
                    <input
                      type={q.type === "multi" ? "checkbox" : "radio"}
                      name={q.text}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}
