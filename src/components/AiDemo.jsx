import { useState, useRef, useEffect } from "react";

/* ─── colour helpers ─────────────────────────────────────────────────── */
const pctStroke = p => p > 80 ? "#16a34a" : p >= 50 ? "#ea580c" : p >= 20 ? "#dc2626" : "#334155";
const pctText   = p => p > 80 ? "#15803d" : p >= 50 ? "#c2410c" : p >= 20 ? "#b91c1c" : "#0f172a";
const pctBg     = p => p > 80 ? "#dcfce7" : p >= 50 ? "#ffedd5" : p >= 20 ? "#fee2e2" : "#f1f5f9";

function verdict(s) {
  if (s >= 85) return { label:"SCREEN SELECT",      emoji:"✅", fg:"#14532d", bg:"#dcfce7", bar:"#16a34a" };
  if (s >  80) return { label:"PARTIALLY SELECTED", emoji:"🟡", fg:"#7c2d12", bg:"#ffedd5", bar:"#ea580c" };
  return             { label:"REJECTED",            emoji:"❌", fg:"#7f1d1d", bg:"#fee2e2", bar:"#dc2626" };
}

/* ─── mini UI pieces ─────────────────────────────────────────────────── */
function Tag({ children, type = "match" }) {
  const styles = {
    match:   { background:"#dcfce7", color:"#14532d", border:"1px solid #86efac" },
    missing: { background:"#fee2e2", color:"#7f1d1d", border:"1px solid #fca5a5" },
    partial: { background:"#ffedd5", color:"#7c2d12", border:"1px solid #fdba74" },
  };
  return (
    <span style={{ fontSize:10, padding:"3px 8px", borderRadius:6, fontWeight:700, display:"inline-block", margin:2, ...styles[type] }}>
      {children}
    </span>
  );
}

function ScoreBar({ label, value, accent }) {
  const v = parseInt(value) || 0;
  return (
    <div style={{ textAlign:"center", padding:"16px 10px", borderRight:"1px solid #f1f5f9", flex:1, position:"relative" }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:accent }} />
      <div style={{ fontSize:24, fontWeight:900, color:pctText(v), marginBottom:3 }}>{v}%</div>
      <div style={{ fontSize:10, color:"#64748b", fontWeight:600, marginBottom:9 }}>{label}</div>
      <div style={{ height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden", margin:"0 6px" }}>
        <div style={{ height:"100%", width:`${v}%`, background:pctStroke(v), borderRadius:3, transition:"width 1.2s ease" }} />
      </div>
    </div>
  );
}

function SkillBar({ skill, percentage, status }) {
  const v = parseInt(percentage) || 0;
  const badge = status === "Matched"
    ? { bg:"#dcfce7", c:"#14532d" }
    : status === "Partial"
    ? { bg:"#ffedd5", c:"#7c2d12" }
    : { bg:"#fee2e2", c:"#7f1d1d" };
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <span style={{ fontSize:12, fontWeight:700, color:"#1e293b" }}>{skill}</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, fontWeight:800, background:badge.bg, color:badge.c }}>{status}</span>
          <span style={{ fontSize:13, fontWeight:900, color:pctText(v), minWidth:34, textAlign:"right" }}>{v}%</span>
        </div>
      </div>
      <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${v}%`, background:pctStroke(v), borderRadius:3, transition:"width 1.1s ease" }} />
      </div>
    </div>
  );
}

function SectionHead({ icon, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14,
      paddingBottom:9, borderBottom:"2px solid #f1f5f9" }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#94a3b8" }}>{title}</span>
    </div>
  );
}

/* ─── Sourcing SVG ───────────────────────────────────────────────────── */
function SourcingDiagram({ name }) {
  const parts = (name || "CANDIDATE").toUpperCase().split(" ");
  const line1 = parts[0] || "CANDIDATE";
  const line2 = parts.slice(1).join(" ") || "";
  const nodes = [
    [200,42,"🔗","LINKEDIN"],[320,72,"💼","JOB\nPORTALS"],[358,152,"📨","DIRECT\nAPPLY"],
    [314,234,"🤝","VENDOR\nNET"],[200,258,"📱","SOCIAL"],[84,232,"🏫","CAMPUS\nDRIVES"],
    [42,152,"👋","EMPLOYEE\nREFERRALS"],[76,72,"📋","NAUKRI\n.COM"],
  ];
  return (
    <svg viewBox="0 0 400 300" style={{ width:"100%", maxWidth:400 }}>
      <defs>
        <radialGradient id="rg1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#4c1d95"/></radialGradient>
      </defs>
      <circle cx="200" cy="150" r="62" fill="none" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="5,4"/>
      <circle cx="200" cy="150" r="96" fill="none" stroke="#c4b5fd" strokeWidth=".6" strokeDasharray="3,5"/>
      <g stroke="#c4b5fd" strokeWidth="1.1" strokeDasharray="5,4">
        {nodes.map(([cx,cy],i)=><line key={i} x1="200" y1="150" x2={cx} y2={cy}/>)}
      </g>
      <circle cx="200" cy="150" r="44" fill="url(#rg1)"/>
      <circle cx="200" cy="150" r="44" fill="none" stroke="#a78bfa" strokeWidth="2.5"/>
      <text x="200" y="143" textAnchor="middle" fill="rgba(255,255,255,.3)" fontSize="20">👤</text>
      <text x="200" y={line2 ? "160" : "164"} textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="800" fontFamily="system-ui" letterSpacing="0.8">{line1}</text>
      {line2 && <text x="200" y="171" textAnchor="middle" fill="rgba(255,255,255,.7)" fontSize="7.5" fontFamily="system-ui" letterSpacing="0.5">{line2}</text>}
      {nodes.map(([cx,cy,icon,lbl],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="25" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
          <text x={cx} y={cy+6} textAnchor="middle" fontSize="16">{icon}</text>
          {lbl.split("\n").map((l,j)=>(
            <text key={j} x={cx} y={cy+35+(j*10)} textAnchor="middle" fill="#3730a3" fontSize="7" fontWeight="800" fontFamily="system-ui" letterSpacing="0.5">{l}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ─── Loading bar ────────────────────────────────────────────────────── */
const STEPS = [
  { at:0,  t:"Initializing analysis engine…" },
  { at:12, t:"Extracting keywords from JD…" },
  { at:27, t:"Mapping candidate skills & experience…" },
  { at:44, t:"Evaluating work history & tenure…" },
  { at:60, t:"Running fake detection engine…" },
  { at:76, t:"Calculating final match scores…" },
  { at:90, t:"Generating evaluation report…" },
];
function Loader({ progress }) {
  const col = progress < 40 ? "#1d4ed8" : progress < 75 ? "#7c3aed" : "#10b981";
  const step = [...STEPS].reverse().find(s => s.at <= progress) || STEPS[0];
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16,
      padding:"36px 28px", textAlign:"center", marginTop:16 }}>
      <div style={{ fontSize:40, marginBottom:14, display:"inline-block", animation:"spin2 2s linear infinite" }}>🔍</div>
      <div style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>Achala.Ai is analyzing...</div>
      <div style={{ fontSize:13, color:"#64748b", marginBottom:22, minHeight:20 }}>{step.t}</div>
      <div style={{ background:"#f1f5f9", borderRadius:8, height:12, overflow:"hidden", marginBottom:10 }}>
        <div style={{ height:"100%", width:`${progress}%`, borderRadius:8,
          background:`linear-gradient(90deg,#1d4ed8,${col})`, transition:"width .4s ease" }} />
      </div>
      <div style={{ fontSize:28, fontWeight:900, color:col }}>{Math.round(progress)}%</div>
      <style>{`@keyframes spin2{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.1) rotate(10deg)}}`}</style>
    </div>
  );
}

