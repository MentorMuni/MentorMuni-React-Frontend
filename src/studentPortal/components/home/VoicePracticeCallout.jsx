import { ArrowRight, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { enterProps } from '../../motion';
import { studentPaths, studentToolPath } from '../../paths';

/**
 * Voice practice on the student's weakest area.
 */

const EXAMPLES = ['Check my answer', 'Quick mock: 5 questions', 'What should I practice next?'];

export default function VoicePracticeCallout({ studentName = 'there', weakest = null }) {
  const reduce = useReducedMotion();
  const firstName = String(studentName || '').split(' ')[0] || 'there';
  const gap = weakest || 'interview communication';
  const voiceHref = weakest
    ? studentToolPath('skill_mock', { from: 'practice', skill: String(gap).slice(0, 48) })
    : studentPaths.mentor;

  return (
    <motion.section className="stu-voice" {...enterProps(reduce)}>
      <div className="stu-voice__body">
        <span className="stu-voice__badge">Voice practice</span>

        <h3 className="stu-voice__title">
          {weakest ? `Practice ${gap} out loud.` : 'Stuck on a topic? Talk it through.'}
        </h3>

        <p className="stu-voice__copy">
          {weakest
            ? `${firstName}, your baseline flagged ${gap} as the area pulling your readiness down. A focused voice session on it moves the number more than another general mock.`
            : 'Like calling a senior who has time — check an answer, revise before a test, or walk through a concept you did not get in class.'}
        </p>

        <div className="stu-voice__actions">
          <Link className="stu-voice__cta" to={voiceHref}>
            <span className="stu-voice__mic" aria-hidden>
              <Mic size={16} strokeWidth={2} focusable="false" />
            </span>
            {weakest ? 'Start skill voice mock' : 'Open AI Voice Mentor'}
            <ArrowRight size={16} strokeWidth={2} aria-hidden focusable="false" />
          </Link>

          <p className="stu-voice__hint">
            {weakest
              ? 'About 20 minutes. Counts as today’s practice.'
              : 'Around 10 minutes. No booking, no waiting.'}
          </p>
        </div>

        <ul className="stu-voice__prompts" aria-label="Things you can ask">
          {[weakest ? `Drill me on ${gap}` : 'Explain this simply', ...EXAMPLES].map((p) => (
            <li key={p} className="stu-voice__prompt">
              “{p}”
            </li>
          ))}
        </ul>
      </div>

      <div className="stu-voice__visual" aria-hidden>
        <Mic size={36} strokeWidth={1.6} focusable="false" />
      </div>
    </motion.section>
  );
}
