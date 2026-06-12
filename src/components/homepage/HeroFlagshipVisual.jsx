import { useCallback, useState } from 'react';
import { useNewUI } from '../../context/NewUIContext';
import {
  bumpHeroStudentPool,
  calculateHeroRank,
  generateHeroScorePreview,
  initHeroStudentPool,
} from '../../utils/heroScorePreview';
import { ClassicHeroScoreCard } from './ClassicHeroScoreCard';
import { NewUIHeroScoreCard } from './NewUIHeroScoreCard';

/**
 * Hero readiness-check preview — pool starts at 500, grows on refresh + clicks.
 */
export function HeroFlagshipVisual({ className = '' }) {
  const { newUI } = useNewUI();
  const [preview, setPreview] = useState(() => generateHeroScorePreview(initHeroStudentPool()));

  const incrementStudentPool = useCallback(() => {
    setPreview((prev) => {
      const totalStudents = bumpHeroStudentPool(prev.totalStudents);
      return {
        ...prev,
        totalStudents,
        rank: calculateHeroRank(totalStudents, prev.percentileAhead),
      };
    });
  }, []);

  if (newUI) {
    return (
      <NewUIHeroScoreCard
        className={className}
        preview={preview}
        onIncrementStudentPool={incrementStudentPool}
      />
    );
  }

  return (
    <ClassicHeroScoreCard
      className={className}
      preview={preview}
      onIncrementStudentPool={incrementStudentPool}
    />
  );
}
