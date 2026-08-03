const LINES = [
  'Every day you show up moves the offer closer.',
  "Small daily reps beat last-minute cramming.",
  "Let's make today count towards your dream offer.",
];

export default function GreetingSection({ studentName, collegeName, departmentName }) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const firstName = studentName?.split(' ')[0] || 'there';
  const line = LINES[new Date().getDate() % LINES.length];

  return (
    <div className="stu-greet">
      <div>
        <h1 className="stu-greet__title">
          Good {timeOfDay}, {firstName}{' '}
          <span className="stu-greet__wave" aria-hidden>👋</span>
        </h1>
        <p className="stu-greet__sub">{line}</p>
      </div>

      {collegeName ? (
        <div className="stu-greet__context">
          <span className="stu-greet__college">{collegeName}</span>
          {departmentName ? <span className="stu-greet__dept">{departmentName}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
