/**
 * NylsTask — login.js
 * Jour 2 : JavaScript ES6+ — Manipulation du DOM, événements,
 *           validation de formulaire, gestion d'états UI
 */

"use strict";

/* ────────────────────────────────────────────────────────────────
   1. SÉLECTION DES ÉLÉMENTS DU DOM
   ──────────────────────────────────────────────────────────────── */
const form          = document.getElementById("loginForm");
const emailInput    = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailGroup    = document.getElementById("emailGroup");
const passwordGroup = document.getElementById("passwordGroup");
const emailError    = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formError     = document.getElementById("formError");
const formErrorText = document.getElementById("formErrorText");
const submitBtn     = document.getElementById("submitBtn");
const togglePwd     = document.getElementById("togglePassword");
const eyeIcon       = document.getElementById("eyeIcon");


/* ────────────────────────────────────────────────────────────────
   2. VALIDATION — Fonctions pures
   ──────────────────────────────────────────────────────────────── */

/**
 * Valide un email avec une regex simple
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valide le mot de passe (min 8 caractères)
 * @param {string} password
 * @returns {boolean}
 */
function isValidPassword(password) {
  return password.length >= 8;
}

/**
 * Affiche une erreur sur un champ
 * @param {HTMLElement} group  - Le .field-group parent
 * @param {HTMLElement} errorEl - Le span.field-error
 * @param {string}      message - Le message à afficher
 */
function showFieldError(group, errorEl, message) {
  group.classList.add("field-group--error");
  group.classList.remove("field-group--success");
  errorEl.textContent = message;

  // Accessibilité : marquer l'input comme invalide
  const input = group.querySelector("input");
  if (input) input.setAttribute("aria-invalid", "true");
}

/**
 * Affiche un succès sur un champ
 * @param {HTMLElement} group
 * @param {HTMLElement} errorEl
 */
function showFieldSuccess(group, errorEl) {
  group.classList.remove("field-group--error");
  group.classList.add("field-group--success");
  errorEl.textContent = "";

  const input = group.querySelector("input");
  if (input) input.setAttribute("aria-invalid", "false");
}

/**
 * Réinitialise l'état d'un champ
 * @param {HTMLElement} group
 * @param {HTMLElement} errorEl
 */
function resetField(group, errorEl) {
  group.classList.remove("field-group--error", "field-group--success");
  errorEl.textContent = "";

  const input = group.querySelector("input");
  if (input) input.setAttribute("aria-invalid", "false");
}

/**
 * Valide tous les champs du formulaire
 * @returns {boolean} true si tout est valide
 */
function validateForm() {
  let isValid = true;

  /* Validation email */
  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    showFieldError(emailGroup, emailError, "L'adresse e-mail est requise.");
    isValid = false;
  } else if (!isValidEmail(emailVal)) {
    showFieldError(emailGroup, emailError, "Veuillez saisir une adresse e-mail valide.");
    isValid = false;
  } else {
    showFieldSuccess(emailGroup, emailError);
  }

  /* Validation mot de passe */
  const pwdVal = passwordInput.value;
  if (!pwdVal) {
    showFieldError(passwordGroup, passwordError, "Le mot de passe est requis.");
    isValid = false;
  } else if (!isValidPassword(pwdVal)) {
    showFieldError(passwordGroup, passwordError, "Le mot de passe doit contenir au moins 8 caractères.");
    isValid = false;
  } else {
    showFieldSuccess(passwordGroup, passwordError);
  }

  return isValid;
}


/* ────────────────────────────────────────────────────────────────
   3. GESTION DES ÉTATS UI
   ──────────────────────────────────────────────────────────────── */

/** Met le bouton en état chargement */
function setLoading(isLoading) {
  const btnText   = submitBtn.querySelector(".btn__text");
  const btnLoader = submitBtn.querySelector(".btn__loader");

  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.classList.add("btn--loading");
    btnText.textContent   = "Connexion…";
    btnLoader.hidden       = false;
    submitBtn.setAttribute("aria-busy", "true");
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove("btn--loading");
    btnText.textContent   = "Se connecter";
    btnLoader.hidden       = true;
    submitBtn.removeAttribute("aria-busy");
  }
}

/** Affiche une erreur globale */
function showGlobalError(message) {
  formErrorText.textContent = message;
  formError.hidden = false;
  formError.focus();
}

/** Masque l'erreur globale */
function hideGlobalError() {
  formError.hidden = true;
  formErrorText.textContent = "";
}


/* ────────────────────────────────────────────────────────────────
   4. SIMULATION D'APPEL API
   ──────────────────────────────────────────────────────────────── */

/**
 * Simule un appel API de connexion (sera remplacé par Axios + Laravel en Semaine 4)
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ success: boolean, token?: string, message?: string }>}
 */
