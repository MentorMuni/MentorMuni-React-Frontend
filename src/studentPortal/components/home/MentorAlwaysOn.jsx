import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { studentPaths } from '../../paths';
import MentorVoicePanel from '../mentor/MentorVoicePanel';

/**
 * Compact home strip — always-on personal VOICE mentor.
 */
export default function MentorAlwaysOn() {
  return (
    <section className="stu-mentor-stage stu-mentor-stage--compact" aria-labelledby="stu-mentor-stage-title">
      <div className="stu-mentor-stage__glow" aria-hidden />
      <div className="stu-mentor-stage__inner">
        <div className="stu-mentor-stage__row">
          <div className="stu-mentor-stage__brand">
            <span className="stu-mentor-stage__orb" aria-hidden>
              <span className="stu-mentor-stage__orb-core" />
            </span>
            <div className="stu-mentor-stage__copy">
              <p className="stu-mentor-stage__live">Online · 24/7</p>
              <h2 id="stu-mentor-stage-title" className="stu-mentor-stage__title">
                AI voice mentor
              </h2>
              <p className="stu-mentor-stage__sub">Talk about concepts, projects, or what to practice next.</p>
            </div>
          </div>
          <div className="stu-mentor-stage__actions">
            <MentorVoicePanel compact />
            <Link to={studentPaths.mentor} className="stu-mentor-stage__expand" title="Open full mentor page">
              <span className="stu-mentor-stage__expand-label">Open</span>
              <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
