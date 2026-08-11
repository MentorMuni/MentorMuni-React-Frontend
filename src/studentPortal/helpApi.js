import { studentApi } from './studentApi';

const BASE = '/support';

export const studentHelpApi = {
  listTickets: () => studentApi.get(`${BASE}/tickets`),
  getTicket: (id) => studentApi.get(`${BASE}/tickets/${id}`),
  createTicket: (body) => studentApi.post(`${BASE}/tickets`, body),
  replyTicket: (id, body) => studentApi.post(`${BASE}/tickets/${id}/replies`, body),
  closeTicket: (id) => studentApi.post(`${BASE}/tickets/${id}/close`, {}),
};
