import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PROGRAM_TYPES, createProgram, getHodAccess } from '../store';

/**
 * Assign a program / assessment to one student (HOD or TPO).
 */
export default function AssignToStudentModal({ student, departmentId, onClose, onAssigned }) {
  const access = getHodAccess();
  const [type, setType] = useState('aptitude');
  const [title, setTitle] = useState('');
  const [dueInDays, setDueInDays] = useState(7);
  const [err, setErr] = useState('');

  if (!student) return null;

  const mockBlocked = ['mock_ai', 'mock_hr'].includes(type) && access.canRunMocks === false;
  const assignBlocked = access.canAssignPrograms === false;

  const assessmentTypes = PROGRAM_TYPES.filter(
    (t) => t.group === 'Assessment' || t.group === 'Interview'
  );
  const otherTypes = PROGRAM_TYPES.filter((t) => t.group === 'Engagement');

  const defaultTitle = () => {
    const label = PROGRAM_TYPES.find((t) => t.id === type)?.label || 'Assessment';
    return `${label} · ${student.name}`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    if (assignBlocked) {
      setErr('Program assignment is disabled for HODs.');
      return;
    }
    if (mockBlocked) {
      setErr('Mock interviews are disabled. Ask TPO to enable them.');
      return;
    }
    const finalTitle = title.trim() || defaultTitle();
    createProgram({
      title: finalTitle,
      type,
      audience: 'student',
      departmentId: departmentId || student.departmentId || '',
      studentIds: [student.id],
      dueInDays: Number(dueInDays) || 7,
    });
    onAssigned?.(finalTitle);
    onClose?.();
  };

  return (
    <div className="mm-org-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="assign-stu-title">
      <div className="mm-org-modal">
        <div className="mm-org-panel__head" style={{ marginBottom: 12 }}>
          <div>
            <h2 id="assign-stu-title" className="mm-org-panel__title">
              Assign to {student.name}
            </h2>
            <p className="mm-org-panel__meta">
              {student.email} · readiness {student.readiness}% · gap: {student.weakness || '—'}
            </p>
          </div>
          <button type="button" className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="mm-org-form-grid">
            <div>
              <label className="mm-org-label" htmlFor="asg-type">Assessment / program</label>
              <select
                id="asg-type"
                className="mm-org-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <optgroup label="Assessments & interviews">
                  {assessmentTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {otherTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="mm-org-label" htmlFor="asg-days">Due in (days)</label>
              <input
                id="asg-days"
                type="number"
                min={1}
                className="mm-org-input"
                value={dueInDays}
                onChange={(e) => setDueInDays(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="asg-title">Title (optional)</label>
              <input
                id="asg-title"
                className="mm-org-input"
                placeholder={defaultTitle()}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="mm-org-form-actions">
            <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={assignBlocked}>
              <Plus size={15} /> Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
