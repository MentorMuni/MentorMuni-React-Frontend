import { orgApi } from '../orgPortal/orgApi';

const BASE = '/support';

export const orgHelpApi = {
  listTickets: () => orgApi.get(`${BASE}/tickets`),
  getTicket: (id) => orgApi.get(`${BASE}/tickets/${id}`),
  createTicket: (body) => orgApi.post(`${BASE}/tickets`, body),
  replyTicket: (id, body) => orgApi.post(`${BASE}/tickets/${id}/replies`, body),
  closeTicket: (id) => orgApi.post(`${BASE}/tickets/${id}/close`, {}),
};
