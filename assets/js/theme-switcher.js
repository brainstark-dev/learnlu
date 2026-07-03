/* ============================================================
   LearnLu — Theme Switcher
   Floating palette button · 8 themes · saves preference
   ============================================================ */
'use strict';

/* ---- Theme definitions ---- */
const LEARNLU_THEMES = [
  {
    id: 'forest',
    name: 'Forest',
    swatch1: '#16A34A',
    swatch2: '#0ABFA3',
    label: 'Default'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    swatch1: '#1A6BF0',
    swatch2: '#0ABFA3',
    label: ''
  },
  {
    id: 'sunset',
    name: 'Sunset',
    swatch1: '#EA580C',
    swatch2: '#F59E0B',
    label: ''
  },
  {
    id: 'royal',
    name: 'Royal',
    swatch1: '#7C3AED',
    swatch2: '#EC4899',
    label: ''
  },
  {
    id: 'midnight',
    name: 'Dark',
    swatch1: '#3B82F6',
    swatch2: '#10B981',
    label: ''
  },
  {
    id: 'rose',
    name: 'Rose',
    swatch1: '#E11D48',
    swatch2: '#F97316',
    label: ''
  },
  {
    id: 'slate',
    name: 'Slate',
    swatch1: '#0F766E',
    swatch2: '#0284C7',
    label: ''
  },
  {
    id: 'golden',
    name: 'Golden',
    swatch1: '#B45309',
    swatch2: '#047857',
    label: ''
  }
];

/* ---- State ---- */
const STORAGE_KEY = 'learnlu_theme';
const DEFAULT_THEME = 'forest';
let currentTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
let panelOpen = false;

/* ---- Apply theme to <html> ---- */
function applyTheme(id, animate) {
  if (animate) {
    document.body.classList.add('theme-transitioning');
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 400);
  }
  document.documentElement.setAttribute('data-theme', id);
  currentTheme = id;
  localStorage.setItem(STORAGE_KEY, id);
  updatePanelActiveState();
  updateFabColor();
}

function updateFabColor() {
  const fab = document.getElementById('ce-theme-fab');
  if (!fab) return;
  const t = LEARNLU_THEMES.find(t => t.id === currentTheme);
  if (t) fab.style.background = t.swatch1;
}

function updatePanelActiveState() {
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeId === currentTheme);
  });
}

/* ---- Build & inject the switcher HTML ---- */
function buildSwitcher() {
  const optionsHtml = LEARNLU_THEMES.map(t => `
    <button class="theme-opt ${t.id === currentTheme ? 'active' : ''}"
            data-theme-id="${t.id}"
            onclick="ceSelectTheme('${t.id}')"
            title="${t.name}${t.label ? ' (' + t.label + ')' : ''}">
      <div class="theme-swatch">
        <div class="theme-swatch-half" style="background:${t.swatch1}"></div>
        <div class="theme-swatch-half" style="background:${t.swatch2}"></div>
        <div class="theme-check">✓</div>
      </div>
      <span class="theme-opt-name">${t.name}${t.label ? '<br><span style="color:var(--blue);font-size:0.6rem">★ Default</span>' : ''}</span>
    </button>
  `).join('');

  const html = `
    <!-- Theme Switcher -->
    <div class="theme-backdrop" id="ce-theme-backdrop" onclick="ceClosePanel()"></div>

    <div class="theme-panel" id="ce-theme-panel">
      <div class="theme-panel-header">
        <h4>🎨 Choose Your Theme</h4>
        <p>Your choice is saved automatically</p>
      </div>
      <div class="theme-options">${optionsHtml}</div>
      <div class="theme-panel-footer">
        <p>Preference saved in browser</p>
        <button class="theme-save-btn" onclick="ceClosePanel()">Done ✓</button>
      </div>
    </div>

    <button class="theme-fab" id="ce-theme-fab" onclick="ceTogglePanel()" aria-label="Change colour theme" title="Change colour theme">
      🎨
    </button>
    <div class="theme-fab-label">Change theme</div>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  updateFabColor();
}

/* ---- Panel open / close ---- */
function ceTogglePanel() {
  panelOpen ? ceClosePanel() : ceOpenPanel();
}

function ceOpenPanel() {
  panelOpen = true;
  const panel    = document.getElementById('ce-theme-panel');
  const backdrop = document.getElementById('ce-theme-backdrop');
  const fab      = document.getElementById('ce-theme-fab');
  panel.classList.add('open');
  backdrop.classList.add('open');
  fab.classList.add('open');
  updatePanelActiveState();
}

function ceClosePanel() {
  panelOpen = false;
  const panel    = document.getElementById('ce-theme-panel');
  const backdrop = document.getElementById('ce-theme-backdrop');
  const fab      = document.getElementById('ce-theme-fab');
  panel.classList.remove('open');
  backdrop.classList.remove('open');
  fab.classList.remove('open');
}

/* ---- Theme select (called from inline onclick) ---- */
window.ceSelectTheme = function(id) {
  applyTheme(id, true);
};

window.ceTogglePanel  = ceTogglePanel;
window.ceOpenPanel    = ceOpenPanel;
window.ceClosePanel   = ceClosePanel;

/* ---- Keyboard: Escape closes panel ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panelOpen) ceClosePanel();
});

/* ---- Init ---- */
function initThemeSwitcher() {
  applyTheme(currentTheme, false);
  buildSwitcher();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitcher);
} else {
  initThemeSwitcher();
}
