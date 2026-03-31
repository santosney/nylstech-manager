/**
 * NylsTask — dashboard.js
 * Jour 2 : DOM, événements, filtrage dynamique, responsive behaviour
 */

"use strict";

/* ────────────────────────────────────────────────────────────────
   1. SÉLECTION DES ÉLÉMENTS
   ──────────────────────────────────────────────────────────────── */
const menuToggle     = document.getElementById("menuToggle");
const sidebarNav     = document.getElementById("sidebarNav");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const userMenuBtn    = document.getElementById("userMenuBtn");
const userDropdown   = document.getElementById("userDropdown");
const searchInput    = document.getElementById("searchProjects");
const projectsGrid   = document.getElementById("projectsGrid");
const projectCount   = document.getElementById("projectCount");
const viewGridBtn    = document.getElementById("viewGrid");
const viewListBtn    = document.getElementById("viewList");
const statusFilters  = document.getElementById("statusFilters");
const allCards       = document.querySelectorAll(".project-card[data-status]");


/* ────────────────────────────────────────────────────────────────
   2. SIDEBAR — Toggle mobile
   ──────────────────────────────────────────────────────────────── */

/**
 * Ouvre la sidebar sur mobile
 */
function openSidebar() {
  sidebarNav.classList.add("is-open");
  sidebarOverlay.classList.add("is-visible");
  sidebarOverlay.removeAttribute("aria-hidden");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fermer le menu de navigation");
  // Empêcher le scroll du body
  document.body.style.overflow = "hidden";
}

/**
 * Ferme la sidebar sur mobile
 */
function closeSidebar() {
  sidebarNav.classList.remove("is-open");
  sidebarOverlay.classList.remove("is-visible");
  sidebarOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu de navigation");
  document.body.style.overflow = "";
}

// Toggle au clic sur le hamburger
menuToggle.addEventListener("click", () => {
  const isOpen = sidebarNav.classList.contains("is-open");
  isOpen ? closeSidebar() : openSidebar();
});

// Fermer en cliquant sur l'overlay
sidebarOverlay.addEventListener("click", closeSidebar);

// Fermer avec Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (sidebarNav.classList.contains("is-open")) closeSidebar();
    if (!userDropdown.hidden) closeUserMenu();
  }
});

// Fermer la sidebar si resize vers desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    closeSidebar();
  }
});


/* ────────────────────────────────────────────────────────────────
   3. MENU UTILISATEUR — Dropdown
   ──────────────────────────────────────────────────────────────── */

function openUserMenu() {
  userDropdown.hidden = false;
  userMenuBtn.setAttribute("aria-expanded", "true");
}

function closeUserMenu() {
  userDropdown.hidden = true;
  userMenuBtn.setAttribute("aria-expanded", "false");
}

userMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  userDropdown.hidden ? openUserMenu() : closeUserMenu();
});

// Fermer le menu en cliquant ailleurs
document.addEventListener("click", (e) => {
  if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    closeUserMenu();
  }
});


/* ────────────────────────────────────────────────────────────────
   4. FILTRES PAR STATUT
   ──────────────────────────────────────────────────────────────── */

/**
 * Récupère les statuts cochés dans les filtres
 * @returns {string[]} tableau des valeurs cochées
 */