/* ─── Upload zone ────────────────────────────────────────────────────── */
function UploadZone({ label, fileId, accent, value, onChange }) {
  const [fname, setFname] = useState("No file chosen");
  const [drag, setDrag] = useState(false);

  function process(file) {
    if (!file) return;
    setFname(file.name);
    if (/\.(txt|md|rtf)$/i.test(file.name)) {
      const r = new FileReader(); r.onload = e => onChange(e.target.result); r.readAsText(file);
    } else if (/\.pdf$/i.test(file.name)) {
      onChange("[PDF: " + file.name + " — reading…]");
      const go = () => readPDF(file, onChange);
      if (!window.pdfjsLib) {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; go(); };
        document.head.appendChild(s);
      } else go();
    } else if (/\.docx$/i.test(file.name)) {
      onChange("[DOCX: " + file.name + " — reading…]");
      const go = async () => {
        try {
          const ab = await file.arrayBuffer();
          const result = await window.mammoth.extractRawText({ arrayBuffer: ab });
          const text = (result.value || "").replace(/\r\n/g, "\n").trim();
          onChange(text || "[no text found — paste manually]");
        } catch {
          onChange("[DOCX error — paste text manually]");
        }
      };
      if (!window.mammoth) {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js";
        s.onload = go;
        document.head.appendChild(s);
      } else go();
    } else if (/\.doc$/i.test(file.name)) {
      onChange("[DOC format is not supported in browser — paste text manually]");
    } else {
      const r = new FileReader();
      r.onload = e => {
        const raw = new Uint8Array(e.target.result); let t = "";
        for (let i = 0; i < raw.length; i++) { const c = raw[i]; if ((c>=32&&c<127)||c===9||c===10||c===13) t+=String.fromCharCode(c); }
        onChange(t.replace(/ {4,}/g," ").replace(/\n{4,}/g,"\n\n").trim() || "[paste manually]");
      };
      r.readAsArrayBuffer(file);
    }
  }

  return (
    <div onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);process(e.dataTransfer.files[0]);}}
      style={{ border:`1.5px solid ${drag?accent:"#e2e8f0"}`, borderRadius:13,
        padding:15, background:drag?"#f0f9ff":"#fafafa", transition:"all .2s" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:10, flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:accent, display:"inline-block" }} />
          <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748b" }}>{label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <label htmlFor={fileId} style={{ display:"inline-flex", alignItems:"center", gap:5,
            padding:"6px 12px", borderRadius:8, border:`1.5px dashed ${accent}`,
            color:accent, fontSize:11, fontWeight:700, cursor:"pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>Upload file
          </label>
          <input type="file" id={fileId} accept=".txt,.pdf,.doc,.docx,.rtf,.md"
            style={{ display:"none" }} onChange={e=>process(e.target.files[0])}/>
          <span style={{ fontSize:11, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis",
            whiteSpace:"nowrap", color:fname==="No file chosen"?"#94a3b8":accent,
            fontWeight:fname==="No file chosen"?400:700 }}>{fname}</span>
        </div>
      </div>
      <textarea value={value} onChange={e=>onChange(e.target.value)}
        placeholder={`Paste ${label} here — or upload a file above (.txt .pdf .docx)\n\nDrag & drop also supported`}
        style={{ width:"100%", height:150, border:"1px solid #e2e8f0", borderRadius:9,
          background:"#fff", padding:"12px", fontFamily:"inherit", fontSize:12,
          lineHeight:1.7, color:"#0f172a", resize:"vertical", outline:"none",
          transition:"border-color .2s" }}/>
    </div>
  );
}

async function readPDF(file, cb) {
  try {
    const ab = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
    let txt = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const pg = await pdf.getPage(i);
      const c  = await pg.getTextContent();
      txt += c.items.map(x => x.str).join(" ") + "\n";
    }
    cb(txt.trim() || "[no text found — paste manually]");
  } catch { cb("[PDF error — paste text manually]"); }
}

/* ─── System prompt ──────────────────────────────────────────────────── */
const SYS = `You are an expert AI Resume Screening Assistant for Achala.Ai.
Analyze the provided Job Description and Candidate Resume carefully.
Return ONLY a single valid JSON object. No markdown. No backticks. No explanation. Just the raw JSON.

{
  "candidate_name": "<full name from resume, or Not Available>",
  "designation": "<role title from Job Description>",
  "profile_summary": "<exactly 2 professional sentences summarising the candidate's fit for this role>",
  "profile_match": {
    "overall_percentage": <integer 0-100>,
    "experience_match":   <integer 0-100>,
    "skills_match":       <integer 0-100>,
    "location_match_pct": <integer 0-100>,
    "keyword_match_pct":  <integer 0-100>
  },
  "skills_detail": [
    { "skill": "<skill name>", "percentage": <0-100>, "status": "<Matched|Partial|Missing>" }
  ],
  "work_history": [
    { "company": "<name>", "role": "<title>", "duration": "<e.g. 2 yrs 3 mo>", "from": "<year>", "to": "<year or Present>" }
  ],
  "linkedin":        "<URL string or null>",
  "contact_number":  "<phone string or null>",
  "email":           "<email string or null>",
  "location": {
    "candidate_location": "<city/state or Not Available>",
    "job_location":       "<city/state or Not Available>",
    "match_status":       "<Exact Match|Nearby Match|Mismatch|Not Available>"
  },
  "certifications": ["<cert name>"],
  "education": {
    "highest_degree": "<degree>",
    "field":          "<subject area>",
    "institution":    "<college/university>",
    "year":           "<graduation year or Not Available>"
  },
  "risk_analysis": {
    "risk_level": "<Low Risk|Medium Risk|High Risk>",
    "reasons":    ["<reason>"]
  },
  "keyword_match": {
    "percentage": <0-100>,
    "matched":    ["<keyword>"],
    "missing":    ["<keyword>"]
  }
}

EXTRACTION RULES:
- candidate_name, linkedin, contact_number, email → extract verbatim from resume; use null if absent.
- certifications → empty array [] if none found.
- work_history → list EVERY job found; most recent first.
- skills_detail → evaluate 8-10 skills mentioned in the JD against the resume.
- profile_summary → exactly 2 sentences, professional, no padding.
- Return ONLY the JSON object. Nothing before or after it.`;

function calculateTotalExperience(workHistory = []) {
  let totalMonths = 0;

  workHistory.forEach(w => {
    const duration = w.duration || "";

    const years = parseInt(duration.match(/(\d+)\s*yr/)?.[1] || 0);
    const months = parseInt(duration.match(/(\d+)\s*mo/)?.[1] || 0);

    totalMonths += years * 12 + months;
  });

  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;

  return `${y} yr${y !== 1 ? "s" : ""} ${m} mo${m !== 1 ? "s" : ""}`;
}

