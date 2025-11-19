// Minimal auth helper for login/signup pages with small UX helpers

async function requestJson(url, data) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: json.error || json.message || 'Request failed' };
    return { ok: true, status: res.status, ...json };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
}

async function login({ email, password }) {
  if (!email || !password) return { ok: false, error: 'Email and password required' };
  return await requestJson('/api/auth/login', { email, password });
}

async function signup({ name, email, password }) {
  if (!name || !email || !password) return { ok: false, error: 'Name, email and password required' };
  return await requestJson('/api/auth/signup', { name, email, password });
}

// Small helper to toggle password visibility
function togglePassword(fieldId, toggleButtonId) {
  const input = document.getElementById(fieldId);
  const btn = document.getElementById(toggleButtonId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    if (btn) btn.textContent = 'Show';
  }
}

// Expose functions globally for inline usage
window.login = login;
window.signup = signup;
window.togglePassword = togglePassword;
