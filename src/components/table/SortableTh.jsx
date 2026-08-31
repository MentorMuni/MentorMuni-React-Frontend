import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export function SortableTh({ label, sortKey, sort, onSort, className = '', align = 'left' }) {
  const active = sort?.key === sortKey;
  const dir = active ? sort.direction : null;
  const ariaSort = dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';

  return (
    <th className={className} style={align !== 'left' ? { textAlign: align } : undefined}>
      <button
        type="button"
        className={`mm-tbl-sort${active ? ' is-active' : ''}`}
        onClick={() => onSort(sortKey)}
        aria-sort={ariaSort}
      >
        <span>{label}</span>
        <span className="mm-tbl-sort__icon" aria-hidden>
          {dir === 'asc' ? (
            <ArrowUp size={14} />
          ) : dir === 'desc' ? (
            <ArrowDown size={14} />
          ) : (
            <ArrowUpDown size={14} />
          )}
        </span>
      </button>
    </th>
  );
}