/* ─── PDF builder (uses jsPDF from CDN) ─────────────────────────────── */
async function buildPDF(d) {
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, M=14, CW=W-M*2; let y=0;

  const normalizeHex = h => {
    if (typeof h !== "string") return "#000000";
    const value = h.trim();
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  };
  const hx = h => { const c = normalizeHex(h).slice(1); return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]; };
  const sC = h => { const[r,g,b]=hx(h); doc.setTextColor(r,g,b); };
  const sF = h => { const[r,g,b]=hx(h); doc.setFillColor(r,g,b); };
  const sD = h => { const[r,g,b]=hx(h); doc.setDrawColor(r,g,b); };
  const safeNumber = n => Number.isFinite(Number(n)) ? Number(n) : 0;
  const rawText = doc.text.bind(doc);
  doc.text = (text, x, y, opts) => {
    if (text == null) return;
    if (typeof text === "number") text = String(text);
    if (typeof text === "object" && !Array.isArray(text)) text = String(text);
    return rawText(text, x, y, opts);
  };
  const chk = (n=18) => { if (y>275-n) { doc.addPage(); y=14; } };
  const bar = (x,yy,w,h,pct,col) => {
    if (!Number.isFinite(w) || !Number.isFinite(h)) return;
    sF("#f1f5f9"); doc.roundedRect(x,yy,w,h,2,2,"F");
    const[r,g,b]=hx(col); doc.setFillColor(r,g,b);
    const fw=(safeNumber(pct)/100)*w;
    if(fw>0) doc.roundedRect(x,yy,fw,h,2,2,"F");
  };

  const decodeHtml = str => {
    if (!str) return "";
    const t = document.createElement("textarea");
    t.innerHTML = String(str);
    return t.value || t.textContent || String(str);
  };

  const safeText = (input) => {
    if (!input) return "";

    let s = String(input);

    // Decode HTML safely
    const txt = document.createElement("textarea");
    txt.innerHTML = s;
    s = txt.value;

    // 🚨 CORE FIX: rebuild only valid readable characters
    let cleaned = "";
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);

      // allow:
      // letters, numbers, space, basic punctuation
      if (
        (c >= 32 && c <= 126) ||   // normal ASCII
        c === 10 || c === 13       // newline
      ) {
        cleaned += s[i];
      }
    }

    // remove repeated '&' patterns like H&y&d&e&r... (apply repeatedly until stable)
    let prev = "";
    while (prev !== cleaned) {
        prev = cleaned;
        cleaned = cleaned.replace(/([A-Za-z])&([A-Za-z])/g, "$1$2");
    }

    // remove any remaining stray &
    cleaned = cleaned.replace(/&+/g, "");

    // normalize spacing
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
  };

  d.candidate_name = safeText(d.candidate_name);
  d.designation = safeText(d.designation);
  d.profile_summary = safeText(d.profile_summary);

  if (d.location) {
    d.location.candidate_location = safeText(d.location.candidate_location);
    d.location.job_location = safeText(d.location.job_location);
    d.location.match_status = safeText(d.location.match_status);
  }

  d.contact_number = safeText(d.contact_number);
  d.email = safeText(d.email);

  const barText = (text, width) => doc.splitTextToSize(safeText(text), width);
  const bulletText = str => {
    const base = safeText(str);
    return "- " + base.replace(/^[••→]+[\s]*/u, "");
  };

  const pm = d.profile_match || {};
  const score = parseInt(pm.overall_percentage) || 0;
  const v = verdict(score);

  // ── PAGE 1 ──────────────────────────────────────────────────────────
  // dark header band
  sF("#0c1445"); doc.rect(0,0,W,20,"F");
  sF("#1d4ed8"); doc.rect(0,20,W,20,"F");
  sC("#ffffff"); doc.setFontSize(16); doc.setFont("helvetica","bold"); doc.text("Achala.Ai",M,12);
  doc.setFontSize(7); doc.setFont("helvetica","normal"); sC("#93c5fd"); doc.text("AI RECRUITMENT INTELLIGENCE REPORT",M,18);
  sC("#ffffff"); doc.setFontSize(18); doc.setFont("helvetica","bold"); doc.text(d.candidate_name||"Candidate",M,30);
  doc.setFontSize(10); doc.setFont("helvetica","normal"); sC("#bfdbfe"); doc.text(d.designation||"",M,37);

  // verdict pill
  // const[vlr,vlg,vlb]=hx("#fff"); doc.setFillColor(vlr,vlg,vlb);
  // doc.roundedRect(W-M-54,22,54,14,3,3,"F");
  // const[vcr,vcg,vcb]=hx(v.fg); doc.setTextColor(vcr,vcg,vcb);
  // doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.text(score+"%",W-M-27,30,{align:"center"});
  // doc.setFontSize(6.5); doc.text(v.emoji+" "+v.label,W-M-27,35,{align:"center"});
  // y=48;

  const pillColor = v.bar || "#16a34a";
  sF(pillColor);
  doc.roundedRect(W - M - 54, 22, 54, 14, 3, 3, "F");
  sC("#ffffff");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(String(score) + "%", W - M - 27, 30, { align: "center" });
  const verdictText = doc.splitTextToSize(`${v.label}`, 48);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(verdictText, W - M - 27, 35, { align: "center" });
  y = 48;

  // contacts row
  // const ct=[d.contact_number&&"📞 "+d.contact_number, d.email&&"✉ "+d.email, d.location?.candidate_location&&"📍 "+d.location.candidate_location].filter(Boolean);
  // if(ct.length){ sF("#f0f9ff"); doc.rect(M,y,CW,9,"F"); sD("#bfdbfe"); doc.rect(M,y,CW,9,"S"); sC("#1e40af"); doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.text(ct.join("   |   "),M+3,y+6); y+=12; }

  const ct = [
      d.contact_number ? "Ph: " + d.contact_number : null,
      d.email ? "Email: " + d.email : null,
      d.location?.candidate_location ? "Location: " + d.location.candidate_location : null
  ].filter(Boolean);
  if (ct.length) {
    sF("#f0f9ff");
    doc.roundedRect(M, y, CW, 9, 1.5, 1.5, "F");
    sD("#bfdbfe");
    doc.rect(M, y, CW, 9, "S");
    sC("#1e40af");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const contactLines = doc.splitTextToSize(ct.join(" | "), CW - 10);

    doc.setFontSize(8);
    doc.setLineHeightFactor(1.4);

    doc.text(contactLines, M + 4, y + 6);

    y += 6 + contactLines.length * 6;
  }

  // profile summary
  // y+=3; sF("#eff6ff"); doc.roundedRect(M,y,CW,17,2,2,"F");
  // sC("#1d4ed8"); doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.text("PROFILE SUMMARY",M+3,y+6);
  // sC("#374151"); doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  // const sl=doc.splitTextToSize(d.profile_summary||"",CW-6); doc.text(sl.slice(0,2),M+3,y+12); y+=21;

  // y += 3;
  // sF("#eff6ff");
  // doc.roundedRect(M, y, CW, 17, 2, 2, "F");
  // sC("#1d4ed8");
  // doc.setFontSize(8);
  // doc.setFont("helvetica", "bold");
  // doc.text("PROFILE SUMMARY", M + 3, y + 6);
  // sC("#374151");
  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(8.5);
  // const summaryLines = doc.splitTextToSize(safeText(d.profile_summary || "N/A"), CW - 6);
  // doc.text(summaryLines, M + 3, y + 12);
  // y += 21;

  y += 3;

  const summary = safeText(d.profile_summary || "N/A");
  const summaryLines = doc.splitTextToSize(summary, CW - 10);

  // MORE breathing space
  const summaryHeight = Math.max(24, 12 + summaryLines.length * 6);

  sF("#eff6ff");
  doc.roundedRect(M, y, CW, summaryHeight, 2, 2, "F");

  // Title
  sC("#1d4ed8");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PROFILE SUMMARY", M + 4, y + 5);

  // Text
  sC("#374151");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setLineHeightFactor(1.4);

  doc.text(summaryLines, M + 4, y + 12, {
    maxWidth: CW - 10
  });

  y += summaryHeight + 4;

  // verdict banner
  // const[vlr2,vlg2,vlb2]=hx(v.bg); doc.setFillColor(vlr2,vlg2,vlb2); doc.roundedRect(M,y,CW,13,2,2,"F");
  // const[vcr2,vcg2,vcb2]=hx(v.fg); doc.setTextColor(vcr2,vcg2,vcb2);
  // doc.setFontSize(11); doc.setFont("helvetica","bold");
  // doc.text("SCREENING RESULT: "+v.emoji+" "+v.label+" — "+score+"%",W/2,y+9,{align:"center"}); y+=17;

  const screeningTitle = "SCREENING RESULT";
  const screeningSubtitle = `${v.label} (${score}%)`;
  const subtitleLines = doc.splitTextToSize(safeText(screeningSubtitle), CW - 20);
  const bannerHeight = 14 + subtitleLines.length * 5;

  const bannerBg = v.bg || "#dcfce7";
  const bannerTextColor = v.fg || "#14532d";

  const [bgr, bgg, bgb] = hx(bannerBg);
  doc.setFillColor(bgr, bgg, bgb);
  doc.roundedRect(M, y, CW, bannerHeight, 2, 2, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  sC("#0f172a"); // FIX: dark text instead of white
  doc.text(screeningTitle, M + CW / 2, y + 6, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const [tr, tg, tb] = hx(bannerTextColor);
  doc.setTextColor(tr, tg, tb);
  doc.text(subtitleLines, M + CW / 2, y + 11, { align: "center" });

  y += bannerHeight + 8;

  // score bars
  doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("MATCH SCORE OVERVIEW",M,y); y+=6;
  [["Overall Match",pm.overall_percentage],["Experience",pm.experience_match],["Skills",pm.skills_match],["Location",pm.location_match_pct],["Keywords",pm.keyword_match_pct]].forEach(([lbl,val])=>{
    chk(10); const v2=parseInt(val)||0; const col=pctStroke(v2); const tc=pctText(v2);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); sC("#374151"); doc.text(lbl,M,y+4.5);
    bar(M+36,y-1,CW-46,7,v2,col);
    const[tr,tg,tb]=hx(tc); doc.setTextColor(tr,tg,tb); doc.setFont("helvetica","bold"); doc.text(v2+"%",W-M,y+4.5,{align:"right"}); y+=9;
  }); y+=8;

  // work history
  // chk(12); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("WORK HISTORY & TENURE",M,y); y+=6;
  // (d.work_history||[]).forEach(w=>{ chk(15); const isA=w.to==="Present"; const bc=isA?"#10b981":"#1d4ed8"; const bg3=isA?"#f0fdf4":"#f0f9ff";
  //   const[bgr,bgg,bgb]=hx(bg3); doc.setFillColor(bgr,bgg,bgb); doc.roundedRect(M,y,CW,13,2,2,"F");
  //   const[lr,lg,lb]=hx(bc); doc.setFillColor(lr,lg,lb); doc.rect(M,y,2,13,"F");
  //   sC("#0f172a"); doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.text(w.company||"",M+5,y+5.5);
  //   sC("#64748b"); doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.text(w.role||"",M+5,y+10);
  //   const ds=(w.from||"")+(w.to?" – "+w.to:"")+(w.duration?" ("+w.duration+")":"");
  //   doc.setTextColor(lr,lg,lb); doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.text(ds,W-M,y+5.5,{align:"right"}); y+=15;
  // });

  chk(12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  sC("#0f172a");
  const totalExp = calculateTotalExperience(d.work_history || []);
  doc.text(`WORK HISTORY & TENURE (${totalExp})`, M, y);
  y += 6;
  (d.work_history || []).forEach(w => {
    chk(15);
    const isActive = w.to === "Present";
    const bx = isActive ? "#10b981" : "#1d4ed8";
    const bgc = isActive ? "#f0fdf4" : "#f0f9ff";
    const [rR, rG, rB] = hx(bgc);
    doc.setFillColor(rR, rG, rB);
    doc.roundedRect(M, y, CW, 13, 2, 2, "F");
    const [barR, barG, barB] = hx(bx);
    doc.setFillColor(barR, barG, barB);
    doc.rect(M, y, 2, 13, "F");
    sC("#0f172a");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(safeText(w.company || "Unknown"), M + 5, y + 5.5);
    sC("#64748b");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(safeText(w.role || ""), M + 5, y + 10);

    const ds = `${safeText(w.from || "")}${w.to ? ` – ${safeText(w.to)}` : ""}${w.duration ? ` (${safeText(w.duration)})` : ""}`.trim();
    doc.text(ds, W - M - 6, y + 5.5, { align: "right", maxWidth: CW - 54 });

    y += 15;
  });

  // ── PAGE 2 ──────────────────────────────────────────────────────────
  doc.addPage(); y=14;
  doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("SKILLS MATCH IN DETAIL",M,y); y+=6;
  (d.skills_detail||[]).forEach(s=>{ chk(11); const v2=parseInt(s.percentage)||0; const col=pctStroke(v2); const tc=pctText(v2);
    const sb=s.status==="Matched"?"#14532d":s.status==="Partial"?"#7c2d12":"#7f1d1d";
    const sbg=s.status==="Matched"?"#dcfce7":s.status==="Partial"?"#ffedd5":"#fee2e2";
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); sC("#374151"); doc.text(s.skill,M,y+4.5);
    const[bbr,bbg,bbb]=hx(sbg); doc.setFillColor(bbr,bbg,bbb); doc.roundedRect(M+50,y-1,22,7,2,2,"F");
    const[sbr,sbg2,sbb]=hx(sb); doc.setTextColor(sbr,sbg2,sbb); doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.text(s.status,M+61,y+4.5,{align:"center"});
    bar(M+74,y-1,CW-84,7,v2,col);
    const[tr,tg,tb]=hx(tc); doc.setTextColor(tr,tg,tb); doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.text(v2+"%",W-M,y+4.5,{align:"right"}); y+=10;
  }); y+=8;

  // certifications
  chk(10); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("CERTIFICATIONS",M,y); y+=4;
  if((d.certifications||[]).length){ (d.certifications||[]).forEach(c=>{ chk(8); sC("#15803d"); doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text("•", M, y + 4); sC("#374151"); doc.setFont("helvetica","normal"); doc.text(c,M+6,y+4); y+=7; }); }
  else{ sC("#94a3b8"); doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.text("N/A — No certifications found",M,y+4); y+=8; }
  y+=5;

  // education
  chk(20); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("HIGHEST EDUCATION",M,y); y+=6;
  const edu=d.education||{};
  if(edu.highest_degree){ sF("#eff6ff"); doc.roundedRect(M,y,CW,18,2,2,"F"); sC("#1d4ed8"); doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.text(edu.highest_degree,M+4,y+8);
    sC("#64748b"); doc.setFontSize(8.5); doc.setFont("helvetica","normal");
    let el=""; if(edu.field)el+=edu.field; if(edu.institution)el+=" | "+edu.institution; if(edu.year&&edu.year!=="Not Available")el+=" | "+edu.year;
    doc.text(el,M+4,y+14); y+=22;
  }else{ sC("#94a3b8"); doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.text("Not Available",M,y+4); y+=9; }
  y+=4;

  // risk
  chk(20); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("FAKE IDENTIFICATION / RISK ANALYSIS",M,y); y+=6;
  const risk=d.risk_analysis||{}; const rl=(risk.risk_level||"").toLowerCase();
  const rbg=rl.includes("low")?"#dcfce7":rl.includes("medium")?"#ffedd5":"#fee2e2";
  const rtc=rl.includes("low")?"#14532d":rl.includes("medium")?"#7c2d12":"#7f1d1d";
  const[rbgr,rbgg,rbgb]=hx(rbg); doc.setFillColor(rbgr,rbgg,rbgb); doc.roundedRect(M,y,CW,10,2,2,"F");
  const[rtcr,rtcg,rtcb]=hx(rtc); doc.setTextColor(rtcr,rtcg,rtcb); doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text(risk.risk_level||"Low Risk",W/2,y+7,{align:"center"}); y+=14;
  (risk.reasons||["No significant red flags detected."]).forEach(r=>{ chk(8); sC("#1d4ed8"); doc.setFont("helvetica","bold"); doc.setFontSize(9); 
  doc.text("•",M,y+4); 
  sC("#64748b"); 
  doc.setFont("helvetica","normal"); 
  const ls=doc.splitTextToSize(safeText(r),CW-8); doc.text(ls,M+5,y+4); y+=ls.length*5+3; }); y+=6;

  // keywords
  chk(28); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("KEYWORD MATCH",M,y); y+=6;
  const kw=d.keyword_match||{};
  bar(M,y,CW,8,kw.percentage||0,pctStroke(kw.percentage||0));
  const[ktr,ktg,ktb]=hx(pctText(kw.percentage||0)); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text((kw.percentage||0)+"%",W/2,y+5.5,{align:"center"}); y+=12;
  if((kw.matched||[]).length){ chk(8); sC("#14532d"); doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.text("Matched:",M,y+4); sC("#374151"); doc.setFont("helvetica","normal"); const mt=doc.splitTextToSize((kw.matched||[]).join(", "),CW-22); doc.text(mt,M+22,y+4); y+=mt.length*5+3; }
  if((kw.missing||[]).length){ chk(8); sC("#7f1d1d"); doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.text("Missing:",M,y+4); sC("#374151"); doc.setFont("helvetica","normal"); const mx=doc.splitTextToSize((kw.missing||[]).join(", "),CW-22); doc.text(mx,M+22,y+4); y+=mx.length*5+3; } y+=4;

  // location
  // chk(22); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("LOCATION MATCH",M,y); y+=6;
  // const loc=d.location||{}; const ls=loc.match_status||"Not Available";
  // const lbg=ls.includes("Exact")?"#dcfce7":ls.includes("Nearby")?"#ffedd5":"#fee2e2";
  // const ltc=ls.includes("Exact")?"#14532d":ls.includes("Nearby")?"#7c2d12":"#7f1d1d";
  // const[lbgr,lbgg,lbgb]=hx(lbg); doc.setFillColor(lbgr,lbgg,lbgb); 
  // const[ltcr,ltcg,ltcb]=hx(ltc); doc.setTextColor(ltcr,ltcg,ltcb); doc.setFont("helvetica","bold"); doc.setFontSize(9);
  // const locText = `${safeText(loc.candidate_location || "N/A")} → ${safeText(loc.job_location || "N/A")} (${safeText(ls)})`;

  // const locLines = doc.splitTextToSize(locText, CW - 10);
  // const locHeight = Math.max(10, locLines.length * 5 + 6);
  
  // doc.roundedRect(M, y, CW, locHeight, 2, 2, "F");

  // doc.setFont("helvetica", "bold");
  // doc.setFontSize(9);

  // doc.text(locLines, W / 2, y + 6, {
  //   align: "center",
  //   maxWidth: CW - 10
  // });

  // y += locHeight + 4;
  
  chk(22); doc.setFontSize(10); doc.setFont("helvetica","bold"); sC("#0f172a"); doc.text("LOCATION MATCH",M,y); y+=6;
  const loc = d.location || {};
  const ls = loc.match_status || "Not Available";
  const lbg=ls.includes("Exact")?"#dcfce7":ls.includes("Nearby")?"#ffedd5":"#fee2e2";
  const ltc=ls.includes("Exact")?"#14532d":ls.includes("Nearby")?"#7c2d12":"#7f1d1d";
  const[lbgr,lbgg,lbgb]=hx(lbg); doc.setFillColor(lbgr,lbgg,lbgb); 
  const[ltcr,ltcg,ltcb]=hx(ltc); doc.setTextColor(ltcr,ltcg,ltcb);

  const cleanLoc = (s) => String(s || "").replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim();
  const locText = `${cleanLoc(loc.candidate_location) || "N/A"} -> ${cleanLoc(loc.job_location) || "N/A"} (${cleanLoc(ls)})`;

  const locLines = doc.splitTextToSize(locText, CW - 16);
  const locHeight = Math.max(12, locLines.length * 6 + 6);

  doc.roundedRect(M, y, CW, locHeight, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  // better vertical alignment
  doc.text(locLines, W / 2, y + 7, {
    align: "center",
    maxWidth: CW - 16
  });

  y += locHeight + 6;

  // ── SCREENING CRITERIA LEGEND ──
  chk(40);
  y += 6;
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); sC("#0f172a");
  doc.text("SCREENING CRITERIA", M, y); y += 8;

  const criteria = [
    { pct: "85%+",   label: "Screen Select",  bg: "#dcfce7", tc: "#15803d" },
    { pct: "80-85%", label: "Partial Select", bg: "#ffedd5", tc: "#c2410c" },
    { pct: "<80%",   label: "Rejected",       bg: "#fee2e2", tc: "#b91c1c" },
  ];

  const boxW = (CW - 10) / 3;  // 3 equal boxes with 5px gap between
  const boxH = 22;
  const gap  = 5;

  criteria.forEach((item, i) => {
    const bx = M + i * (boxW + gap);

    // background fill
    const [bgr, bgg, bgb] = hx(item.bg);
    doc.setFillColor(bgr, bgg, bgb);
    doc.roundedRect(bx, y, boxW, boxH, 3, 3, "F");

    // percentage text — large & bold
    const [tcr, tcg, tcb] = hx(item.tc);
    doc.setTextColor(tcr, tcg, tcb);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(item.pct, bx + boxW / 2, y + 10, { align: "center" });

    // label text — smaller, grey
    sC("#fff");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, bx + boxW / 2, y + 17, { align: "center" });
  });

  y += boxH + 10;

  // footer every page
  const tot=doc.getNumberOfPages();
  for(let i=1;i<=tot;i++){ doc.setPage(i); sF("#f8fafc"); doc.rect(0,286,W,12,"F"); sD("#e2e8f0"); doc.line(0,286,W,286); sC("#94a3b8"); doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.text("Achala.Ai — AI Recruitment Intelligence | Confidential",M,293); doc.text(new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),W/2,293,{align:"center"}); doc.text("Page "+i+" of "+tot,W-M,293,{align:"right"}); }

  doc.save("AchalaAI_Report_"+(d.candidate_name||"Candidate").replace(/\s+/g,"_")+".pdf");
}

