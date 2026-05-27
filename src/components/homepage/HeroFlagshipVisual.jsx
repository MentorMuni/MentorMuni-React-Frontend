import { useState } from 'react';
import { useNewUI } from '../../context/NewUIContext';
import { generateHeroScorePreview } from '../../utils/heroScorePreview';
import { ClassicHeroScoreCard } from './ClassicHeroScoreCard';
import { NewUIHeroScoreCard } from './NewUIHeroScoreCard';

/**
 * Hero readiness-check preview — Classic is byte-identical to mentormuni.com production.
 */
export function HeroFlagshipVisual({ className = '' }) {
  const { newUI } = useNewUI();
  const [preview] = useState(() => generateHeroScorePreview());

  if (newUI) {
    return <NewUIHeroScoreCard className={className} preview={preview} />;
  }

  return <ClassicHeroScoreCard className={className} preview={preview} />;
}
