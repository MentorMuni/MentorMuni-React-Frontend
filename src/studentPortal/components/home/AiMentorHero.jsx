import { useEffect, useRef, useState } from 'react';
import { Mic, Sparkles, ArrowRight } from 'lucide-react';

/**
 * The flagship surface. This is a *voice* coach, not a chat box — a student
 * can talk to it at 1am about a topic they didn't understand, ask it to check
 * an answer, or have it build a revision plan. It gets hero treatment because
 * it is the one thing here no textbook or senior can give them at that hour.
 *
 * The waveform idles gently and reacts on hover/press so the surface reads as
 * "alive and listening" rather than a static banner.
 */

const PROMPTS = [
  'Check my answer',
  'Quick revision: DBMS',
  'Explain time complexity',
  'Build my week plan',
  'Mock me on OOP',
];

const BARS = 28;

export default function AiMentorHero({ studentName = 'there', weakest = 'English communication' }) {
  const firstName = studentName.split(' ')[0];
  const [active, setActive] = useState(false);
  const [prompt, setPrompt] = useState(0);
  const timer = useRef(null);

  // Rotate the example question so the surface suggests what it's good for.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    timer.current = setInterval(() => setPrompt((p) => (p + 1) % PROMPTS.length), 3200);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <section
      className={`stu-mentor${active ? ' is-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="stu-mentor__glow" aria-hidden />

      <div className="stu-mentor__body">
        <span className="stu-mentor__badge">
          <Sparkles size={13} strokeWidth={2.2} aria-hidden />
          AI voice mentor
          <em>always on</em>
        </span>

        <h2 className="stu-mentor__title">
          Stuck at 1am? Just&nbsp;ask.
        </h2>

        <p className="stu-mentor__copy">
          Talk to your mentor like you would a senior who actually has time.
          Check an answer, revise a topic before a test, or get a roadmap for
          the week — out loud, no typing.
        </p>

        <div className="stu-mentor__actions">
          <button className="stu-mentor__cta" type="button">
            <span className="stu-mentor__mic" aria-hidden>
              <Mic size={17} strokeWidth={2.2} />
            </span>
            Start talking
          </button>

          <span className="stu-mentor__hint">
            {firstName}, your weakest area is <strong>{weakest}</strong> — ask about that first.
          </span>
        </div>

        <ul className="stu-mentor__prompts" aria-label="Things you can ask">
          {PROMPTS.map((p, i) => (
            <li key={p}>
              <button
                type="button"
                className={`stu-mentor__chip${i === prompt ? ' is-live' : ''}`}
              >
                “{p}”
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="stu-mentor__visual" aria-hidden>
        <div className="stu-mentor__orb">
          <span className="stu-mentor__ring" />
          <span className="stu-mentor__ring stu-mentor__ring--2" />
          <Mic size={26} strokeWidth={2} />
        </div>

        <div className="stu-mentor__wave">
          {Array.from({ length: BARS }).map((_, i) => (
            <span key={i} style={{ '--i': i }} />
          ))}
        </div>

        <p className="stu-mentor__caption">
          <span key={prompt}>“{PROMPTS[prompt]}”</span>
        </p>

        <a className="stu-mentor__more" href="/studentportal/mentor">
          See everything it can do
          <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
        </a>
      </div>
    </section>
  );
}