/* ─── MAIN EXPORT ────────────────────────────────────────────────────── */
export default function AchalaAi() {
  const [jd,      setJd]      = useState("");
  const [resume,  setResume]  = useState("");
  const [loading, setLoading] = useState(false);
  const [progress,setProgress]= useState(0);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [view,    setView]    = useState("report");
  const [font,    setFont]    = useState("system-ui,-apple-system,sans-serif");
  const [dlBusy,  setDlBusy]  = useState(false);
  const timerRef  = useRef(null);
  const resultRef = useRef(null);

  /* progress ticker */
  function startProgress() {
    setProgress(0);
    let p=0, ti=0;
    const targets=[10,24,40,55,68,82,93];
    timerRef.current = setInterval(()=>{
      if(ti<targets.length){ p=Math.min(p+(Math.random()*2.5+0.6),targets[ti]); if(p>=targets[ti])ti++; setProgress(Math.round(p)); }
    },350);
  }
  function stopProgress(){ clearInterval(timerRef.current); setProgress(100); }

  /* analyze */
  async function analyze() {
    if(!jd.trim()||!resume.trim()){ setError("Please provide both a Job Description and a Candidate Resume."); return; }
    setError(""); setResult(null); setLoading(true); startProgress();
    try {
      const azureDeployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
      const apiUrl = azureDeployment ? "/api/azure-openai/chat/completions" : import.meta.env.VITE_OPENAI_API_BASE_URL || "/api/openai/v1/chat/completions";
      const model = azureDeployment || "gpt-4o-mini";
      const res = await fetch(apiUrl,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model,
          max_tokens:2000,
          temperature:0.2,
          messages:[
            { role:"system", content:SYS },
            { role:"user", content:"JOB DESCRIPTION:\n"+jd+"\n\n---\n\nCANDIDATE RESUME:\n"+resume }
          ]
        })
      });
      if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error?.message||"HTTP "+res.status); }
      const data = await res.json();
      const raw  = (data.choices||[]).map(c=>c.message?.content||"").join("\n").trim();
      if(!raw) throw new Error("Response contained no content");
      const s    = raw.indexOf("{"); const e2 = raw.lastIndexOf("}");
      if(s===-1||e2===-1) throw new Error("Response contained no JSON object");
      const parsed = JSON.parse(raw.slice(s,e2+1));
      stopProgress();
      setTimeout(()=>{ setResult(parsed); setLoading(false); setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120); },500);
    } catch(err) {
      stopProgress(); setLoading(false);
      const message = err.message === "Failed to fetch"
        ? "Network error: could not reach the API proxy. Start the local dev proxy and set your Azure or OpenAI API environment variables."
        : err.message;
      setError("Analysis failed: "+message);
    }
  }

  async function download() {
    if(!result) return;
    setDlBusy(true);
    try { await buildPDF(result); }
    catch(e){ alert("PDF error: "+e.message); }
    finally{ setDlBusy(false); }
  }

  /* derived */
  const pm    = result?.profile_match || {};
  const score = parseInt(pm.overall_percentage)||0;
  const verd  = result ? verdict(score) : null;
  const kw    = result?.keyword_match  || {};
  const risk  = result?.risk_analysis  || {};
  const edu   = result?.education      || {};
  const loc   = result?.location       || {};
  const rlLow = (risk.risk_level||"").toLowerCase().includes("low");
  const rlMed = (risk.risk_level||"").toLowerCase().includes("medium");
  const rConf = rlLow?{bg:"#dcfce7",c:"#14532d",i:"🟢"}:rlMed?{bg:"#ffedd5",c:"#7c2d12",i:"🟡"}:{bg:"#fee2e2",c:"#7f1d1d",i:"🔴"};
  const locCol= loc.match_status?.includes("Exact")?"#15803d":loc.match_status?.includes("Nearby")?"#ea580c":"#b91c1c";
  const locBg = loc.match_status?.includes("Exact")?"#dcfce7":loc.match_status?.includes("Nearby")?"#ffedd5":"#fee2e2";

  const fonts=[["system-ui,-apple-system,sans-serif","Aa"],["Georgia,'Times New Roman',serif","Ss"],["'Courier New',monospace","</>"]];

  return (
    <div style={{fontFamily:font,background:"#f8fafc",minHeight:"100vh"}}>
      <style>{`
        .nav-btn{padding:6px 13px;border-radius:8px;border:none;background:transparent;font-size:12px;font-weight:600;color:#64748b;cursor:pointer;transition:all .15s;font-family:inherit}
        .nav-btn:hover{background:#f1f5f9;color:#0f172a}
        .vtb{padding:5px 11px;border-radius:7px;border:none;background:transparent;font-size:11px;font-weight:700;cursor:pointer;color:#64748b;font-family:inherit;transition:all .15s}
        .vtb.on{background:#fff;color:#1d4ed8;box-shadow:0 1px 5px rgba(0,0,0,.1)}
        .hov-card{transition:transform .2s,box-shadow .2s}
        .hov-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.09)!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── NAV ── */}
      <div style={{height:62,background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 10px rgba(0,0,0,.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#1d4ed8,#0ea5e9,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:17,boxShadow:"0 4px 12px rgba(29,78,216,.3)"}}>A</div>
          <div>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"-.03em"}}>Achala<span style={{color:"#1d4ed8"}}>.Ai</span></div>
            <div style={{fontSize:9,color:"#94a3b8",fontWeight:600,letterSpacing:".06em"}}>AI RECRUITMENT INTELLIGENCE</div>
          </div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[["screener","Try Now"],["testimonials","Reviews"]].map(([id,lbl])=>(
            <button key={id} className="nav-btn" onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}>{lbl}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:9,padding:3}}>
            {fonts.map(([f,l])=>(
              <button key={f} className={`vtb${font===f?" on":""}`} onClick={()=>setFont(f)}>{l}</button>
            ))}
          </div>
          {result&&(
            <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:9,padding:3}}>
              {[["report","⊞ Report"],["json","{ } JSON"]].map(([v,l])=>(
                <button key={v} className={`vtb${view===v?" on":""}`} onClick={()=>setView(v)}>{l}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#0c1445 0%,#1d4ed8 48%,#0891b2 78%,#059669 100%)",padding:"52px 40px",color:"#fff"}}>
        <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
        <div style={{position:"relative",maxWidth:860,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",padding:"5px 14px",borderRadius:20,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:16}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"blink 2s infinite"}}/>
              Powered by Azure OpenAI
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
            </div>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:700,lineHeight:1.2,marginBottom:14}}>Screen Talent.<br/><em style={{fontStyle:"italic",color:"#7dd3fc"}}>Hire Smarter.</em></h1>
            <p style={{opacity:.83,fontSize:14,lineHeight:1.7,marginBottom:24,maxWidth:420}}>AI-powered resume screening with instant match scores, fake detection, detailed analysis &amp; downloadable PDF reports.</p>
            <button onClick={()=>document.getElementById("screener")?.scrollIntoView({behavior:"smooth"})}
              style={{background:"#fff",color:"#1d4ed8",padding:"12px 24px",borderRadius:10,fontWeight:800,fontSize:13,border:"none",cursor:"pointer",fontFamily:font,boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
              Try the AI Screener Free
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["#7dd3fc","85%+","Screen Select"],["#4ade80","80–85%","Partial Select"],["#fbbf24","≤80%","Reject zone"],["#f87171","Any","Risk detection"]].map(([c,n,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.18)",borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:22,fontWeight:900,color:c,marginBottom:4}}>{n}</div>
                <div style={{fontSize:11,opacity:.78}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px"}}>

        {/* ── SCREENER ── */}
        <div id="screener" style={{paddingTop:36}}>
          <div style={{display:"inline-block",background:"#dbeafe",color:"#1d4ed8",fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",padding:"4px 12px",borderRadius:20,marginBottom:10}}>✦ Live Demo</div>
          <div style={{fontSize:21,fontWeight:800,letterSpacing:"-.02em",marginBottom:6}}>Try the AI Screener Now</div>
          <div style={{color:"#64748b",fontSize:13,marginBottom:22}}>Paste or upload a Job Description and Candidate Resume — full report + PDF in seconds.</div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <UploadZone label="Job Description"  fileId="jd-file"  accent="#1d4ed8" value={jd}     onChange={setJd}/>
            <UploadZone label="Candidate Resume"  fileId="res-file" accent="#10b981" value={resume} onChange={setResume}/>
          </div>

          <button onClick={analyze} disabled={loading}
            style={{width:"100%",padding:15,borderRadius:12,background:loading?"#94a3b8":"linear-gradient(135deg,#1d4ed8,#0ea5e9)",color:"#fff",fontFamily:font,fontWeight:900,fontSize:15,border:"none",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 6px 22px rgba(29,78,216,.27)"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            {loading?"Analyzing…":"Analyze Candidate Fit"}
          </button>

          {error&&<div style={{marginTop:12,background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:11,padding:"13px 16px",color:"#991b1b",fontSize:13,lineHeight:1.6}}><strong>Error:</strong> {error}</div>}
        </div>

        {loading&&<Loader progress={progress}/>}

        {/* ── RESULTS ── */}
        {result&&!loading&&(
          <div ref={resultRef} style={{marginTop:20,animation:"fadeUp .5s ease"}}>

            {view==="json"?(
              <pre style={{background:"#0f172a",color:"#6ee7b7",borderRadius:13,padding:22,fontFamily:"'Courier New',monospace",fontSize:11,lineHeight:1.8,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {JSON.stringify(result,null,2)}
              </pre>
            ):(
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,overflow:"hidden",boxShadow:"0 4px 30px rgba(0,0,0,.06)"}}>

                {/* HEADER */}
                <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#0c1445,#1d4ed8 52%,#0891b2)",padding:"26px 30px",color:"#fff"}}>
                  <div style={{position:"absolute",right:-40,top:-40,width:180,height:180,background:"rgba(255,255,255,.04)",borderRadius:"50%"}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"center",position:"relative"}}>
                    <div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,marginBottom:5}}>{result.candidate_name||"Candidate"}</div>
                      <div style={{fontSize:12,opacity:.75,marginBottom:12}}>{result.designation||""}</div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        {result.contact_number&&<span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,opacity:.86,background:"rgba(255,255,255,.12)",padding:"4px 11px",borderRadius:20}}>📞 {result.contact_number}</span>}
                        {result.email&&<span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,opacity:.86,background:"rgba(255,255,255,.12)",padding:"4px 11px",borderRadius:20}}>✉️ {result.email}</span>}
                        {result.location?.candidate_location&&<span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,opacity:.86,background:"rgba(255,255,255,.12)",padding:"4px 11px",borderRadius:20}}>📍 {result.location.candidate_location}</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"center",background:"rgba(255,255,255,.12)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:14,padding:"16px 22px",minWidth:155}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",opacity:.65,marginBottom:7}}>SCREENING VERDICT</div>
                      <div style={{fontSize:34,fontWeight:900,lineHeight:1,marginBottom:7}}>{score}%</div>
                      <div style={{fontSize:12,fontWeight:900,padding:"5px 12px",borderRadius:8,display:"inline-block",background:verd.bg,color:verd.fg}}>{verd.emoji} {verd.label}</div>
                    </div>
                  </div>
                </div>

                {/* PROFILE SUMMARY */}
                <div style={{padding:"18px 30px",background:"#fafbff",borderBottom:"1px solid #f1f5f9"}}>
                  <SectionHead icon="📝" title="Profile Summary"/>
                  <p style={{fontSize:14,lineHeight:1.8,color:"#374151"}}>{result.profile_summary}</p>
                </div>

                {/* SCORE BARS */}
                <div style={{display:"flex",borderBottom:"1px solid #f1f5f9"}}>
                  {[["Overall",pm.overall_percentage,"#1d4ed8"],["Experience",pm.experience_match,"#7c3aed"],["Skills",pm.skills_match,"#0ea5e9"],["Location",pm.location_match_pct,"#10b981"],["Keywords",pm.keyword_match_pct,"#f59e0b"]].map(([l,v2,a])=>(
                    <ScoreBar key={l} label={l} value={v2} accent={a}/>
                  ))}
                </div>

                {/* SOURCING + CANDIDATE CARDS */}
                <div style={{background:"linear-gradient(135deg,#faf5ff,#eff6ff,#f0fdf4)",padding:"24px 30px",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#7c3aed",display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{width:22,height:1.5,background:"#7c3aed",display:"inline-block"}}/>Sourcing Channels
                  </div>
                  <div style={{fontSize:17,fontWeight:800,color:"#1e1b4b",marginBottom:16,letterSpacing:"-.02em"}}>Where we find talent</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22,alignItems:"center"}}>
                    <SourcingDiagram name={result.candidate_name}/>
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {[["👤","#dbeafe",result.candidate_name,"Candidate Name",false],
                        ["📞","#dcfce7",result.contact_number,"Contact Number",false],
                        ["✉️","#fef3c7",result.email,"Email ID",false],
                        ["🔗","#ede9fe",result.linkedin,"LinkedIn",true],
                        ["📍","#ffedd5",result.location?.candidate_location,"Location",false],
                        ["🎯","#f0fdf4",result.designation,"Applied For",false],
                      ].map(([ic,bg,val,key,isLink])=>(
                        <div key={key} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"9px 13px"}}>
                          <div style={{width:32,height:32,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{ic}</div>
                          <div style={{minWidth:0}}>
                            <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{key}</div>
                            {val
                              ? isLink
                                ? <a href={val} target="_blank" rel="noreferrer" style={{fontSize:12,fontWeight:700,color:"#1d4ed8",wordBreak:"break-all",textDecoration:"none"}}>{val}</a>
                                : <span style={{fontSize:12,fontWeight:700,color:"#0f172a",wordBreak:"break-word"}}>{val}</span>
                              : <span style={{fontSize:12,color:"#94a3b8",fontStyle:"italic"}}>N/A</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WORK HISTORY */}
                <div style={{padding:"20px 30px",borderBottom:"1px solid #f1f5f9"}}>
                  <SectionHead icon="🏢" title="Work History & Tenure"/>
                  {(result.work_history||[]).length>0
                    ?(result.work_history||[]).map((w,i)=>{
                        const isA=w.to==="Present";
                        return(
                          <div key={i} style={{display:"flex",gap:13,marginBottom:11,alignItems:"flex-start"}}>
                            <div style={{width:36,height:36,borderRadius:9,background:i%2===0?"#dbeafe":"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🏢</div>
                            <div style={{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderLeft:`3px solid ${isA?"#10b981":"#1d4ed8"}`,borderRadius:11,padding:"11px 15px"}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                                <div>
                                  <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{w.company||"Unknown"}</div>
                                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{w.role||""}</div>
                                </div>
                                <div style={{textAlign:"right"}}>
                                  <div style={{fontSize:12,fontWeight:700,color:isA?"#15803d":"#1d4ed8",background:isA?"#dcfce7":"#dbeafe",padding:"3px 10px",borderRadius:20}}>{w.from||""}{w.to?" – "+w.to:""}</div>
                                  {w.duration&&<div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>⏱ {w.duration}</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    :<span style={{fontSize:13,color:"#94a3b8",fontStyle:"italic"}}>No work history found in resume.</span>}
                </div>

                {/* SKILLS */}
                <div style={{padding:"20px 30px",borderBottom:"1px solid #f1f5f9"}}>
                  <SectionHead icon="🛠" title="Skills Match in Detail"/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 26px"}}>
                    {(result.skills_detail||[]).map((s,i)=><SkillBar key={i} {...s}/>)}
                  </div>
                </div>

                {/* CERTS + EDU + RISK */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:"1px solid #f1f5f9"}}>
                  <div style={{padding:"20px 22px",borderRight:"1px solid #f1f5f9"}}>
                    <SectionHead icon="🏅" title="Certifications"/>
                    {(result.certifications||[]).length
                      ?(result.certifications||[]).map((c,i)=>(
                          <div key={i} style={{display:"flex",gap:7,marginBottom:7,fontSize:12,alignItems:"flex-start"}}>
                            <span style={{color:"#15803d",fontWeight:900}}>✓</span>{c}
                          </div>
                        ))
                      :<span style={{fontSize:12,color:"#94a3b8",fontStyle:"italic"}}>N/A — None found</span>}
                  </div>
                  <div style={{padding:"20px 22px",borderRight:"1px solid #f1f5f9"}}>
                    <SectionHead icon="🎓" title="Highest Education"/>
                    {edu.highest_degree
                      ?<div>
                          <div style={{fontSize:15,fontWeight:900,marginBottom:7}}>{edu.highest_degree}</div>
                          {edu.field&&<div style={{fontSize:12,color:"#64748b",marginBottom:3}}>📚 {edu.field}</div>}
                          {edu.institution&&<div style={{fontSize:12,color:"#64748b",marginBottom:3}}>🏫 {edu.institution}</div>}
                          {edu.year&&edu.year!=="Not Available"&&<div style={{fontSize:11,color:"#94a3b8"}}>🗓 {edu.year}</div>}
                        </div>
                      :<span style={{fontSize:12,color:"#94a3b8",fontStyle:"italic"}}>Not Available</span>}
                  </div>
                  <div style={{padding:"20px 22px"}}>
                    <SectionHead icon="🛡" title="Risk Analysis"/>
                    <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 13px",borderRadius:9,fontSize:12,fontWeight:800,marginBottom:12,background:rConf.bg,color:rConf.c}}>{rConf.i} {risk.risk_level||"Low Risk"}</div>
                    {(risk.reasons||["No significant red flags detected."]).map((r,i)=>(
                      <div key={i} style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginBottom:5,paddingLeft:14,position:"relative"}}>
                        <span style={{position:"absolute",left:0,color:"#1d4ed8",fontWeight:900}}>→</span>{r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* KEYWORDS + LOCATION */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderTop:"1px solid #f1f5f9"}}>
                  <div style={{padding:"20px 22px",borderRight:"1px solid #f1f5f9"}}>
                    <SectionHead icon="🔑" title="Keyword Match"/>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:13}}>
                      <span style={{fontSize:26,fontWeight:900,color:pctText(kw.percentage||0)}}>{kw.percentage||0}%</span>
                      <div style={{flex:1,height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${kw.percentage||0}%`,background:pctStroke(kw.percentage||0),borderRadius:3,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                    <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:"#94a3b8",marginBottom:6}}>✅ Matched</div>
                    <div style={{display:"flex",flexWrap:"wrap",marginBottom:10}}>
                      {(kw.matched||[]).map((k,i)=><Tag key={i} type="match">{k}</Tag>)}
                      {!(kw.matched||[]).length&&<span style={{fontSize:11,color:"#94a3b8"}}>None</span>}
                    </div>
                    <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:"#94a3b8",marginBottom:6}}>❌ Missing</div>
                    <div style={{display:"flex",flexWrap:"wrap"}}>
                      {(kw.missing||[]).map((k,i)=><Tag key={i} type="missing">{k}</Tag>)}
                      {!(kw.missing||[]).length&&<span style={{fontSize:11,color:"#94a3b8"}}>None</span>}
                    </div>
                  </div>
                  <div style={{padding:"20px 22px"}}>
                    <SectionHead icon="📍" title="Location"/>
                    {[["🏠","Candidate Location",loc.candidate_location],["🏢","Job Location (Preferred)",loc.job_location]].map(([ic,lbl,val])=>(
                      <div key={lbl} style={{display:"flex",gap:9,padding:"8px 0",borderBottom:"1px solid #f9fafb",alignItems:"flex-start"}}>
                        <span style={{fontSize:14,flexShrink:0}}>{ic}</span>
                        <div>
                          <div style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{lbl}</div>
                          <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{val||"Not Available"}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 13px",borderRadius:8,marginTop:12,fontSize:12,fontWeight:800,background:locBg,color:locCol}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:locCol,display:"inline-block"}}/>
                      {loc.match_status||"Not Available"}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* DOWNLOAD */}
            <button onClick={download} disabled={dlBusy}
              style={{display:"inline-flex",alignItems:"center",gap:9,padding:"13px 24px",borderRadius:12,background:dlBusy?"#94a3b8":"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",fontFamily:font,fontWeight:800,fontSize:14,border:"none",cursor:dlBusy?"not-allowed":"pointer",marginTop:16,boxShadow:dlBusy?"none":"0 4px 16px rgba(21,128,61,.28)",transition:"all .2s"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {dlBusy?"Generating PDF…":"Download Full PDF Report"}
            </button>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        <div id="testimonials" style={{height:1,background:"#e2e8f0",margin:"36px 0 28px"}}/>
        <div style={{display:"inline-block",background:"#dbeafe",color:"#1d4ed8",fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",padding:"4px 12px",borderRadius:20,marginBottom:10}}>✦ Testimonials</div>
        <div style={{fontSize:21,fontWeight:800,letterSpacing:"-.02em",marginBottom:6}}>What recruiters say</div>
        <div style={{color:"#64748b",fontSize:13,marginBottom:20}}>Trusted by hiring teams across industries.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[["P","#dbeafe","#1d4ed8","Priya Sharma","HR Lead, TechCorp India","★★★★★","Achala.Ai saved us hours of screening. We shortlisted 3 candidates in 10 minutes instead of 3 hours."],
            ["R","#dcfce7","#15803d","Rajesh Kumar","Talent Acquisition, StartupHub","★★★★★","Fake detection caught two inconsistent resumes that would have slipped through our process."],
            ["A","#ede9fe","#7c3aed","Ananya Reddy","Recruiter, GlobalHire","★★★★☆","Match scoring is surprisingly accurate. Our offer acceptance rate went up 40% after using Achala.Ai."]
          ].map(([init,bg,c,name,role,stars,quote])=>(
            <div key={name} className="hov-card" style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:13,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
              <div style={{color:"#f59e0b",fontSize:13,marginBottom:9}}>{stars}</div>
              <div style={{fontSize:12,color:"#64748b",fontStyle:"italic",marginBottom:13,lineHeight:1.6}}>"{quote}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:bg,color:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{init}</div>
                <div><div style={{fontSize:12,fontWeight:800}}>{name}</div><div style={{fontSize:10,color:"#94a3b8"}}>{role}</div></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{background:"linear-gradient(135deg,#0c1445,#1d4ed8 50%,#0891b2)",borderRadius:18,padding:"40px 32px",textAlign:"center",color:"#fff",margin:"32px 0"}}>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,marginBottom:10}}>Start hiring smarter with Achala.Ai today</h2>
          <p style={{opacity:.83,fontSize:13,marginBottom:22}}>Join thousands of recruiters saving time with AI-powered screening.</p>
          <button onClick={()=>document.getElementById("screener")?.scrollIntoView({behavior:"smooth"})}
            style={{background:"#fff",color:"#1d4ed8",padding:"12px 24px",borderRadius:10,fontWeight:800,fontSize:13,border:"none",cursor:"pointer",fontFamily:font}}>
            Try the AI screener now →
          </button>
        </div>
      </div>

      <div style={{textAlign:"center",padding:"22px",color:"#94a3b8",fontSize:12,borderTop:"1px solid #e2e8f0"}}>
        © 2026 Achala<span style={{color:"#1d4ed8"}}>.Ai</span> · AI Recruitment Intelligence · Powered by Azure OpenAI
      </div>
    </div>
  );
}
