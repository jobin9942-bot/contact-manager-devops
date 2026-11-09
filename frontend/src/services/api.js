const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');
export async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } }); }
  catch { throw new Error('Unable to reach the server. Check your connection and try again.'); }
  if (response.status === 204) return null;
  let body; try { body = await response.json(); } catch { throw new Error('The server returned an unexpected response.'); }
  if (!response.ok || body.success === false) throw new Error(body.error || 'Request failed.');
  return body.data;
}
export const api = {
  stats: () => request('/stats'),
  contacts: params => request(`/contacts?${new URLSearchParams(params)}`),
  contact: id => request(`/contacts/${id}`),
  create: data => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: id => request(`/contacts/${id}`, { method: 'DELETE' }),
};
