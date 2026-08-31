import TabChangeWarningBanner from './TabChangeWarningBanner';
import { useTabChangeWarning } from './useTabChangeWarning';

/**
 * Warns when the user changes browser tabs while a MentorMuni tool is open.
 */
export default function ToolTabGuard({
  enabled = true,
  label = 'this tool',
  className = '',
  sticky = true,
}) {
  const { warning, dismiss } = useTabChangeWarning({ enabled });

  if (!enabled || !warning) return null;

  return (
    <TabChangeWarningBanner
      warning={warning}
      onDismiss={dismiss}
      label={label}
      className={[
        sticky ? 'sticky top-0 z-30 mb-3' : 'mb-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
