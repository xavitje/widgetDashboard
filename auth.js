// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  async function handleLogin(e) {
    e.preventDefault();
    loginError.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      loginError.textContent = 'Vul email en wachtwoord in.';
      return;
    }

    try {
      await window.WidgetApi.login(email, password);
      loginForm.reset();
      document.body.classList.add('is-logged-in');
      await loadFeedbackAndRender();
    } catch (err) {
      loginError.textContent = err.message;
    }
  }

  async function handleLogout() {
    await window.WidgetApi.logout();
    document.body.classList.remove('is-logged-in');
    // eventueel UI leegmaken
    const list = document.getElementById('feedback-list');
    if (list) list.innerHTML = '';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Bij initial load: als er al een token is, direct proberen feedback te laden
  if (window.WidgetApi.getToken()) {
    document.body.classList.add('is-logged-in');
    loadFeedbackAndRender().catch(() => {
      // token ongeldig → uitloggen
      handleLogout();
    });
  }
});
