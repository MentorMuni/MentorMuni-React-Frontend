import { avatarStyleForStudent, initialsFromName } from '../avatarLibrary';

/**
 * Auto-assigned library avatar (gradient + initials). No photo upload.
 * @param {{
 *   student?: object|null,
 *   name?: string,
 *   className?: string,
 *   size?: 'sm'|'xs'|'',
 * }} props
 */
export default function StudentAvatar({ student = null, name, className = '', size = '' }) {
  const displayName = name || student?.name || 'Student';
  const sizeClass =
    size === 'sm' ? ' stu-avatar--sm' : size === 'xs' ? ' stu-avatar--xs' : '';
  const extra = className ? ` ${className}` : '';

  return (
    <span
      className={`stu-avatar${sizeClass}${extra}`}
      style={avatarStyleForStudent(student || { name: displayName })}
      aria-hidden
    >
      {initialsFromName(displayName)}
    </span>
  );
}
