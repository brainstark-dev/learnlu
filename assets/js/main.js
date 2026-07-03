/* ============================================================
   LearnLu — main.js
   ============================================================ */
'use strict';

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---- Active nav link ---- */
function setActiveLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
}
setActiveLink();

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const s = hamburger.querySelectorAll('span');
    if (menuOpen) {
      s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      s[1].style.opacity = '0';
      s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      s[0].style.transform = s[2].style.transform = '';
      s[1].style.opacity = '';
    }
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ---- Scroll reveal ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const ans  = item.querySelector('.faq-a');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').classList.remove('show');
    });
    if (!wasOpen) { item.classList.add('open'); ans.classList.add('show'); }
  });
});

/* ---- Quiz handler ---- */
document.querySelectorAll('.quiz-box').forEach(box => {
  const opts = box.querySelectorAll('.quiz-option');
  const fb   = box.querySelector('.quiz-feedback');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      if (box.dataset.answered) return;
      box.dataset.answered = '1';
      const correct = opt.dataset.correct === 'true';
      opt.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) {
        opts.forEach(o => o.dataset.correct === 'true' && o.classList.add('correct'));
      }
      if (fb) {
        fb.textContent = correct
          ? '🎉 Correct! Great job!'
          : '❌ Not quite — the correct answer is highlighted above.';
        fb.style.color = correct ? 'var(--green)' : 'var(--red)';
        fb.classList.add('show');
      }
    });
  });
});

/* ---- Reading progress bar ---- */
const fill = document.querySelector('.reading-fill');
if (fill) {
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    fill.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
}

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: 'smooth' }); }
  });
});

/* ---- Counter animation ---- */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      el.textContent = Math.floor(end * (1 - Math.pow(1-p, 3))).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ---- Toast ---- */
window.showToast = (msg, type = 'success') => {
  const t = document.createElement('div');
  Object.assign(t.style, {
    position:'fixed', bottom:'24px', right:'24px', zIndex:'10000',
    background: type==='success' ? '#f0fdf4' : '#fef2f2',
    color: type==='success' ? 'var(--green)' : 'var(--red)',
    border: `1.5px solid ${type==='success' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`,
    padding:'14px 20px', borderRadius:'12px', fontFamily:'var(--font-b)',
    fontSize:'0.875rem', fontWeight:'600', boxShadow:'var(--shadow)',
    animation:'fadeUp 0.3s ease', maxWidth:'320px'
  });
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='0.3s'; setTimeout(()=>t.remove(),300); }, 3000);
};

/* ---- Subscribe form ---- */
const subForm = document.getElementById('subForm');
if (subForm) {
  subForm.addEventListener('submit', e => {
    e.preventDefault();
    const em = subForm.querySelector('input[type=email]').value;
    if (em) { showToast('🎉 Subscribed! Check your inbox.'); subForm.reset(); }
  });
}

/* ---- Lesson search ---- */
const searchInput = document.getElementById('lessonSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.lesson-card[data-title]').forEach(card => {
      const match = card.dataset.title.toLowerCase().includes(q) || card.dataset.tags.toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}
