/* ============================================================
   LearnLu — Cookie Consent Banner
   Required for AdSense compliance (GDPR/cookie law)
   ============================================================ */
(function() {
  'use strict';

  const COOKIE_KEY = 'learnlu_cookie_consent';

  function hasConsent() {
    return localStorage.getItem(COOKIE_KEY) === 'accepted';
  }

  function setConsent(value) {
    localStorage.setItem(COOKIE_KEY, value);
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.transform = 'translateY(120%)';
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 400);
    }
  }

  function showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:220px;">
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#1A202C;line-height:1.65;margin:0 0 4px;font-weight:600;">🍪 We use cookies</p>
          <p style="font-family:system-ui,sans-serif;font-size:12px;color:#4A5568;line-height:1.65;margin:0;">
            LearnLu uses cookies to improve your experience and show relevant ads via Google AdSense.
            By continuing, you agree to our
            <a href="/pages/privacy.html" style="color:#16A34A;text-decoration:underline;">Privacy Policy</a>.
          </p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
          <button id="cookie-reject" style="padding:8px 16px;background:transparent;border:1.5px solid #CBD5E0;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;color:#4A5568;font-family:system-ui,sans-serif;">Decline</button>
          <button id="cookie-accept" style="padding:8px 18px;background:#16A34A;color:#fff;border:none;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;font-family:system-ui,sans-serif;">Accept</button>
        </div>
      </div>
    `;

    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%) translateY(0)',
      width: 'min(600px, calc(100vw - 32px))',
      background: '#fff',
      border: '1.5px solid #E2E8F0',
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      zIndex: '9999',
      transition: 'transform 0.35s ease, opacity 0.35s ease',
    });

    document.body.appendChild(banner);

    document.getElementById('cookie-accept').onclick = () => setConsent('accepted');
    document.getElementById('cookie-reject').onclick = () => setConsent('declined');
  }

  // Show banner if not yet consented
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!hasConsent()) setTimeout(showBanner, 1500);
    });
  } else {
    if (!hasConsent()) setTimeout(showBanner, 1500);
  }
})();
