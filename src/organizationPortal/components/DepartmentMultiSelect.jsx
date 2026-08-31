/**
 * Chip multiselect for one or more departments.
 */

export default function DepartmentMultiSelect({
  departments = [],
  value = [],
  onChange,
  disabled = false,
  label = 'Departments',
  hint = '',
  min = 1,
}) {
  const selected = new Set((value || []).map(String));

  const toggle = (id) => {
    if (disabled) return;
    const key = String(id);
    const next = new Set(selected);
    if (next.has(key)) {
      if (next.size <= min) return;
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange?.([...next]);
  };

  if (!departments.length) {
    return (
      <div>
        {label ? <p className="mm-org-label">{label}</p> : null}
        <p className="m-0 text-sm mm-org-text-muted">No departments loaded yet.</p>
      </div>
    );
  }

  return (
    <div>
      {label ? (
        <p className="mm-org-label">
          {label} ({selected.size})
        </p>
      ) : null}
      {hint ? <p className="m-0 mb-2 text-xs mm-org-text-muted">{hint}</p> : null}
      <div className="mm-org-chip-grid">
        {departments.map((d) => {
          const on = selected.has(String(d.id));
          return (
            <button
              key={d.id}
              type="button"
              className={`mm-org-chip ${on ? 'is-on' : ''}`}
              onClick={() => toggle(d.id)}
              disabled={disabled}
              aria-pressed={on}
            >
              {d.name}
              {d.code ? <span className="mm-org-text-muted">{d.code}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
