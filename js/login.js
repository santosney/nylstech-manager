/**
 * NylsTask — Login Page Script
 * Handles: form validation, password toggle, submit states, toast feedback
 */

(function () {
  'use strict';

  /* ── DOM references ── */
  const form          = document.getElementById('login-form');
  const emailInput    = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const toggleBtn     = document.getElementById('toggle-password');
  const iconEye       = document.getElementById('icon-eye');
  const iconEyeOff    = document.getElementById('icon-eye-off');
  const submitBtn     = document.getElementById('btn-submit');
  const toast         = document.getElementById('toast');
  const groupEmail    = document.getElementById('group-email');
  const groupPassword = document.getElementById('group-password');
  const emailError    = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  /* ── Regex ── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ============================================================
     PASSWORD VISIBILITY TOGGLE
     ============================================================ */
  toggleBtn.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    iconEye.style.display    = isPassword ? 'none'  : 'block';
    iconEyeOff.style.display = isPassword ? 'block' : 'none';
    toggleBtn.setAttribute(
      'aria-label',
      isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
    );
    /* Keep focus on field */
    passwordInput.focus();
  });

  /* ============================================================
     VALIDATION HELPERS
     ============================================================ */

  /**
   * Show an error on a form group.
   * @param {HTMLElement} group   - .form__group element
   * @param {HTMLElement} errorEl - .form__error span
   * @param {string}      message - error text
   */
  function showError(group, errorEl, message) {
    group.classList.add('has-error');
    errorEl.textContent = message;
  }

  /**
   * Clear error from a form group.
   */
  function clearError(group, errorEl) {
    group.classList.remove('has-error');
    errorEl.textContent = '';
  }

  /**
   * Validate the email field.
   * @returns {boolean}
   */
  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      showError(groupEmail, emailError, 'L\'adresse e-mail est requise.');
      return false;
    }
    if (!EMAIL_RE.test(val)) {
      showError(groupEmail, emailError, 'Veuillez entrer une adresse e-mail valide.');
      return false;
    }
    clearError(groupEmail, emailError);
    return true;
  }

  /**
   * Validate the password field.
   * @returns {boolean}
   */
  function validatePassword() {
    const val = passwordInput.value;
    if (!val) {
      showError(groupPassword, passwordError, 'Le mot de passe est requis.');
      return false;
    }
    if (val.length < 6) {
      showError(groupPassword, passwordError, 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    clearError(groupPassword, passwordError);
    return true;
  }

  /* ── Live validation on blur ── */
  emailInput.addEventListener('blur', function () {
    if (emailInput.value.length > 0) validateEmail();
  });

  passwordInput.addEventListener('blur', function () {
    if (passwordInput.value.length > 0) validatePassword();
  });

  /* ── Clear error on input ── */
  emailInput.addEventListener('input', function () {
    if (groupEmail.classList.contains('has-error')) clearError(groupEmail, emailError);
  });

  passwordInput.addEventListener('input', function () {
    if (groupPassword.classList.contains('has-error')) clearError(groupPassword, passwordError);
  });

  /* ============================================================
     TOAST NOTIFICATION
     ============================================================ */
  let toastTimeout = null;

  /**
   * Show a toast message.
   * @param {string} message
   * @param {'error'|'success'} type
   * @param {number} duration  - ms before auto-dismiss (0 = permanent)
   */
  function showToast(message, type, duration) {
    if (toastTimeout) clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.className = 'toast toast--' + type;

    if (duration && duration > 0) {
      toastTimeout = setTimeout(function () { dismissToast(); }, duration);
    }
  }

  function dismissToast() {
    toast.className = 'toast';
    toast.textContent = '';
  }

  /* ============================================================
     SUBMIT BUTTON STATE
     ============================================================ */

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
  }

  /* ============================================================
     FAKE AUTH (simulates API call)
     Replace this with your real authentication logic.
     ============================================================ */

  /**
   * Simulate an async login request.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  function mockAuthRequest(email, password) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        /* Demo credentials — replace with real API */
        if (email === 'demo@nylstech.com' && password === 'demo1234') {
          resolve({ success: true,  message: 'Connexion réussie ! Redirection en cours…' });
        } else {
          resolve({ success: false, message: 'Identifiants incorrects. Vérifiez votre e-mail et mot de passe.' });
        }
      }, 1400);
    });
  }

  /* ============================================================
     FORM SUBMIT
     ============================================================ */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    dismissToast();

    /* Run validation */
    const emailOk    = validateEmail();
    const passwordOk = validatePassword();

    if (!emailOk || !passwordOk) {
      /* Focus the first invalid field */
      if (!emailOk) emailInput.focus();
      else passwordInput.focus();
      return;
    }

    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    /* Start loading */
    setLoading(true);

    try {
      const result = await mockAuthRequest(email, password);

      if (result.success) {
        showToast(result.message, 'success', 0);
        /* Simulate redirect after a short delay */
        setTimeout(function () {
          /* window.location.href = '/dashboard'; */
          console.log('[NylsTask] Redirecting to dashboard…');
        }, 1500);
      } else {
        showToast(result.message, 'error', 6000);
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (err) {
      showToast('Une erreur réseau s\'est produite. Veuillez réessayer.', 'error', 6000);
      console.error('[NylsTask] Auth error:', err);
    } finally {
      setLoading(false);
    }
  });

  /* ============================================================
     LINKS (prevent default for demo)
     ============================================================ */
  document.getElementById('link-register').addEventListener('click', function (e) {
    e.preventDefault();
    console.log('[NylsTask] Navigate → Register page');
  });

  document.getElementById('link-forgot').addEventListener('click', function (e) {
    e.preventDefault();
    console.log('[NylsTask] Navigate → Forgot password page');
  });

  /* ============================================================
     KEYBOARD: ESC dismisses toast
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismissToast();
  });

})();
