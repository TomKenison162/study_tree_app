const BASE = '/api';

function getToken() {
  return localStorage.getItem('study_tree_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),
  saveSession: (body) => request('/sessions', { method: 'POST', body }),
  getSessions: (limit = 20, offset = 0) => request(`/sessions?limit=${limit}&offset=${offset}`),
  getStats: () => request('/stats'),
};
