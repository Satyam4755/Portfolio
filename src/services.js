const API_BASE = '/api';
const TOKEN_KEY = 'admin_token';

function authHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function loginAdmin(password) {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
  localStorage.setItem(TOKEN_KEY, data.token);
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getPublicPortfolio() {
  return request('/portfolio', { method: 'GET' });
}

export function getAdminPortfolio() {
  return request('/admin/portfolio', { method: 'GET' });
}

export function saveAdminPortfolio(payload) {
  return request('/admin/portfolio', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadAdminMedia(file, options = {}) {
  const fileDataUrl = await fileToDataUrl(file);
  return request('/admin/upload', {
    method: 'POST',
    body: JSON.stringify({
      fileDataUrl,
      resourceType: options.resourceType || 'auto',
      folder: options.folder || 'portfolio-admin'
    })
  });
}
