/**
 * One icon per baseline tool — specific, not generic.
 */
import {
  Calculator,
  Code2,
  FolderKanban,
  Gauge,
  ListChecks,
  MessageCircle,
  UserCircle,
  Video,
} from 'lucide-react';

export const TOOL_ICONS = {
  '5_sec': Gauge,
  aptitude: Calculator,
  skill_readiness: Code2,
  skill_mock: MessageCircle,
  project_mock: FolderKanban,
  interview_readiness: ListChecks,
  interview_mock: Video,
  hr_mock: UserCircle,
};

export function ToolIcon({ toolCode, size = 16, strokeWidth = 2, className }) {
  const Icon = TOOL_ICONS[toolCode];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
