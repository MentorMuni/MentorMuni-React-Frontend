import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Trophy,
  Users,
  BarChart3,
  Mic2,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  LineChart,
  Wrench,
  Medal,
  Flame,
  CalendarRange,
} from 'lucide-react';
import { PRODUCT_READINESS_SCORE, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '../constants/brandCopy';

const collegeContact = '/contact?topic=colleges';

const pillars = [
  {
    icon: Trophy,
    title: 'Leadership board for your cohort',
    desc:
      'A college-wide readiness and engagement board that turns comparison into momentum: students see where they stand, close skill gaps with mocks and structured prep, then improve their scores and climb the board again—while you see who has started, who is stuck, and where to nudge before drives.',
    tint: 'from-amber-500/15 to-orange-500/10',
    border: 'border-amber-200/70',
  },
  {
    icon: Users,
    title: 'Bulk mentorship packages',
    desc:
      'Negotiated seat-based or cohort pricing so more students get 1:1 mentor time without ad-hoc deals. We structure delivery around your batch size, timelines, and focus companies.',
    tint: 'from-cyan-500/12 to-sky-500/8',
    border: 'border-cyan-200/70',
  },
  {
    icon: Target,
    title: 'Interview preparation with TPO alignment',
    desc:
      `Students get the same core stack your TPO cares about: ${PRODUCT_READINESS_SCORE}, AI mock interviews, resume ATS checks, and optional mentor pathways—so placement prep is measurable, not scattered.`,
    tint: 'from-emerald-500/12 to-teal-500/8',
    border: 'border-emerald-200/70',
  },
];

const checklist = [
  'Baseline readiness assessment for the batch (optional target date before placements)',
  'Access to our public Leadership Board (with clear participation and fairness notes)',
  'Optional interview readiness competitions and cohort challenges (format agreed with your TPO)',
  'Structured interview prep: mocks, gaps-by-topic, and mentor options',
  'Dedicated conversation for bulk mentorship economics and rollout',
  'Single point of contact for TPO / placement cell',
];

const Colleges = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFDF8] text-foreground-muted">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#1A6FC4]/10 blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#FF9500]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-[#E8F3FF]/40 to-transparent blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-6 sm:pt-16 md:pb-28">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0DCCF] bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground shadow-sm">
            <Building2 className="h-4 w-4 text-[#1A6FC4]" aria-hidden />
            College collaboration · Phase 1
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E0DCCF] bg-gradient-to-br from-[#E8F3FF] to-white shadow-md">
              <GraduationCap className="h-8 w-8 text-[#1A6FC4]" strokeWidth={1.75} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.08]">
              MentorMuni for{' '}
              <span className="bg-gradient-to-r from-[#1A6FC4] to-[#FF9500] bg-clip-text text-transparent">
                colleges &amp; TPOs
              </span>
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            Partner with us to run measurable interview readiness across your batch: a leadership board that gamifies real
            prep so students push scores and ranking as they fix gaps, plus optional bulk mentorship and the same tools they
            already use—aligned with placement season.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to={collegeContact}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1A6FC4] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#155a9e]"
            >
              Talk to partnerships
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/leadership-board"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E0DCCF] bg-white px-6 py-3.5 text-sm font-bold text-foreground-muted transition hover:border-[#FFB347] hover:bg-[#FFF8EE]"
            >
              See the leadership board
              <Trophy className="h-4 w-4 text-[#FF9500]" />
            </Link>
          </div>
        </motion.header>

        <motion.section
          className="relative mx-auto mt-12 max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF9500]/20 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[#1A6FC4]/15 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#FFB347]/80 bg-gradient-to-br from-[#FFF4E0] via-white to-[#E8F3FF]/50 p-6 shadow-[0_12px_40px_-12px_rgba(255,149,0,0.35),0_4px_24px_-8px_rgba(26,111,196,0.12)] sm:p-8 md:p-10">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(-45deg, #CC7000 0, #CC7000 1px, transparent 1px, transparent 12px)',
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF9500]/50 bg-[#FF9500] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm sm:text-xs">
                  <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  Gamification spotlight
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B4513] shadow-sm sm:text-xs">
                  <Medal className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                  Interview readiness competition
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#1A6FC4]/25 bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#1A6FC4] shadow-sm sm:text-xs">
                  <CalendarRange className="h-3.5 w-3.5" aria-hidden />
                  Placement-season ready
                </span>
              </div>
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:leading-snug">
                    Campus energy students actually feel:{' '}
                    <span className="bg-gradient-to-r from-[#CC7000] to-[#FF9500] bg-clip-text text-transparent">
                      competitions, badges, and bragging rights tied to real prep
                    </span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
                    Hook your batch with an{' '}
                    <strong className="font-semibold text-foreground">Interview Readiness Competition</strong>: timed rounds, clear
                    scoring on readiness and practice milestones, and live movement on the leadership board so every rank-up
                    reflects effort—not luck. Run it inside one cohort, across departments, or as a friendly inter-college
                    challenge; we help you shape the format, dates, and fairness rules with your placement cell.
                  </p>
                  <Link
                    to={collegeContact}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1A6FC4] hover:text-[#155a9e]"
                  >
                    Plan a competition with partnerships
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-2 md:max-w-md md:grid-cols-1 md:shrink-0">
                  {[
                    {
                      icon: Trophy,
                      title: 'Leaderboard moments',
                      blurb: 'Rank-ups after mocks, re-tests, and streaks—screenshot-worthy progress the whole class sees.',
                      accent: 'border-amber-200 bg-gradient-to-br from-amber-50/90 to-white',
                    },
                    {
                      icon: Users,
                      title: 'Team & cohort play',
                      blurb: 'Branches, years, or houses compete on average uplift and participation—not only the top ten.',
                      accent: 'border-sky-200 bg-gradient-to-br from-sky-50/80 to-white',
                    },
                    {
                      icon: Sparkles,
                      title: 'Recognition layers',
                      blurb: 'Most improved, fastest climbers, mock streaks—storylines TPO can celebrate in town halls.',
                      accent: 'border-violet-200 bg-gradient-to-br from-violet-50/70 to-white',
                    },
                    {
                      icon: Target,
                      title: 'Scoring everyone understands',
                      blurb: 'Readiness score + concrete tasks so students know exactly what to do to move the needle.',
                      accent: 'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white',
                    },
                  ].map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className={`rounded-2xl border px-4 py-3.5 shadow-sm ${card.accent}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm ring-1 ring-black/5">
                            <CardIcon className="h-4 w-4 text-foreground" strokeWidth={2} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{card.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.blurb}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What we offer</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            One partnership line: visibility, mentorship at scale, and structured prep
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={`relative overflow-hidden rounded-2xl border ${p.border} bg-gradient-to-b ${p.tint} to-white p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/80 bg-white/90 shadow-sm">
                    <Icon className="h-5 w-5 text-foreground" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-[#CC7000]">
              <TrendingUp className="h-6 w-6" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Gamified prep loop</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Leadership board: rank, fix gaps, score higher, rank again
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              The board rewards actual readiness work—not vanity metrics. As students practice, plug topic gaps, and rerun
              assessments, their scores reflect the progress and their position can move up, which keeps batches engaged
              through placement season.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                icon: LineChart,
                title: 'See the baseline',
                text: 'Compare cohort standing and spot how readiness and activity stack up before drives heat up.',
              },
              {
                step: '2',
                icon: Target,
                title: 'Surface the gaps',
                text: 'Scores and practice make weak areas obvious—DSA, HR, SD, resume, or mocks—so prep is targeted.',
              },
              {
                step: '3',
                icon: Wrench,
                title: 'Fix and practice',
                text: 'Students use tutorials, AI mocks, resume checks, and optional mentors to close those gaps for real.',
              },
              {
                step: '4',
                icon: Trophy,
                title: 'Score up, climb again',
                text: 'Improved tests and engagement lift their numbers; the board updates so ranking reflects fresh effort.',
              },
            ].map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-[#F0ECE0] bg-white p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
                >
                  <span className="absolute right-4 top-4 text-2xl font-black tabular-nums text-[#FF9500]/25">
                    {item.step}
                  </span>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E0]">
                    <StepIcon className="h-5 w-5 text-[#CC7000]" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-hint">
            Fair-play and opt-in rules are set with your institution so the board stays motivating without becoming toxic.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-[#E0DCCF] bg-white px-6 py-10 shadow-lg sm:px-10">
          <div className="mb-6 flex items-center gap-2 text-[#1A6FC4]">
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Typical engagement</span>
          </div>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-foreground-muted">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-hint">
            Exact terms, data visibility, and leaderboard rules are agreed per institution (privacy, opt-in, and fair-use).
            This page is our public entry point; formal proposals follow your first conversation.
          </p>
        </section>

        <section className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-2xl border border-[#F0ECE0] bg-gradient-to-br from-white to-[#FFF8EE] p-6 sm:p-8">
            <Mic2 className="mb-3 h-8 w-8 text-[#FF9500]" />
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">What Phase 1 focuses on</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              First we align on a simple, repeatable story: students get a fair read on where they stand and what to improve,
              and your team gets a readiness sprint you can stand behind, with optional mentorship if you want it. Deeper work
              like dedicated access, college-scoped views, and exports follows once we agree on cohort, timeline, and how you
              want to run placements.
            </p>
            <Link
              to="/start-assessment"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF9500] hover:text-[#E88600]"
            >
              Try the free readiness flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-[#FF9500]/40 bg-[#FF9500]/8 p-6 sm:p-8">
            <Sparkles className="mb-3 h-8 w-8 text-[#CC7000]" />
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Next step</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
              Send college name, approximate batch size, and placement window—we&apos;ll reply with a short call proposal and
              next steps.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Prefer phone?{' '}
              <a href={CONTACT_PHONE_HREF} className="font-semibold text-[#1A6FC4] hover:underline">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
            <Link
              to={collegeContact}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9500] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#E88600] sm:w-auto"
            >
              Start college partnership enquiry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Colleges;
