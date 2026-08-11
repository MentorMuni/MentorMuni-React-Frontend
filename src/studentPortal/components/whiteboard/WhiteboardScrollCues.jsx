import { useEffect, useState } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';

function scrollTop() {
  const shell = document.querySelector('.stu-shell');
  if (shell) shell.scrollTo({ top: 0, behavior: 'smooth' });
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function readScrollY() {
  const shell = document.querySelector('.stu-shell');
  if (shell && shell.scrollHeight > shell.clientHeight + 8) return shell.scrollTop;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export default function WhiteboardScrollCues({ wallRef, hidden }) {
  const [showDown, setShowDown] = useState(true);
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    const shell = document.querySelector('.stu-shell');
    const targets = [window];
    if (shell) targets.push(shell);

    const update = () => {
      const y = readScrollY();
      const wall = wallRef?.current;
      let wallBelow = true;
      if (wall) {
        const top = wall.getBoundingClientRect().top;
        wallBelow = top > window.innerHeight * 0.72;
      }
      setShowDown(y < 80 && wallBelow);
      setShowUp(y > 240);
    };

    update();
    targets.forEach((node) => node.addEventListener('scroll', update, { passive: true }));
    window.addEventListener('resize', update);
    return () => {
      targets.forEach((node) => node.removeEventListener('scroll', update));
      window.removeEventListener('resize', update);
    };
  }, [wallRef]);

  if (hidden) return null;

  return (
    <>
      {showDown ? (
        <button
          type="button"
          className="wb-scroll wb-scroll--down"
          onClick={() => wallRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <span className="wb-scroll__glyph" aria-hidden>
            <ChevronDown size={22} strokeWidth={2.6} />
          </span>
          <span className="wb-scroll__label">the wall</span>
        </button>
      ) : null}

      {showUp ? (
        <button type="button" className="wb-scroll wb-scroll--up" onClick={scrollTop}>
          <span className="wb-scroll__glyph" aria-hidden>
            <ArrowUp size={20} strokeWidth={2.6} />
          </span>
          <span className="wb-scroll__label">Top</span>
        </button>
      ) : null}
    </>
  );
}
