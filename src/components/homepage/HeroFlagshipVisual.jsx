import { useNewUI } from '../../context/NewUIContext';
import { HeroReadinessCompare } from './HeroReadinessCompare';

/**
 * Hero readiness preview — before/after score transformation (hero proof visual).
 */
export function HeroFlagshipVisual({ className = '' }) {
  const { newUI } = useNewUI();

  return (
    <HeroReadinessCompare variant={newUI ? 'dark' : 'light'} className={className} />
  );
}
