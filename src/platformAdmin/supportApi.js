import { platformApi } from './platformApi';

const BASE = '/platform/support';

export const platformSupportApi = {
  listTickets: (params = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.source_portal) q.set('source_portal', params.source_portal);
    if (params.organization_id) q.set('organization_id', String(params.organization_id));
    const suffix = q.toString() ? `?${q}` : '';
    return platformApi.get(`${BASE}/tickets${suffix}`);
  },
  getTicket: (id) => platformApi.get(`${BASE}/tickets/${id}`),
  replyTicket: (id, body) => platformApi.post(`${BASE}/tickets/${id}/replies`, body),
  closeTicket: (id) => platformApi.post(`${BASE}/tickets/${id}/close`, {}),
};
