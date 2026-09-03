import { BookOpen, Clock3, HelpCircle, Mic, Sparkles } from 'lucide-react';
import MentorVoicePanel from '../components/mentor/MentorVoicePanel';
import '../styles/mentor.css';

const HERO_IMG = `${import.meta.env.BASE_URL}student-portal/ai-voice-mentor-hero.png`;

const HIGHLIGHTS = [
  {
    icon: Clock3,
    title: '24×7 coach',
    text: 'Available whenever you study — mornings, nights, or before a drive.',
  },
  {
    icon: BookOpen,
    title: 'Any topic',
    text: 'DSA, aptitude, OOPs, projects, HR answers — learn by talking it through.',
  },
  {
    icon: HelpCircle,
    title: 'Clear doubts fast',
    text: 'Stuck on a concept or mock feedback? Ask now — no waiting for office hours.',
  },
];

export default function StudentMentorPage() {
  return (
    <main className="stu-main stu-mentor-page">
      <header className="stu-mentor-page__hero">
        <div className="stu-mentor-page__hero-copy">
          <p className="stu-mentor-page__eyebrow">
            <Sparkles size={12} strokeWidth={2.4} aria-hidden />
            Always on · Voice coach
          </p>
          <h1 className="stu-mentor-page__title">AI Voice Mentor</h1>
          <p className="stu-mentor-page__sub">
            Your <strong>24×7 placement coach</strong>. Learn any topic or clear doubts anytime —
            just say <em>“Hello mentor”</em> and ask your questions.
          </p>
          <div className="stu-mentor-page__trigger" role="note">
            <Mic size={16} strokeWidth={2.2} aria-hidden />
            <div>
              <strong>How to start</strong>
              <span>
                Tap <b>Start voice mentor</b>, then say <b>“Hello mentor”</b> and ask anything.
              </span>
            </div>
          </div>
        </div>

        <figure className="stu-mentor-page__visual">
          <img
            src={HERO_IMG}
            alt="Student talking with MentorMuni AI Voice Mentor through headphones and a live voice session"
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
          />
        </figure>
      </header>

      <ul className="stu-mentor-page__highlights" aria-label="Why use AI Voice Mentor">
        {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <span className="stu-mentor-page__highlight-icon" aria-hidden>
              <Icon size={16} strokeWidth={2.2} />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <MentorVoicePanel />
    </main>
  );
}
