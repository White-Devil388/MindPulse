import React, { useState } from 'react';
import {
  FileCode,
  Upload,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  FileJson,
  Download,
  Sparkles
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

const SAMPLE_JSON = [
  {
    category: "civil-services",
    exam: "UPSC",
    subject: "Polity",
    question: "Which Constitutional Amendment is commonly referred to as the 'Mini-Constitution'?",
    options: [
      "42nd Amendment Act 1976",
      "44th Amendment Act 1978",
      "73rd Amendment Act 1992",
      "86th Amendment Act 2002"
    ],
    correctOption: 0,
    explanation: "The 42nd Amendment Act (1976) introduced comprehensive changes and added 'Socialist, Secular, and Integrity' to the Preamble.",
    difficulty: "Medium"
  },
  {
    category: "ssc",
    exam: "SSC CGL",
    subject: "General Awareness",
    question: "Who was the founder of the Maurya Empire?",
    options: [
      "Ashoka",
      "Bindusara",
      "Chandragupta Maurya",
      "Brihadratha"
    ],
    correctOption: 2,
    explanation: "Chandragupta Maurya founded the Maurya Empire in 322 BCE with the help of Chanakya (Kautilya).",
    difficulty: "Easy"
  }
];

export default function JsonQuestionImporter() {
  const { importQuestionsBulk, questions } = useAdminData();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSample, setCopiedSample] = useState(false);

  const handleCopySample = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_JSON, null, 2));
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const handleLoadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON, null, 2));
    setError('');
    setSuccessMsg('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setJsonText(text);
        setError('');
      } catch (err) {
        setError('Failed to read file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setError('');
    setSuccessMsg('');

    if (!jsonText.trim()) {
      setError('Please paste your JSON data or upload a .json file first.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText.trim());
      // Handle both single object or array
      const questionsArray = Array.isArray(parsed) ? parsed : [parsed];

      const res = importQuestionsBulk(questionsArray);
      if (res.success) {
        const skipText = res.duplicatesSkipped > 0 ? ` (${res.duplicatesSkipped} duplicate questions were automatically skipped)` : '';
        setSuccessMsg(`🎉 Successfully imported ${res.count} unique question(s) into the Question Bank!${skipText}`);
        setJsonText('');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(`Invalid JSON syntax: ${err.message}. Please check commas, braces, and quotes.`);
    }
  };

  const handleExportExistingJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindpulse-questions-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111a33] p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              Bulk Import Engine
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Import Questions via JSON</h2>
          <p className="text-xs text-slate-400">
            Paste JSON or upload a `.json` file to instantly add single or bulk questions to MindPulse.
          </p>
        </div>

        <button
          onClick={handleExportExistingJson}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Current JSON ({questions.length})</span>
        </button>
      </div>

      {/* Main Import Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area (2 cols) */}
        <div className="lg:col-span-2 bg-[#111a33] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">JSON Input Editor</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleLoadSample}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Format</span>
              </button>

              <label className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload .json File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={14}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={`Paste your JSON array or object here:\n[\n  {\n    "question": "Sample question text?",\n    "options": ["A", "B", "C", "D"],\n    "correctOption": 0,\n    "exam": "UPSC",\n    "subject": "Polity",\n    "explanation": "Why option A is correct"\n  }\n]`}
              className="w-full p-4 rounded-xl bg-[#090f22] border border-white/10 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-600 custom-scrollbar"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setJsonText('');
                setError('');
                setSuccessMsg('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 cursor-pointer"
            >
              Clear Editor
            </button>

            <button
              type="button"
              onClick={handleImport}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <FileJson className="w-4 h-4" />
              <span>Parse & Add Questions</span>
            </button>
          </div>
        </div>

        {/* Documentation / Sample Reference (1 col) */}
        <div className="bg-[#111a33] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              JSON Format Reference
            </span>
            <button
              onClick={handleCopySample}
              className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {copiedSample ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSample ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Aap ek single question object ya multiple questions ka array `[...]` pass kar sakte hain:
          </p>

          <div className="bg-[#090f22] p-3.5 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
            <div className="text-cyan-400 font-bold">&#123;</div>
            <div className="pl-3"><span className="text-purple-400">"question"</span>: <span className="text-emerald-300">"Your Question?"</span>,</div>
            <div className="pl-3"><span className="text-purple-400">"options"</span>: [<span className="text-emerald-300">"A"</span>, <span className="text-emerald-300">"B"</span>, <span className="text-emerald-300">"C"</span>, <span className="text-emerald-300">"D"</span>],</div>
            <div className="pl-3"><span className="text-purple-400">"correctOption"</span>: <span className="text-amber-400">0</span>, <span className="text-slate-500">// 0-based index</span></div>
            <div className="pl-3"><span className="text-purple-400">"exam"</span>: <span className="text-emerald-300">"UPSC"</span>,</div>
            <div className="pl-3"><span className="text-purple-400">"category"</span>: <span className="text-emerald-300">"civil-services"</span>,</div>
            <div className="pl-3"><span className="text-purple-400">"subject"</span>: <span className="text-emerald-300">"Polity"</span>,</div>
            <div className="pl-3"><span className="text-purple-400">"explanation"</span>: <span className="text-emerald-300">"Details..."</span></div>
            <div className="text-cyan-400 font-bold">&#125;</div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300">Key Guidelines:</div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li><strong className="text-white">question:</strong> (Mandatory) Question ka string text.</li>
              <li><strong className="text-white">options:</strong> (Mandatory) 4 multiple choices ka array.</li>
              <li><strong className="text-white">correctOption:</strong> Correct option ka index (0 for A, 1 for B, 2 for C, 3 for D).</li>
              <li><strong className="text-white">exam & subject:</strong> Optional - category filter me use hota hai.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