function getActiveFilters() {
  const checkboxes = statusFilters.querySelectorAll("input:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Filtre les cartes selon les statuts actifs et la recherche
 */
function applyFilters() {
  const activeStatuses = getActiveFilters();
  const searchQuery    = searchInput.value.toLowerCase().trim();
  let   visibleCount   = 0;

  allCards.forEach(card => {
    const cardStatus = card.dataset.status;
    const cardTitle  = card.querySelector(".card-title")?.textContent.toLowerCase() ?? "";
    const cardDesc   = card.querySelector(".card-description")?.textContent.toLowerCase() ?? "";

    // Vérifier si le statut correspond
    const statusMatch =
      activeStatuses.includes("all") ||
      activeStatuses.includes(cardStatus) ||
      activeStatuses.length === 0;

    // Vérifier si la recherche correspond
    const searchMatch =
      !searchQuery ||
      cardTitle.includes(searchQuery) ||
      cardDesc.includes(searchQuery);

    if (statusMatch && searchMatch) {
      card.style.display = "";
      card.removeAttribute("aria-hidden");
      visibleCount++;
    } else {
      card.style.display = "none";
      card.setAttribute("aria-hidden", "true");
    }
  });

  // Mettre à jour le compteur
  if (projectCount) {
    projectCount.textContent = visibleCount;
  }

  // Message si aucun résultat
  showEmptyState(visibleCount === 0);
}

/**
 * Affiche ou masque le message "aucun résultat"
 * @param {boolean} isEmpty
 */
function showEmptyState(isEmpty) {
  let emptyMsg = document.getElementById("emptyState");

  if (isEmpty && !emptyMsg) {
    emptyMsg = document.createElement("p");
    emptyMsg.id = "emptyState";
    emptyMsg.className = "empty-state";
    emptyMsg.setAttribute("role", "status");
    emptyMsg.textContent = "Aucun projet ne correspond à votre recherche.";
    projectsGrid.after(emptyMsg);
  } else if (!isEmpty && emptyMsg) {
    emptyMsg.remove();
  }
}

// Écouter les changements de filtres
if (statusFilters) {
  statusFilters.addEventListener("change", () => {
    // Si "Tous" est coché, décocher les autres (et vice-versa)
    const allCheckbox = statusFilters.querySelector("#filterAll");
    const otherCheckboxes = statusFilters.querySelectorAll("input:not(#filterAll)");

    statusFilters.addEventListener("change", (e) => {
      if (e.target.id === "filterAll" && e.target.checked) {
        otherCheckboxes.forEach(cb => { cb.checked = false; });
      } else if (e.target.id !== "filterAll" && e.target.checked) {
        if (allCheckbox) allCheckbox.checked = false;
      }
    }, { once: false });

    applyFilters();
  });
}


/* ────────────────────────────────────────────────────────────────
   5. RECHERCHE EN TEMPS RÉEL — avec debounce
   ──────────────────────────────────────────────────────────────── */

/**
 * Debounce — évite d'exécuter trop de fois pendant la frappe
 * @param {Function} fn     Fonction à débouncer
 * @param {number}   delay  Délai en ms
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedFilter = debounce(applyFilters, 250);

if (searchInput) {
  searchInput.addEventListener("input", debouncedFilter);

  // Vider avec Escape dans le champ de recherche
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      applyFilters();
      searchInput.blur();
    }
  });
}


/* ────────────────────────────────────────────────────────────────
   6. TOGGLE VUE — Grille / Liste
   ──────────────────────────────────────────────────────────────── */

function setView(view) {
  if (!projectsGrid) return;

  if (view === "list") {
    projectsGrid.classList.add("projects-grid--list");
    projectsGrid.classList.remove("projects-grid--grid");
    viewGridBtn.classList.remove("active");
    viewGridBtn.setAttribute("aria-pressed", "false");
    viewListBtn.classList.add("active");
    viewListBtn.setAttribute("aria-pressed", "true");
  } else {
    projectsGrid.classList.remove("projects-grid--list");
    projectsGrid.classList.add("projects-grid--grid");
    viewListBtn.classList.remove("active");
    viewListBtn.setAttribute("aria-pressed", "false");
    viewGridBtn.classList.add("active");
    viewGridBtn.setAttribute("aria-pressed", "true");
  }

  // Persister la préférence utilisateur
  localStorage.setItem("nylstask_view", view);
}

if (viewGridBtn) viewGridBtn.addEventListener("click", () => setView("grid"));
if (viewListBtn) viewListBtn.addEventListener("click", () => setView("list"));

// Restaurer la préférence au chargement
const savedView = localStorage.getItem("nylstask_view");
if (savedView) setView(savedView);


/* ────────────────────────────────────────────────────────────────
   7. PROTECTION DE ROUTE — vérifier la session
   ──────────────────────────────────────────────────────────────── */
(function checkSession() {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (!token) {
    // Pas de token = rediriger vers login
    window.location.replace("login.html");
  }

  // Afficher le nom utilisateur si disponible
  const userRaw = localStorage.getItem("user");
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      const userNameEl = document.querySelector(".user-name");
      if (userNameEl && user.name) {
        userNameEl.textContent = user.name;
      }
    } catch (_) { /* ignorer */ }
  }
})();


/* ────────────────────────────────────────────────────────────────
   8. INITIALISATION
   ──────────────────────────────────────────────────────────────── */
(function init() {
  // Appliquer les filtres par défaut au chargement
  applyFilters();

  console.info(
    "%c NylsTask — Dashboard chargé ",
    "background:#0D2137;color:#fff;padding:4px 8px;border-radius:4px;"
  );
})();
