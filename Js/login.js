/* =========================================
   NylsTask — Login Page Scripts
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Toggle visibilité mot de passe ---- */
  const toggleBtn = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';

      // Swap l'icône
      toggleBtn.querySelector('.icon-eye').style.display     = isHidden ? 'none'  : 'block';
      toggleBtn.querySelector('.icon-eye-off').style.display = isHidden ? 'block' : 'none';

      // Accessibilité
      toggleBtn.setAttribute('aria-label', isHidden ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    });
  }

  /* ---- Soumission du formulaire (démo) ---- */
  const form      = document.getElementById('login-form');
  const submitBtn = document.getElementById('btn-submit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email    = document.getElementById('email').value.trim();
      const password = passwordInput ? passwordInput.value : '';

      // Validation basique
      if (!email || !password) {
        showError(!email ? 'email' : 'password', 'Ce champ est obligatoire.');
        return;
      }

      if (!isValidEmail(email)) {
        showError('email', 'Veuillez entrer une adresse e-mail valide.');
        return;
      }

      clearErrors();

      // État chargement
      submitBtn.classList.add('is-loading');

      // Simulation appel API (à remplacer par votre vraie logique)
      await simulateAuth(email, password);

      submitBtn.classList.remove('is-loading');
    });
  }

  /* ---- Helpers ---- */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    clearFieldError(field);

    field.classList.add('field-input--error');
    field.setAttribute('aria-invalid', 'true');

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');

    field.closest('.field-group')?.appendChild(errorEl);
  }

  function clearFieldError(field) {
    field.classList.remove('field-input--error');
    field.removeAttribute('aria-invalid');
    field.closest('.field-group')?.querySelector('.field-error')?.remove();
  }

  function clearErrors() {
    document.querySelectorAll('.field-input--error').forEach(f => clearFieldError(f));
  }

  async function simulateAuth(email, password) {
    return new Promise(resolve => setTimeout(resolve, 1400));
    // Remplacez par : return fetch('/api/login', { method:'POST', body: JSON.stringify({email,password}) })
  }

  /* ---- Supprime l'erreur à la saisie ---- */
  document.querySelectorAll('.field-input').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

});
