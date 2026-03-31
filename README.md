# NylsTask Manager — Jour 2

> Livrable de la séance du **31 mars 2026**
> Formation Développeur Fullstack — NYLSTECH DIGITAL / EDEC Sarl

---

## Structure du projet

```
nylstask-j2/
├── login.html          → Page de connexion (HTML5 sémantique + formulaire natif)
├── dashboard.html      → Tableau de bord (CSS Grid + Flexbox + ProjectCard)
├── css/
│   ├── style.css       → Design system global (variables, reset, composants)
│   ├── login.css       → Styles spécifiques à la page login
│   └── dashboard.css   → Layout Grid, sidebar, cartes, responsive
├── js/
│   ├── login.js        → Validation formulaire, toggle password, API simulée
│   └── dashboard.js    → Sidebar mobile, filtres, recherche, toggle vue
└── README.md
```

---

## Ce que couvre ce code — Jour 2

| Concept | Fichier | Ligne(s) |
|---|---|---|
| HTML5 sémantique (`header`, `main`, `article`, `aside`, `section`, `time`) | `dashboard.html` | Tout le fichier |
| Formulaire HTML5 natif (`required`, `type="email"`, `minlength`, `autocomplete`, `aria-describedby`) | `login.html` | Lignes 70–120 |
| Accessibilité (`aria-label`, `aria-current`, `role`, `aria-invalid`) | Les deux HTML | Partout |
| Variables CSS (`:root`, design system complet) | `css/style.css` | Lignes 1–90 |
| Reset moderne (`box-sizing: border-box`) | `css/style.css` | Ligne 97 |
| Flexbox — navbar, header, cartes, options | `css/dashboard.css` | Lignes 1–110 |
| CSS Grid — layout dashboard | `css/dashboard.css` | Lignes 115–175 |
| CSS Grid — grille auto-fill cartes | `css/dashboard.css` | Lignes 245–265 |
| Mobile First (3 breakpoints) | `css/dashboard.css` | Lignes 150–175 |
| Responsive login (2 colonnes tablette+) | `css/login.css` | Lignes 15–55 |
| Validation JS sans framework | `js/login.js` | Lignes 40–120 |
| Debounce — recherche temps réel | `js/dashboard.js` | Lignes 130–145 |
| Toggle sidebar mobile | `js/dashboard.js` | Lignes 30–70 |
| Filtrage dynamique des cartes | `js/dashboard.js` | Lignes 90–130 |

---

## Compte de démonstration

```
Email    : demo@nylstech.com
Password : nylstech2026
```

---

## Ouvrir le projet

```bash
# Option 1 — Live Server (VS Code)
# Clic droit sur login.html → "Open with Live Server"

# Option 2 — Python
python3 -m http.server 3000
# Ouvrir http://localhost:3000/login.html
```

---

## Points à retenir — Règles fondamentales

1. **`box-sizing: border-box`** — toujours, en premier dans le CSS
2. **Variables CSS** — définir une fois dans `:root`, réutiliser partout
3. **Flexbox** pour les composants, **Grid** pour l'architecture de page
4. **Mobile First** — coder le mobile par défaut, enrichir avec `min-width`
5. **Sémantique HTML5** — `article` pour ProjectCard, `aside` pour la sidebar, `time datetime=""` pour les dates
6. **Accessibilité** — `aria-label` sur les nav multiples, `aria-invalid` sur les inputs, `aria-current="page"` sur le lien actif
7. **Git** — committer avant de partir : `feat(html-css): pages login et dashboard NylsTask — responsive`

---

## Prochaine étape — Jour 3 (01 avril 2026)

Introduction à l'UX/UI — ce code sera recodé avec **Tailwind CSS** :

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

*NYLSTECH DIGITAL — Promotion Mars – Mai 2026*
