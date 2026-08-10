import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Clock3,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  getCodingAnalysis,
  getCodingSubmission,
  listCodingAssessments,
  listCodingBankProblems,
  listCodingSubmissions,
  listCodingTopics,
  resolveCodingPractice,
} from '../codingApi';
import { studentToolPath } from '../paths';
import '../styles/coding-round.css';

const LEVELS = [
  { id: 'all', label: 'All levels' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

function CoachingSnippet({ analysis }) {
  if (!analysis) return null;
  if (analysis.analysis_status !== 'ready') {
    return (
      <p className="stu-coding__muted">
        AI coaching: {analysis.analysis_status || 'pending'}
      </p>
    );
  }
  return (
    <div className="stu-coding__ai">
      <div className="stu-coding__ai-head">
        <Brain size={16} strokeWidth={2.2} aria-hidden />
        <strong>AI recommendations</strong>
        {analysis.overall_coaching_score != null && (
          <span>Coach {Number(analysis.overall_coaching_score).toFixed(0)}</span>
        )}
      </div>
      {analysis.beginner_explanation && <p>{analysis.beginner_explanation}</p>}
      {!!analysis.learning_gaps?.length && (
        <>
          <h4>Learning gaps</h4>
          <ul>
            {analysis.learning_gaps.slice(0, 4).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      {!!analysis.next_learning_focus?.length && (
        <>
          <h4>Next focus</h4>
          <ul>
            {analysis.next_learning_focus.slice(0, 4).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      {!!analysis.strengths?.length && (
        <>
          <h4>Strengths</h4>
          <ul>
            {analysis.strengths.slice(0, 3).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      <p className="stu-coding__note">
        Official score is from tests only. AI coaching never changes your grade.
      </p>
    </div>
  );
}

export default function StudentCodingRoundPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('browse'); // browse | rounds | results
  const [allItems, setAllItems] = useState([]);
  const [topicCatalog, setTopicCatalog] = useState([]);
  const [bankProblems, setBankProblems] = useState([]);
  const [history, setHistory] = useState([]);
  const [skill, setSkill] = useState('all');
  const [level, setLevel] = useState('all');
  const [customTopic, setCustomTopic] = useState('');
  const [customLevel, setCustomLevel] = useState('easy');
  const [companyKey, setCompanyKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [resolveBusy, setResolveBusy] = useState(false);
  const [error, setError] = useState('');
  const [resolveMsg, setResolveMsg] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [usingDemoCatalog, setUsingDemoCatalog] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError('');
    const FALLBACK_TOPICS = [
      'Arrays',
      'Strings',
      'Hashing',
      'Math',
      'Two Pointers',
      'Sliding Window',
      'Binary Search',
      'Stack',
      'Queue',
      'Linked List',
      'Trees',
      'Graphs',
      'Greedy',
      'Recursion',
      'Backtracking',
      'Dynamic Programming',
    ].map((topic) => ({ topic, problem_count: 0, difficulties: [], patterns: [] }));

    const settled = await Promise.allSettled([
      listCodingAssessments(),
      listCodingSubmissions({ limit: 20 }),
      listCodingTopics(),
      listCodingBankProblems({ limit: 80 }),
    ]);

    const listed = settled[0].status === 'fulfilled' ? settled[0].value : null;
    const past = settled[1].status === 'fulfilled' ? settled[1].value : null;
    const topics = settled[2].status === 'fulfilled' ? settled[2].value : null;
    const bank = settled[3].status === 'fulfilled' ? settled[3].value : null;

    setAllItems(listed?.items || []);
    setHistory(past?.items || []);
    setTopicCatalog(topics?.items?.length ? topics.items : FALLBACK_TOPICS);
    setBankProblems(bank?.items || []);
    setUsingDemoCatalog(Boolean(listed?.demo || topics?.demo || bank?.demo));

    const failures = settled.filter((s) => s.status === 'rejected');
    if (failures.length === settled.length) {
      setError(failures[0].reason?.message || 'Could not load coding rounds.');
    } else if (!bank?.items?.length && settled[3].status === 'rejected') {
      setError(
        'Question bank could not load from API. Check that the local API is running with latest code.',
      );
    } else if (!bank?.items?.length && !listed?.items?.length) {
      setError('No published coding problems yet. Seed the bank or generate via topic practice.');
    }

    setLoading(false);
  }, []);
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const filteredRounds = useMemo(() => {
    return (allItems || []).filter((a) => {
      if (skill !== 'all') {
        const t = (a.topic || '').trim().toLowerCase();
        if (t !== skill.trim().toLowerCase()) return false;
      }
      if (level !== 'all') {
        const d = (a.difficulty || '').trim().toLowerCase();
        if (d !== level) return false;
      }
      return true;
    });
  }, [allItems, skill, level]);

  const filteredBank = useMemo(() => {
    const all = bankProblems || [];
    const topicExact = all.filter((p) => {
      if (skill === 'all') return true;
      return (p.topic || '').trim().toLowerCase() === skill.trim().toLowerCase();
    });
    const exact = topicExact.filter((p) => {
      if (level === 'all') return true;
      return (p.difficulty || '').trim().toLowerCase() === level;
    });
    // Soft fallback: topic+level empty but topic has problems → show topic set
    if (exact.length === 0 && skill !== 'all' && level !== 'all' && topicExact.length > 0) {
      return topicExact;
    }
    return exact;
  }, [bankProblems, skill, level]);

  const bankFilterNote = useMemo(() => {
    if (skill === 'all' || level === 'all') return '';
    const topicExact = (bankProblems || []).filter(
      (p) => (p.topic || '').trim().toLowerCase() === skill.trim().toLowerCase(),
    );
    const exact = topicExact.filter(
      (p) => (p.difficulty || '').trim().toLowerCase() === level,
    );
    if (exact.length === 0 && topicExact.length > 0) {
      const levels = [...new Set(topicExact.map((p) => (p.difficulty || '').toLowerCase()))].join(
        ', ',
      );
      return `No ${level} problems in ${skill} yet — showing available levels (${levels}). Use Start practice above to generate a ${level} one.`;
    }
    return '';
  }, [bankProblems, skill, level]);

  const startRound = useCallback(
    (assessmentSlug) => {
      if (!assessmentSlug) return;
      setError('');
      navigate(
        studentToolPath('coding', {
          from: 'coding',
          skill: assessmentSlug,
        }),
      );
    },
    [navigate],
  );

  const onPickTopicChip = useCallback((topic) => {
    setSkill(topic);
    setCustomTopic(topic);
    setLevel('all');
    setTab('browse');
  }, []);

  const onResolvePractice = useCallback(
    async (override = {}) => {
      const topic = String(override.topic ?? customTopic).trim();
      const difficulty = String(override.difficulty ?? customLevel).toLowerCase();
      if (topic.length < 2) {
        setError('Enter a topic (e.g. Hashing, Sliding Window, Dynamic Programming).');
        return;
      }
      setResolveBusy(true);
      setError('');
      setResolveMsg('');
      try {
        const company = String(override.company_key ?? companyKey).trim();
        const res = await resolveCodingPractice({
          topic,
          difficulty,
          company_key: company || undefined,
          company_name: company
            ? company.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
            : undefined,
          allow_generate: true,
          max_problems: 1,
        });
        setResolveMsg(
          res.message ||
            (res.generated
              ? 'Generated a new campus-placement practice problem.'
              : 'Matched a problem from the published bank.'),
        );
        await loadCatalog();
        if (res.assessment_slug) {
          startRound(res.assessment_slug);
        }
      } catch (err) {
        const detail = err?.detail;
        const msg =
          typeof detail === 'string'
            ? detail
            : detail?.message || err?.message || 'Could not build practice for that topic.';
        setError(msg);
      } finally {
        setResolveBusy(false);
      }
    },
    [companyKey, customLevel, customTopic, loadCatalog, startRound],
  );
  const openResult = useCallback(async (row) => {
    if (!row?.id) return;
    setSelectedId(row.id);
    setDetailBusy(true);
    setDetail(null);
    setAnalysis(null);
    setTab('results');
    setError('');
    try {
      const [sub, ai] = await Promise.all([
        getCodingSubmission(row.id),
        getCodingAnalysis(row.id).catch(() => null),
      ]);
      setDetail(sub);
      setAnalysis(ai);
    } catch (err) {
      setError(err?.message || 'Could not load result.');
    } finally {
      setDetailBusy(false);
    }
  }, []);

  return (
    <main className="stu-main">
      <section className="stu-coding" aria-labelledby="stu-coding-title">
        <header className="stu-coding__hero">
          <h1 className="stu-coding__title" id="stu-coding-title">
            Coding Round
          </h1>
          <p className="stu-coding__sub">
            Pick a topic and difficulty, then solve like you would in a campus coding round.
            You get a fair score on your code, plus tips to improve after you submit.
          </p>
        </header>

        {usingDemoCatalog && (
          <div className="stu-coding__banner" role="status">
            Showing sample rounds — coding API unreachable. Refresh after the local API is up.
          </div>
        )}

        <div className="stu-coding__compose" aria-label="Custom topic practice">
          <div className="stu-coding__compose-row">
            <label className="stu-coding__compose-topic">
              Topic
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Hashing, Trees, Dynamic Programming"
                maxLength={120}
              />
            </label>
            <label>
              Level
              <select value={customLevel} onChange={(e) => setCustomLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label>
              Company theme (optional)
              <input
                type="text"
                value={companyKey}
                onChange={(e) => setCompanyKey(e.target.value)}
                placeholder="microsoft / amazon / tcs"
                maxLength={160}
              />
            </label>
            <button
              type="button"
              className="stu-coding__cta"
              onClick={onResolvePractice}
              disabled={resolveBusy}
            >
              {resolveBusy ? (
                <Loader2 size={15} className="spin" aria-hidden />
              ) : (
                <Sparkles size={15} aria-hidden />
              )}
              {resolveBusy ? 'Preparing…' : 'Start practice'}
              <ArrowRight size={15} aria-hidden />
            </button>
          </div>
          <p className="stu-coding__compose-hint">
            For 4th-year campus placements. Uses the published bank first; generates an original
            validated problem only if needed.
          </p>
          {resolveMsg && <p className="stu-coding__resolve-ok">{resolveMsg}</p>}
        </div>

        <div className="stu-coding__tabs" role="tablist" aria-label="Coding round sections">
          <div className="stu-coding__tab-track">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'browse'}
              className={tab === 'browse' ? 'is-active' : ''}
              onClick={() => setTab('browse')}
            >
              <Search size={15} strokeWidth={2.2} aria-hidden />
              <span>Topics</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'rounds'}
              className={tab === 'rounds' ? 'is-active' : ''}
              onClick={() => setTab('rounds')}
            >
              <Terminal size={15} strokeWidth={2.2} aria-hidden />
              <span>Sets</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'results'}
              className={tab === 'results' ? 'is-active' : ''}
              onClick={() => setTab('results')}
            >
              <Brain size={15} strokeWidth={2.2} aria-hidden />
              <span>Results</span>
            </button>
          </div>
          <button
            type="button"
            className="stu-coding__refresh"
            onClick={loadCatalog}
            disabled={loading}
            aria-label="Refresh"
          >
            <RefreshCw size={14} strokeWidth={2.4} className={loading ? 'spin' : undefined} />
          </button>
        </div>

        {error && (
          <p className="stu-coding__error" role="alert">
            {error}
          </p>
        )}

        {(tab === 'browse' || tab === 'rounds') && (
          <div className="stu-coding__filters">
            <label>
              Filter topic
              <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                <option value="all">All topics</option>
                {topicCatalog.map((t) => (
                  <option key={t.topic} value={t.topic}>
                    {t.topic} ({t.problem_count})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="stu-coding__count">
              <strong>{tab === 'browse' ? filteredBank.length : filteredRounds.length}</strong>{' '}
              {tab === 'browse' ? 'problems' : 'sets'}
            </p>
          </div>
        )}

        {tab === 'browse' && (
          <>
            <div className="stu-coding__topic-chips" aria-label="Topics">
              {topicCatalog.map((t) => (
                <button
                  key={t.topic}
                  type="button"
                  className={skill === t.topic ? 'is-active' : ''}
                  onClick={() => onPickTopicChip(t.topic)}
                >
                  {t.topic}
                  <span>{t.problem_count}</span>
                </button>
              ))}
            </div>

            {bankFilterNote && (
              <p className="stu-coding__filter-note" role="status">
                {bankFilterNote}
              </p>
            )}

            {loading ? (
              <p className="stu-coding__muted">
                <Loader2 size={16} className="spin" aria-hidden /> Loading bank…
              </p>
            ) : (
              <ul className="stu-coding__grid">
                {filteredBank.length === 0 && (
                  <li className="stu-coding__empty">
                    <Search size={16} aria-hidden /> No published problems for this filter. Type the
                    topic above, pick a level, and hit Start practice to generate one.
                  </li>
                )}
                {filteredBank.map((p) => (
                  <li key={`${p.id}-${p.slug}`} className="stu-coding__card">
                    <div className="stu-coding__card-top">
                      <span className="stu-coding__badge">{p.difficulty || 'practice'}</span>
                      {p.expected_time_complexity && (
                        <span className="stu-coding__mins">{p.expected_time_complexity}</span>
                      )}
                    </div>
                    <h2>{p.title}</h2>
                    <p className="stu-coding__meta">
                      {[p.topic, p.pattern].filter(Boolean).join(' · ')}
                    </p>
                    <p className="stu-coding__why">
                      {p.summary || p.why_this_matters || 'Campus placement coding practice.'}
                    </p>
                    <button
                      type="button"
                      className="stu-coding__cta"
                      onClick={() => {
                        if (p.assessment_slug) {
                          startRound(p.assessment_slug);
                          return;
                        }
                        onResolvePractice({
                          topic: p.topic || '',
                          difficulty: (p.difficulty || 'easy').toLowerCase(),
                        });
                      }}
                    >
                      <Play size={15} fill="currentColor" aria-hidden />
                      Practice this problem
                      <ArrowRight size={15} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'rounds' && (
          <>
            {loading ? (
              <p className="stu-coding__muted">
                <Loader2 size={16} className="spin" aria-hidden /> Loading sets…
              </p>
            ) : (
              <ul className="stu-coding__grid">
                {filteredRounds.length === 0 && (
                  <li className="stu-coding__empty">
                    No practice sets match yet. Use Topic browser or the topic field above.
                  </li>
                )}
                {filteredRounds.map((a) => (
                  <li
                    key={`${a.id}-${a.slug}-${a.company_key || ''}-${a.difficulty}`}
                    className="stu-coding__card"
                  >
                    <div className="stu-coding__card-top">
                      <span className="stu-coding__badge">{a.difficulty || 'practice'}</span>
                      <span className="stu-coding__mins">
                        <Clock3 size={13} aria-hidden /> {a.duration_minutes}m
                      </span>
                    </div>
                    <h2>{a.title}</h2>
                    <p className="stu-coding__meta">
                      {[a.topic, a.pattern, a.company_name, a.role_name, `${a.problem_count || 1} problem(s)`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {a.relevance_label && (
                      <p className="stu-coding__relevance">{a.relevance_label}</p>
                    )}
                    {a.why_this_matters && <p className="stu-coding__why">{a.why_this_matters}</p>}
                    {a.placement_blurb && (
                      <p className="stu-coding__blurb">{a.placement_blurb}</p>
                    )}
                    <button
                      type="button"
                      className="stu-coding__cta"
                      onClick={() => startRound(a.slug)}
                    >
                      <Play size={15} fill="currentColor" aria-hidden />
                      Start coding round
                      <ArrowRight size={15} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'results' && (
          <div className="stu-coding__results">
            <aside className="stu-coding__history">
              <h2>Your submissions</h2>
              {history.length === 0 ? (
                <p className="stu-coding__muted">
                  No submissions yet. Start a round, then come back for score + AI coaching.
                </p>
              ) : (
                <ul>
                  {history.map((h) => (
                    <li key={h.id}>
                      <button
                        type="button"
                        className={selectedId === h.id ? 'is-active' : ''}
                        onClick={() => openResult(h)}
                      >
                        <strong>{h.problem_title || h.assessment_title || `Run #${h.id}`}</strong>
                        <span>
                          {h.official_score != null
                            ? `Official ${Number(h.official_score).toFixed(0)}`
                            : h.execution_status}
                          {h.verdict ? ` · ${h.verdict}` : ''}
                        </span>
                        <em>
                          {h.submitted_at ? new Date(h.submitted_at).toLocaleString() : ''}
                        </em>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="stu-coding__detail">
              {detailBusy && (
                <p className="stu-coding__muted">
                  <Loader2 size={16} className="spin" aria-hidden /> Loading result…
                </p>
              )}
              {!detailBusy && !detail && (
                <p className="stu-coding__muted">
                  Select a submission to see official score and AI recommendations.
                </p>
              )}
              {!detailBusy && detail && (
                <>
                  <header className="stu-coding__detail-hero">
                    <p className="stu-coding__eyebrow">Official result</p>
                    <h2>{detail.problem_title || detail.assessment_title}</h2>
                    <div className="stu-coding__scores">
                      <div className="stu-coding__score stu-coding__score--official">
                        <span>Official score</span>
                        <strong>
                          {detail.official_score == null
                            ? '—'
                            : Number(detail.official_score).toFixed(0)}
                        </strong>
                      </div>
                      <div className="stu-coding__score stu-coding__score--coach">
                        <span>Coaching score</span>
                        <strong>
                          {analysis?.overall_coaching_score == null
                            ? '—'
                            : Number(analysis.overall_coaching_score).toFixed(0)}
                        </strong>
                      </div>
                    </div>
                    <p className="stu-coding__muted">
                      Verdict: <strong>{detail.verdict || '—'}</strong>
                      {' · '}
                      Public {detail.public_passed_count}/{detail.public_total_count}
                      {' · '}
                      Hidden {detail.hidden_passed_count}/{detail.hidden_total_count}
                    </p>
                  </header>

                  <section className="stu-coding__panel">
                    <h3>Test outcomes</h3>
                    <ul className="stu-coding__tests">
                      {(detail.test_results || []).map((t) => (
                        <li
                          key={t.index}
                          className={t.status === 'passed' ? 'is-pass' : 'is-fail'}
                        >
                          <span>
                            Case {t.index + 1}
                            {t.hidden ? ' (hidden)' : ''}
                          </span>
                          <span>{t.status}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="stu-coding__panel">
                    <CoachingSnippet analysis={analysis} />
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
