import { useCallback, useMemo, useState } from 'react';

export function compareValues(a, b, dir = 'asc') {
  const mul = dir === 'desc' ? -1 : 1;
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number' && !Number.isNaN(a) && !Number.isNaN(b)) {
    return (a - b) * mul;
  }
  if (a instanceof Date && b instanceof Date) {
    return (a.getTime() - b.getTime()) * mul;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * mul;
}

/**
 * Client-side search + sort for table and list views.
 */
export function useTableQuery(rows, options = {}) {
  const { searchKeys = [], searchFn, initialSort = null, getSortValue } = options;

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialSort);

  const toggleSort = useCallback((key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }, []);

  const setSortKey = useCallback((key, direction = 'asc') => {
    setSort(key ? { key, direction } : null);
  }, []);

  const processed = useMemo(() => {
    let list = [...(rows || [])];
    const q = query.trim().toLowerCase();

    if (q) {
      if (searchFn) {
        list = list.filter((row) => searchFn(row, q));
      } else if (searchKeys.length) {
        list = list.filter((row) =>
          searchKeys.some((k) => {
            const v = typeof k === 'function' ? k(row) : row[k];
            return String(v ?? '').toLowerCase().includes(q);
          })
        );
      }
    }

    if (sort?.key) {
      const getter = getSortValue || ((row, key) => row[key]);
      list.sort((a, b) => compareValues(getter(a, sort.key), getter(b, sort.key), sort.direction));
    }

    return list;
  }, [rows, query, sort, searchKeys, searchFn, getSortValue]);

  return {
    query,
    setQuery,
    sort,
    toggleSort,
    setSortKey,
    rows: processed,
    total: (rows || []).length,
    count: processed.length,
  };
}
