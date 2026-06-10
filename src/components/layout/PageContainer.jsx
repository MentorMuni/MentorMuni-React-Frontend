/**
 * Page content container — wraps mm-container variants for consistent gutters.
 */
export default function PageContainer({
  variant = 'default',
  className = '',
  children,
  as: Tag = 'div',
  ...props
}) {
  const variantClass = {
    default: '',
    narrow: 'mm-container--narrow',
    prose: 'mm-container--prose',
    tight: 'mm-container--tight',
    wide: 'mm-container--wide',
    flush: 'mm-container--flush',
  }[variant] ?? '';

  const classes = ['mm-container', variantClass, className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
