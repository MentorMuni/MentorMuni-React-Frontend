/**
 * Standard marketing section — consistent vertical rhythm + full-width band.
 */
export default function MarketingSection({
  as: Tag = 'section',
  compact = false,
  className = '',
  children,
  ...props
}) {
  const sizeClass = compact ? 'mm-marketing-section--sm' : 'mm-marketing-section';
  const classes = ['mm-band', sizeClass, className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