function fakeLoginAPI(credentials) {
  return new Promise((resolve) => {
    // Simule un délai réseau de 1.5s
    setTimeout(() => {
      // Compte de démonstration — sera remplacé par l'API Laravel
      if (
        credentials.email    === "demo@nylstech.com" &&
        credentials.password === "nylstech2026"
      ) {
        resolve({
          success: true,
          token:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo",
          user:    { name: "Jean Paul", role: "admin" }
        });
      } else {
        resolve({
          success: false,
          message: "Identifiants incorrects. Essayez demo@nylstech.com / nylstech2026"
        });
      }
    }, 1500);
  });
}


/* ────────────────────────────────────────────────────────────────
   5. SOUMISSION DU FORMULAIRE
   ──────────────────────────────────────────────────────────────── */
form.addEventListener("submit", async (event) => {
  // Empêcher le rechargement de la page
  event.preventDefault();

  // Masquer les erreurs précédentes
  hideGlobalError();

  // Valider le formulaire
  const isValid = validateForm();
  if (!isValid) {
    // Focus sur le premier champ en erreur
    const firstError = form.querySelector("[aria-invalid='true']");
    if (firstError) firstError.focus();
    return;
  }

  // Mettre le bouton en état chargement
  setLoading(true);

  try {
    // Appel API (simulé — sera remplacé par axiosClient.post("/login"))
    const response = await fakeLoginAPI({
      email:    emailInput.value.trim(),
      password: passwordInput.value
    });

    if (response.success) {
      // Stocker le token (sera géré par AuthContext en React)
      localStorage.setItem("ACCESS_TOKEN", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Rediriger vers le dashboard
      window.location.href = "dashboard.html";
    } else {
      // Afficher l'erreur du serveur
      showGlobalError(response.message || "Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }

  } catch (error) {
    // Erreur réseau ou serveur
    showGlobalError("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    console.error("Erreur de connexion :", error);
    setLoading(false);
  }
});


/* ────────────────────────────────────────────────────────────────
   6. VALIDATION EN TEMPS RÉEL (au blur)
   ──────────────────────────────────────────────────────────────── */

// Valider l'email quand l'utilisateur quitte le champ
emailInput.addEventListener("blur", () => {
  const val = emailInput.value.trim();
  if (!val) return; // Ne pas valider un champ vide avant soumission
  if (!isValidEmail(val)) {
    showFieldError(emailGroup, emailError, "Adresse e-mail invalide.");
  } else {
    showFieldSuccess(emailGroup, emailError);
  }
});

// Effacer l'erreur email dès que l'utilisateur recommence à taper
emailInput.addEventListener("input", () => {
  if (emailGroup.classList.contains("field-group--error")) {
    resetField(emailGroup, emailError);
  }
  hideGlobalError();
});

// Valider le mot de passe au blur
passwordInput.addEventListener("blur", () => {
  const val = passwordInput.value;
  if (!val) return;
  if (!isValidPassword(val)) {
    showFieldError(passwordGroup, passwordError, "Minimum 8 caractères requis.");
  } else {
    showFieldSuccess(passwordGroup, passwordError);
  }
});

// Effacer l'erreur mot de passe à la saisie
passwordInput.addEventListener("input", () => {
  if (passwordGroup.classList.contains("field-group--error")) {
    resetField(passwordGroup, passwordError);
  }
  hideGlobalError();
});


/* ────────────────────────────────────────────────────────────────
   7. TOGGLE VISIBILITÉ MOT DE PASSE
   ──────────────────────────────────────────────────────────────── */
togglePwd.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";

  // Basculer le type
  passwordInput.type = isPassword ? "text" : "password";

  // Mettre à jour l'attribut ARIA
  togglePwd.setAttribute("aria-pressed", String(isPassword));
  togglePwd.setAttribute(
    "aria-label",
    isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
  );

  // Changer l'icône
  eyeIcon.textContent = isPassword ? "🙈" : "👁";

  // Remettre le focus sur l'input
  passwordInput.focus();
});


/* ────────────────────────────────────────────────────────────────
   8. VÉRIFICATION SESSION AU CHARGEMENT
   ──────────────────────────────────────────────────────────────── */
(function checkExistingSession() {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    // Si déjà connecté, rediriger vers le dashboard
    window.location.replace("dashboard.html");
  }
})();


/* ────────────────────────────────────────────────────────────────
   9. INFOS DÉVELOPPEUR (console uniquement)
   ──────────────────────────────────────────────────────────────── */
console.info(
  "%c NylsTask — Page Login chargée ",
  "background:#0D2137;color:#fff;padding:4px 8px;border-radius:4px;"
);
console.info("Compte de démo : demo@nylstech.com / nylstech2026");
