import React from "react";

export default function StageColumn({ id, title, children }) {
  return (
    <div
      id={id}
      className="bg-gray-100 rounded-2xl p-3 shadow-sm min-h-[70vh] flex flex-col gap-2"
    >
      <h2 className="text-center font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
