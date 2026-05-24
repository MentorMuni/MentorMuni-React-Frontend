import { useNewUI } from '../../context/NewUIContext';
import { ClassicHeroScoreCard } from './ClassicHeroScoreCard';
import { NewUIHeroScoreCard } from './NewUIHeroScoreCard';

/**
 * Hero readiness-check preview — Classic is byte-identical to mentormuni.com production.
 */
export function HeroFlagshipVisual({ className = '' }) {
  const { newUI } = useNewUI();

  if (newUI) {
    return <NewUIHeroScoreCard className={className} />;
  }

  return <ClassicHeroScoreCard className={className} />;
}
