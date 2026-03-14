import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function ResumeAnalyzer() {
	const [file, setFile] = useState(null);
	const [analyzing, setAnalyzing] = useState(false);
	const [result, setResult] = useState(null);

	useEffect(() => {
		if (!file) return;
		setAnalyzing(true);
		setResult(null);
		// Simulate analysis delay
		const t = setTimeout(() => {
			// Simulated analysis results
			const score = Math.max(45, Math.min(92, 60 + Math.floor(Math.random() * 30)));
			setResult({
				score,
				summary: score > 75 ? 'Strong match for entry-level roles with minor wording fixes.' : 'Needs clearer achievements and stronger keywords for target roles.',
				suggestions: [
					'Convert passive bullets to achievement-first statements with metrics.',
					'Add role-specific keywords (e.g., React, SQL, CI/CD) in summary and skills.',
					'Shorten long paragraphs into 3-5 concise bullets per role.',
				],
				highlights: {
					strengths: ['Clear headline', 'Relevant projects listed'],
					weaknesses: ['Missing numbers for impact', 'Few technical keywords'],
				}
			});
			setAnalyzing(false);
		}, 1300 + Math.random() * 1200);

		return () => clearTimeout(t);
	}, [file]);

	function onFileChange(e) {
		const f = e.target.files && e.target.files[0];
		if (f) setFile(f);
	}

	function clear() {
		setFile(null);
		setResult(null);
		setAnalyzing(false);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-extrabold mb-4">Resume Analyzer</h1>
			<p className="text-sm text-slate-500 mb-6">Upload your resume and get instant, AI-style feedback on wording, achievements, and role fit.</p>

			<div className="grid md:grid-cols-3 gap-6">
				<div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg border p-6">
					<label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
						<UploadCloud className="w-8 h-8 text-slate-600 dark:text-slate-300" />
						<div className="text-sm text-slate-600 dark:text-slate-300">Drag & drop your PDF or DOCX here, or click to browse</div>
						<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={onFileChange} className="sr-only" />
					</label>

					{file && (
						<div className="mt-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<FileText className="w-6 h-6 text-indigo-500" />
								<div>
									<div className="font-semibold">{file.name}</div>
									<div className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button onClick={clear} className="text-sm text-red-500 hover:underline">Remove</button>
							</div>
						</div>
					)}

					<div className="mt-6">
						<button
							onClick={() => file && setFile(file)}
							disabled={!file || analyzing}
							className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
						>
							{analyzing ? (
								<span className="inline-flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Analyzing...</span>
							) : (
								'Run Analysis'
							)}
						</button>
					</div>
				</div>

				<aside className="bg-white dark:bg-slate-800 rounded-lg border p-6">
					<h3 className="font-bold mb-2">Analysis Summary</h3>
					{!file && <div className="text-sm text-slate-500">No resume uploaded yet.</div>}

					{analyzing && (
						<div className="flex items-center gap-2 text-sm text-slate-500"><Loader className="w-4 h-4 animate-spin" /> Running checks…</div>
					)}

					{result && (
						<div>
							<div className="flex items-center gap-3 mb-3">
								<div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">{result.score}</div>
								<div>
									<div className="font-semibold">Score</div>
									<div className="text-xs text-slate-500">Overall resume match</div>
								</div>
							</div>

							<div className="mb-3">
								<div className="font-semibold">Summary</div>
								<div className="text-sm text-slate-600">{result.summary}</div>
							</div>

							<div className="mb-3">
								<div className="font-semibold">Top Suggestions</div>
								<ul className="list-disc pl-5 text-sm text-slate-600">
									{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
								</ul>
							</div>

							<div className="mb-2">
								<div className="font-semibold">Highlights</div>
								<div className="text-sm text-slate-600">Strengths: {result.highlights.strengths.join(', ')}</div>
								<div className="text-sm text-slate-600">Weaknesses: {result.highlights.weaknesses.join(', ')}</div>
							</div>

							<div className="mt-4 flex gap-2">
								<button className="px-3 py-2 bg-emerald-600 text-white rounded">Apply Suggestions</button>
								<button className="px-3 py-2 border rounded">Download Report</button>
							</div>
						</div>
					)}
				</aside>
			</div>
		</div>
	);
}
