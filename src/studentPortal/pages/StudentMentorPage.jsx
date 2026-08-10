import MentorVoicePanel from '../components/mentor/MentorVoicePanel';
import '../styles/mentor.css';

export default function StudentMentorPage() {
  return (
    <main className="stu-main stu-mentor-page">
      <header className="stu-mentor-page__hero">
        <p className="stu-mentor-page__eyebrow">Always on · Voice</p>
        <h1 className="stu-mentor-page__title">AI Voice Mentor</h1>
        <p className="stu-mentor-page__sub">
          Live voice coach with your baseline scores, weaknesses, 90-day plan, and coding results.
          Same Realtime tech as AI mock interview — for guidance anytime, not scoring.
        </p>
      </header>
      <MentorVoicePanel />
    </main>
  );
}
