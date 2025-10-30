// src/components/Assessments/Preview.jsx
import React, { useState, useEffect } from "react";

export default function Preview({ assessments = [], onOpenRuntime }) {
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("af_answers") || "{}"));
  useEffect(()=> localStorage.setItem("af_answers", JSON.stringify(answers)), [answers]);

  function handleChange(qid, value) {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }

  function validateQuestion(q) {
    const v = answers[q.id];
    if (q.required && (v === undefined || v === "" || (Array.isArray(v) && v.length===0))) return "Required";
    if (q.type === "numeric" && v !== undefined && v !== ""){
      const n = Number(v);
      if (q.range?.min != null && n < q.range.min) return `Min ${q.range.min}`;
      if (q.range?.max != null && n > q.range.max) return `Max ${q.range.max}`;
    } 
    if (q.type === "long" && q.maxLength && v && v.length > q.maxLength) return `Max ${q.maxLength} chars`;
    return null;
  }

  if (!assessments || assessments.length === 0) return <div style={{ padding: 12 }}>No assessments yet</div>;

  return (
    <div style={{ padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
      <h3 style={{ marginTop: 0 }}>📋 Live Preview</h3>

      {assessments.map(a => (
        <div key={a.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <strong>{a.title}</strong>
            <button onClick={() => onOpenRuntime && onOpenRuntime(a.id)} style={{ padding:"6px 10px" }}>Open Form</button>
          </div>

          {a.sections?.map((s, si) => (
            <div key={si} style={{ marginTop:10 }}>
              <div style={{ fontWeight:600 }}>{s.name}</div>
              {s.questions?.map(q => {
                const show = !q.condition?.dependsOn || answers[q.condition.dependsOn] === q.condition.value;
                if (!show) return null;
                const err = validateQuestion(q);
                return (
                  <div key={q.id} style={{ marginTop:8 }}>
                    <label style={{ display:"block", fontWeight:500 }}>{q.label} {q.required && <span style={{color:"red"}}>*</span>}</label>

                    {q.type === "short" && <input value={answers[q.id]||""} onChange={e=>handleChange(q.id, e.target.value)} style={{width:"100%", padding:8}} />}

                    {q.type === "long" && <textarea value={answers[q.id]||""} onChange={e=>handleChange(q.id, e.target.value)} rows={3} style={{width:"100%", padding:8}} />}

                    {q.type === "numeric" && <input type="number" value={answers[q.id] ?? ""} onChange={e=>handleChange(q.id, e.target.value)} style={{width:"100%", padding:8}} />}

                    {q.type === "single-choice" && q.options?.map(opt => (
                      <div key={opt}><label><input type="radio" name={q.id} checked={answers[q.id]===opt} onChange={()=>handleChange(q.id,opt)} /> {opt}</label></div>
                    ))}

                    {q.type === "multi-choice" && q.options?.map(opt => {
                      const arr = answers[q.id] || [];
                      return <div key={opt}><label><input type="checkbox" checked={arr.includes(opt)} onChange={e=>{
                        const prev = answers[q.id] || [];
                        handleChange(q.id, e.target.checked ? [...prev, opt] : prev.filter(x=>x!==opt));
                      }} /> {opt}</label></div>;
                    })}

                    {q.type === "file" && <input type="file" onChange={e=>handleChange(q.id, e.target.files?.[0]?.name || "")} />}

                    {err && <div style={{ color:"red", fontSize:12 }}>{err}</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
