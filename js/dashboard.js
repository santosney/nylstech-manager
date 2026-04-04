// ==================== script.js ====================

// =====================================================
// INITIALISATION DES ICÔNES LUCIDE
// =====================================================
lucide.createIcons();

// =====================================================
// SÉLECTEURS
// =====================================================
const body = document.body;
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const themeToggle = document.getElementById("themeToggle");

const notifToggle = document.getElementById("notifToggle");
const notifDropdown = document.getElementById("notifDropdown");

const userDropdownToggle = document.getElementById("userDropdownToggle");
const userDropdown = document.getElementById("userDropdown");

// =====================================================
// SIDEBAR MOBILE
// =====================================================
function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
  body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
  body.style.overflow = "";
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("open");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeSidebar();
  }
});

// =====================================================
// DARK MODE
// =====================================================
const THEME_KEY = "nylstask-theme";

function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_KEY, theme);
  updateChartsTheme();
}

function toggleTheme() {
  const currentTheme = localStorage.getItem(THEME_KEY) || "light";
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

themeToggle.addEventListener("click", toggleTheme);

// Appliquer le thème enregistré au chargement
const savedTheme = localStorage.getItem(THEME_KEY) || "light";
setTheme(savedTheme);

// =====================================================
// DROPDOWNS
// =====================================================
function closeAllDropdowns(except = null) {
  [notifDropdown, userDropdown].forEach((dropdown) => {
    if (dropdown !== except) dropdown.classList.remove("open");
  });
}

notifToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = !notifDropdown.classList.contains("open");
  closeAllDropdowns();
  if (willOpen) notifDropdown.classList.add("open");
});

userDropdownToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = !userDropdown.classList.contains("open");
  closeAllDropdowns();
  if (willOpen) userDropdown.classList.add("open");
});

document.addEventListener("click", (e) => {
  if (!notifDropdown.contains(e.target) && !notifToggle.contains(e.target)) {
    notifDropdown.classList.remove("open");
  }

  if (!userDropdown.contains(e.target) && !userDropdownToggle.contains(e.target)) {
    userDropdown.classList.remove("open");
  }
});

// =====================================================
// BOUTONS DE VUE GRILLE/LISTE (interaction visuelle)
// =====================================================
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// =====================================================
// GRAPHIQUES CHART.JS
// =====================================================
let progressChart;
let statusChart;

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function createCharts() {
  const progressCtx = document.getElementById("projectProgressChart");
  const statusCtx = document.getElementById("projectStatusChart");

  const textMuted = getCSSVar("--text-muted");
  const borderColor = getCSSVar("--border");
  const blue = getCSSVar("--blue");
  const green = getCSSVar("--green");
  const gold = getCSSVar("--gold");
  const purple = getCSSVar("--purple");

  if (progressChart) progressChart.destroy();
  if (statusChart) statusChart.destroy();

  progressChart = new Chart(progressCtx, {
    type: "bar",
    data: {
      labels: ["Projet Alpha", "Refonte Site Web", "API Mobile", "Dashboard Analytics"],
      datasets: [
        {
          label: "Avancement",
          data: [65, 40, 80, 95],
          backgroundColor: [blue, green, green, purple],
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 42
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#0f172a",
          padding: 12,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.raw}% terminé`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textMuted,
            font: {
              size: 12,
              weight: "600"
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: textMuted,
            callback: (value) => `${value}%`
          },
          grid: {
            color: borderColor
          }
        }
      }
    }
  });

  statusChart = new Chart(statusCtx, {
    type: "doughnut",
    data: {
      labels: ["Actifs", "En révision", "Terminés"],
      datasets: [
        {
          data: [4, 1, 1],
          backgroundColor: [green, gold, blue],
          borderWidth: 0,
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      animation: {
        duration: 900
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textMuted,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 18,
            font: {
              size: 13,
              weight: "600"
            }
          }
        },
        tooltip: {
          backgroundColor: "#0f172a",
          padding: 12,
          cornerRadius: 10
        }
      }
    }
  });
}

function updateChartsTheme() {
  createCharts();
}

window.addEventListener("load", createCharts);

// =====================================================
// HOVER PROGRESS ANIMATION SUR LES CARTES
// =====================================================
document.querySelectorAll(".project-card").forEach((card) => {
  const progress = card.querySelector(".progress-bar span");
  if (!progress) return;

  const originalWidth = progress.style.width;
  card.addEventListener("mouseenter", () => {
    progress.style.filter = "brightness(1.05)";
  });

  card.addEventListener("mouseleave", () => {
    progress.style.width = originalWidth;
    progress.style.filter = "brightness(1)";
  });
});

// =====================================================
// NOTIFICATION SIMULÉE
// =====================================================
setTimeout(() => {
  const badge = document.querySelector(".notif-badge");
  if (badge) {
    badge.textContent = "4";
  }
}, 5000);