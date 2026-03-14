import React, { useState, useEffect } from 'react'
import { UploadCloud, FileText, XCircle } from 'lucide-react'

export default function ResumeAnalyzer() {
	const [file, setFile] = useState(null)
	const [role, setRole] = useState('')
	const [analyzing, setAnalyzing] = useState(false)
	const [result, setResult] = useState(null)
	const [freeRemaining, setFreeRemaining] = useState(10)

	useEffect(() => {
		let t
		if (analyzing) {
			t = setTimeout(() => {
				const score = Math.max(45, Math.min(92, 60 + Math.floor(Math.random() * 30)))
				setResult({
					score,
					summary: score > 75 ? 'Strong match for the selected role with minor wording fixes.' : 'Your resume needs clearer achievements and more role-specific keywords.',
					suggestions: [
						'Use metrics to show impact (e.g. increased performance by 30%).',
						'Add role-specific keywords in summary and skills.',
						'Turn responsibilities into achievement-focused bullets.',
					],
					highlights: {
						strengths: ['Concise project descriptions', 'Relevant internships'],
						weaknesses: ['Few technical keywords', 'No quantified impact'],
					},
				})
				setAnalyzing(false)
				setFreeRemaining(r => Math.max(0, r - 1))
			}, 1000 + Math.random() * 800)
		}
		return () => clearTimeout(t)
	}, [analyzing])

	function onFileChange(e) {
		const f = e.target.files && e.target.files[0]
		if (!f) return
		if (f.size > 5 * 1024 * 1024) {
			alert('File too large. Max 5MB.')
			return
		}
		setFile(f)
		setResult(null)
	}

	function removeFile() {
		setFile(null)
		setResult(null)
	}

	function runAnalysis() {
		if (!file || !role) return
		setAnalyzing(true)
		setResult(null)
	}

	const roleOptions = [
		'Full Stack Developer',
		'Frontend Developer',
		'Backend Developer',
		'QA Engineer',
		'Data Analyst',
	]

	return (
		<div className="min-h-screen bg-slate-900 py-12">
			<div className="mx-auto max-w-[1100px] space-y-8 px-6">
				{/* SECTION 1 — HEADER */}
				<header className="text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Resume Analyzer</h1>
					<p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">Optimize your resume with AI-powered ATS scoring and keyword matching tailored to your target role.</p>
					<div className="mt-4 inline-block bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">Free Analyses Remaining: {freeRemaining}/10</div>
				</header>

				{/* SECTION 2 — UPLOAD CARD */}
				<section className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-slate-300">
					<div className="mx-auto max-w-xl">
						<label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-700 rounded-md cursor-pointer hover:bg-slate-700/50 transition">
							<UploadCloud className="w-10 h-10 text-slate-300" />
							<div className="text-lg font-semibold">Upload Your Resume</div>
							<div className="text-sm text-slate-400">Drag and drop your PDF or DOCX file here</div>
							<input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} className="sr-only" />
							<div className="mt-2">
								<button
									type="button"
									onClick={() => document.querySelector('input[type=file]').click()}
									className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:scale-[1.02] transition"
								>
									Browse File
								</button>
							</div>
						</label>

						<div className="mt-3 text-xs text-slate-400">Max file size: 5MB (PDF or DOCX only)</div>

						{file && (
							<div className="mt-4 bg-slate-700 border border-slate-700 rounded-md p-3 flex items-center justify-between text-slate-300">
								<div className="flex items-center gap-3">
									<FileText className="w-5 h-5 text-indigo-300" />
									<div>
										<div className="font-medium">{file.name}</div>
										<div className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</div>
									</div>
								</div>
								<button onClick={removeFile} className="text-slate-300 hover:text-white"><XCircle className="w-5 h-5" /></button>
							</div>
						)}
					</div>
				</section>

				{/* SECTION 3 — TARGET ROLE */}
				<section className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-300">
					<div className="max-w-xl mx-auto">
						<label className="block text-sm font-semibold mb-2">Target Role</label>
						<select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-slate-300">
							<option value="">Select a role...</option>
							{roleOptions.map((r) => (
								<option key={r} value={r}>{r}</option>
							))}
						</select>
					</div>
				</section>

				{/* SECTION 4 — ACTION BUTTON */}
				<div className="text-center">
					<button
						onClick={runAnalysis}
						disabled={!file || !role || analyzing}
						className={`inline-flex items-center gap-3 px-6 py-3 rounded-md text-white font-semibold ${(!file || !role || analyzing) ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-[1.02] shadow-lg'}`}
					>
						{analyzing ? 'Analyzing…' : 'Analyze Resume →'}
					</button>
				</div>

				{/* SECTION 5 — RESULTS (Gaming-style Dashboard) */}
				<section className="space-y-6">
					{/* ANALYZING STATUS BAR */}
					{(analyzing || result) && (
						<div className="flex justify-between items-center rounded-xl bg-slate-800 border border-slate-700 p-4 text-slate-300 shadow-lg shadow-purple-500/10">
							<div>
								<div className="text-xs text-slate-400">Analyzing For</div>
								<div className="font-bold">{role || 'QA Engineer'}</div>
							</div>
							<div className="text-center">
								<div className="text-xs text-slate-400">Confidence</div>
								<div className="font-bold">{result ? `${Math.min(100, Math.round((result.score||66)))}%` : '50%'}</div>
							</div>
							<div className="text-right">
								<div className="text-xs text-slate-400">Remaining</div>
								<div className="font-bold">{freeRemaining}/10</div>
							</div>
						</div>
					)}

										{/* SCORE DASHBOARD CARDS (show only after analysis completes) */}
																				{result && (
																					<>
																						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
																							{/* CARD 1 - Overall Score */}
																							<div className="rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-700 to-purple-500 text-slate-900">
																								<div className="text-5xl font-black text-white mb-2">{result ? result.score : 78}</div>
																								<div className="text-sm font-semibold text-white/90">Overall Score</div>
																							</div>

																							{/* CARD 2 - ATS Score with circular indicator */}
																							<div className="rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-700 to-cyan-500 text-slate-900 flex flex-col items-center">
																								<div className="relative w-36 h-36 mb-4">
																									<svg className="w-full h-full transform -rotate-90">
																										<circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
																										<circle cx="80" cy="80" r="70" fill="none" stroke="url(#g2)" strokeWidth="8" strokeDasharray={`${((result?.score||66)/100)*440} 440`} strokeLinecap="round" />
																										<defs>
																											<linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
																												<stop offset="0%" stopColor="#6366f1" />
																												<stop offset="100%" stopColor="#06b6d4" />
																											</linearGradient>
																										</defs>
																									</svg>
																									<div className="absolute inset-0 flex flex-col items-center justify-center">
																										<div className="text-3xl font-black text-white">{result ? result.score : 66}</div>
																										<div className="text-xs text-white/80">ATS Score</div>
																									</div>
																								</div>
																								<div className="text-sm text-white/90 text-center">ATS Compatibility</div>
																							</div>

																							{/* CARD 3 - Market Readiness */}
																							<div className="rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-amber-600 to-orange-400 text-slate-900">
																								<div className="text-5xl font-black text-white mb-2">{result ? Math.max(0, Math.round((result.score||0)*0.5)) : 39}</div>
																								<div className="text-sm font-semibold text-white/90">Market Readiness</div>
																								<div className="text-xs text-white/80 mt-2">Weak Market</div>
																							</div>
																						</div>

																						{/* SKILL MATCH + ASSESSMENT */}
																						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
																							<div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
																								<h4 className="font-bold text-lg mb-4">Skill Match</h4>
																								<div className="w-full bg-slate-700 rounded-full h-3">
																									<div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-3 rounded-full" style={{ width: `${(result ? (result.score || 53.33) : 53.33)}%` }} />
																								</div>
																								<p className="text-sm text-slate-400 mt-3">Your resume matches {(result ? (result.score || 53.33) : 53.33).toFixed(2)}% of {role || 'QA engineer'} job descriptions.</p>
																							</div>

																							<div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
																								<h4 className="font-bold text-lg mb-4">Assessment</h4>
																								<div className="text-2xl font-black mb-2">Good</div>
																								<p className="text-sm text-slate-400">Your resume is competitive. Consider adding more specific metrics.</p>
																								<div className="mt-4 text-sm text-slate-400">Experience Level: <span className="font-semibold text-slate-200">Fresher</span></div>
																							</div>
																						</div>

																						{/* MATCHED SKILLS */}
																						<div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
																							<h4 className="font-bold text-lg mb-4">Matched Skills (5)</h4>
																							<div className="flex flex-wrap gap-3">
																								{['selenium','automation frameworks','java','test automation','regression testing'].map((s) => (
																									<span key={s} className="bg-green-500/20 text-green-300 rounded-full px-4 py-1 text-sm">{s}</span>
																								))}
																							</div>
																						</div>

																						{/* STRENGTH AREAS */}
																						<div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
																							<h4 className="font-bold text-lg mb-4">Strength Areas</h4>
																							<ul className="list-disc pl-5 text-sm text-slate-900">
																								{['QA Automation Testing','Selenium WebDriver','API Testing','Test Framework Design'].map((a) => (
																									<li key={a} className="mb-2">{a}</li>
																								))}
																							</ul>
																						</div>
																					</>
																				)}
								</section>
			</div>
		</div>
	)
}
