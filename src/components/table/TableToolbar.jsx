import { Search } from 'lucide-react';
import './table-query.css';

export function TableToolbar({
  query,
  onQueryChange,
  placeholder = 'Search…',
  children,
  count,
  total,
  variant = 'org',
  className = '',
}) {
  const inputClass =
    variant === 'pa'
      ? 'mm-pa-input mm-pa-input--icon-left'
      : variant === 'stu'
        ? 'mm-tbl-search mm-tbl-search--stu'
        : 'mm-org-input mm-tbl-search';

  return (
    <div className={`mm-tbl-toolbar ${className}`.trim()}>
      <div className="mm-tbl-toolbar__search">
        <Search size={15} className="mm-tbl-toolbar__icon" aria-hidden />
        <input
          type="search"
          className={inputClass}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </div>
      {children ? <div className="mm-tbl-toolbar__filters">{children}</div> : null}
      {count != null && total != null ? (
        <span className="mm-tbl-toolbar__meta">
          {count} of {total}
        </span>
      ) : null}
    </div>
  );
}
