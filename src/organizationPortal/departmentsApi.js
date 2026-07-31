/**
 * Departments + HOD lifecycle — API-first with local fallback until backend lands.
 *
 * Expected API (when available):
 *   GET    /organizations/departments
 *   POST   /organizations/departments
 *   PUT    /organizations/departments/:id
 *   DELETE /organizations/departments/:id
 *   POST   /organizations/departments/:id/hod          { name, email }
 *   POST   /organizations/departments/:id/hod/reinvite
 *   POST   /organizations/departments/:id/hod/revoke
 *   POST   /organizations/departments/:id/hod/replace  { name, email }
 *   POST   /auth/activate-hod   { token, new_password }  (API key, no JWT)
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';
import * as local from './store';

function isMissingApi(err) {
  if (!(err instanceof OrgApiError)) return true;
  return err.status === 404 || err.status === 501 || err.status === 0;
}

function withSource(result, source) {
  return { ...result, source };
}

export async function fetchDepartments() {
  try {
    const data = await orgApi.get('/organizations/departments');
    const list = Array.isArray(data) ? data : data?.departments || data?.items || [];
    return withSource({ ok: true, departments: list }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Failed to load departments.', departments: local.listDepartments() };
    }
    return withSource({ ok: true, departments: local.listDepartments() }, 'local');
  }
}

export async function saveDepartment(input) {
  try {
    const path = input.id
      ? `/organizations/departments/${input.id}`
      : '/organizations/departments';
    const method = input.id ? 'put' : 'post';
    const row = await orgApi[method](path, {
      name: input.name,
      code: input.code,
      hod_name: input.hodName,
      hod_email: input.hodEmail,
    });
    return withSource({ ok: true, department: row }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to save department.' };
    }
    try {
      local.upsertDepartment(input);
      const dept = local.listDepartments().find(
        (d) =>
          (input.id && d.id === input.id) ||
          (!input.id && d.code === String(input.code || '').trim().toUpperCase())
      );
      return withSource({ ok: true, department: dept }, 'local');
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to save department.' };
    }
  }
}

export async function deleteDepartment(id) {
  try {
    await orgApi.delete(`/organizations/departments/${id}`);
    return withSource({ ok: true }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to delete department.' };
    }
    local.removeDepartment(id);
    return withSource({ ok: true }, 'local');
  }
}

export async function inviteDepartmentHod(departmentId, { name, email } = {}) {
  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod`, {
      name,
      email,
    });
    return withSource(
      {
        ok: true,
        department: row,
        activationToken: row?.activation_token || row?.activationToken || '',
        message: row?.message || 'HOD invite sent.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to invite HOD.' };
    }
    try {
      const result = local.inviteHod(departmentId, { name, email });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          message:
            'Invite ready. Share the activation link with the HOD (email delivery wires when API is live).',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to invite HOD.' };
    }
  }
}

export async function reinviteDepartmentHod(departmentId) {
  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/reinvite`);
    return withSource(
      {
        ok: true,
        department: row,
        activationToken: row?.activation_token || row?.activationToken || '',
        message: row?.message || 'HOD reinvited.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to reinvite HOD.' };
    }
    try {
      const result = local.reinviteHod(departmentId);
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          message: 'Fresh activation link generated.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to reinvite HOD.' };
    }
  }
}

export async function revokeDepartmentHod(departmentId, reason = '') {
  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/revoke`, {
      reason,
    });
    return withSource({ ok: true, department: row, message: 'HOD access revoked.' }, 'api');
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to revoke HOD.' };
    }
    try {
      const department = local.revokeHod(departmentId, reason);
      return withSource(
        { ok: true, department, message: 'HOD access revoked. Students stay in the department.' },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to revoke HOD.' };
    }
  }
}

export async function replaceDepartmentHod(departmentId, { name, email, reason = '' }) {
  try {
    const row = await orgApi.post(`/organizations/departments/${departmentId}/hod/replace`, {
      name,
      email,
      reason,
    });
    return withSource(
      {
        ok: true,
        department: row,
        activationToken: row?.activation_token || row?.activationToken || '',
        message: row?.message || 'HOD replaced. New invite sent.',
      },
      'api'
    );
  } catch (err) {
    if (!isMissingApi(err)) {
      return { ok: false, error: err.message || 'Unable to replace HOD.' };
    }
    try {
      const result = local.replaceHod(departmentId, { name, email, reason });
      return withSource(
        {
          ok: true,
          department: result.department,
          activationToken: result.activationToken,
          activationUrl: result.activationUrl,
          message: 'Previous HOD revoked. New mentor invited — share the activation link.',
        },
        'local'
      );
    } catch (e) {
      return { ok: false, error: e.message || 'Unable to replace HOD.' };
    }
  }
}

export function buildHodActivationUrl(token) {
  if (!token || typeof window === 'undefined') return '';
  return `${window.location.origin}/activate-hod?token=${encodeURIComponent(token)}`;
}
