(() => {
  const toggle = document.getElementById('accountToggle');
  const menu = document.getElementById('accountMenu');
  const dialog = document.getElementById('mailLoginDialog');
  const form = document.getElementById('mailLoginForm');
  const email = document.getElementById('mailLoginEmail');
  const password = document.getElementById('mailLoginPassword');
  const status = document.getElementById('mailLoginStatus');
  const save = document.getElementById('mailLoginSave');
  const logout = document.getElementById('mailLogout');
  const open = document.getElementById('mailLoginOpen');
  function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  function update(data) {
    email.value = data.email || '';
    logout.hidden = !data.loggedIn;
    toggle.title = data.loggedIn ? `Mail account: ${data.email}` : 'Mail account options';
  }
  toggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) open.focus();
  });
  document.addEventListener('click', event => { if (!event.target.closest('.account-menu')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
  open.addEventListener('click', () => { closeMenu(); status.textContent = ''; dialog.showModal(); email.focus(); });
  document.getElementById('mailLoginClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { password.value = ''; toggle.focus(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    save.disabled = true;
    status.textContent = 'Checking your Hostinger login…';
    try {
      const response = await fetch('/api/mail-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed. Please try again.');
      update(data);
      password.value = '';
      status.textContent = 'Login saved. Future emails will use this account.';
    } catch (error) { status.textContent = error.message; }
    finally { save.disabled = false; }
  });
  logout.addEventListener('click', async () => {
    logout.disabled = true;
    try {
      const response = await fetch('/api/mail-login', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not log out. Please try again.');
      update({});
      closeMenu();
      dialog.showModal();
      status.textContent = 'Logged out. Sending now uses the default server mailbox.';
    } catch (error) { closeMenu(); dialog.showModal(); status.textContent = error.message; }
    finally { logout.disabled = false; }
  });
  fetch('/api/mail-login').then(response => response.ok ? response.json() : null).then(data => { if (data) update(data); }).catch(() => {});
})();
