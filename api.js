// api.js
const API_BASE = 'http://38.242.144.86:3000/api/v1'; // pas aan naar je domein indien nodig

function saveToken(token) {
  localStorage.setItem('widgetToken', token);
}

function getToken() {
  return localStorage.getItem('widgetToken');
}

function clearToken() {
  localStorage.removeItem('widgetToken');
}

function getAuthHeaders() {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let msg = 'Login mislukt';
    try {
      const data = await res.json();
      if (data.msg) msg = data.msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json();
  saveToken(data.token);
  return data;
}

async function logout() {
  clearToken();
}

async function fetchFeedback() {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Niet ingelogd of sessie verlopen.');
  }

  if (!res.ok) {
    let msg = 'Kon feedback niet ophalen';
    try {
      const data = await res.json();
      if (data.msg) msg = data.msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

// Export voor gebruik in andere scripts (of hang het op window)
window.WidgetApi = {
  login,
  logout,
  fetchFeedback,
  getToken,
};
